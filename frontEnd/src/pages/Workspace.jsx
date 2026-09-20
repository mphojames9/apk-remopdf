import { useState, useRef, useCallback, useEffect } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import { Link } from 'react-router-dom';
import image1 from '../assets/remopdf.png';


const FONT_SIZE_OPTIONS = [10, 12, 14, 16, 20, 24, 32];

// Minimum height (as a multiple of font size) for an edited-text cover/patch
// box, used only when the run's own detected height is smaller than that.
// Was 1.25, which is taller than most real single-line leading and could
// spill down into the line below; 1.15 covers a font's normal ascent +
// descent without the extra padding that caused the overlap.
const EDIT_LINE_HEIGHT_FACTOR = 1.15;

const FONT_FAMILIES = [
  { id: "Helvetica", label: "Helvetica", css: "Helvetica, Arial, sans-serif" },
  { id: "TimesRoman", label: "Times New Roman", css: '"Times New Roman", Times, serif' },
  { id: "Courier", label: "Courier", css: '"Courier New", Courier, monospace' },
];

// Highlighter marker colors offered while the Highlight tool is active.
// Every highlight carries its own opacity (chosen with the slider in the
// toolbar for new marks, or per mark in the inspector), applied both on
// screen and in the exported PDF. The maximum is capped so the underlying
// text always stays readable.
const HIGHLIGHT_COLORS = ["#FDE047", "#86EFAC", "#F9A8D4", "#93C5FD", "#FDBA74"];
const DEFAULT_HIGHLIGHT_OPACITY = 0.25;
const MIN_HIGHLIGHT_OPACITY = 0.1;
const MAX_HIGHLIGHT_OPACITY = 0.8;
const HIGHLIGHT_OPACITY_STEP = 0.05;

function highlightOpacityOf(h) {
  return typeof h.opacity === "number" ? h.opacity : DEFAULT_HIGHLIGHT_OPACITY;
}

// --- Touch highlighting -------------------------------------------------------
// On a touch screen a plain one-finger drag has to keep scrolling the page, so
// highlighting there is press-and-hold: hold a finger on a word until it buzzes
// and lights up, drag to extend the mark (it auto-scrolls near the edge of the
// scroll area), lift to keep it. It's handled here with pointer events instead
// of the browser's own text selection, which on touch screens hands control to
// native selection handles that a web page can neither observe nor finish.
const TOUCH_HL_LONG_PRESS_MS = 300; // hold time before a press becomes a highlight
const TOUCH_HL_SLOP_PX = 10; // finger travel that turns a hold into a plain scroll
const TOUCH_HL_MAX_REACH_PX = 28; // how far from any text a press may land and still start a mark
const TOUCH_HL_EDGE_PX = 56; // within this of the scroll area's edge, dragging auto-scrolls
const TOUCH_HL_MAX_SCROLL_STEP = 14; // px per frame at the very edge

const isSpaceChar = (ch) => /\s/.test(ch);

// Every run of text in the pdf.js text layer, with its box in the layer's own
// coordinates (so the cache stays valid while the page scrolls under the finger).
function collectTextRuns(container) {
  const base = container.getBoundingClientRect();
  const runs = [];
  container.querySelectorAll("span").forEach((el) => {
    const node = el.firstChild;
    if (!node || node.nodeType !== 3 || !node.data) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    runs.push({
      node,
      left: r.left - base.left,
      right: r.right - base.left,
      top: r.top - base.top,
      bottom: r.bottom - base.top,
    });
  });
  return runs;
}

// The character of the text nearest a screen point. Lines win over columns:
// the closest line vertically is picked first, then the closest run on it.
// Fingers are fat, so a point in a margin still snaps to the nearest text
// unless maxReach says how far away is too far.
function textPositionAt(runs, base, clientX, clientY, maxReach = Infinity) {
  const x = clientX - base.left;
  const y = clientY - base.top;
  let best = null;
  let bestScore = Infinity;
  let bestDx = 0;
  let bestDy = 0;
  for (const run of runs) {
    const dy = y < run.top ? run.top - y : y > run.bottom ? y - run.bottom : 0;
    const dx = x < run.left ? run.left - x : x > run.right ? x - run.right : 0;
    const score = dy * 1000 + dx;
    if (score < bestScore) {
      best = run;
      bestScore = score;
      bestDx = dx;
      bestDy = dy;
    }
  }
  if (!best || Math.hypot(bestDx, bestDy) > maxReach) return null;

  const { node } = best;
  const len = node.data.length;
  let charIndex = len - 1;
  if (clientX <= base.left + best.left) {
    charIndex = 0;
  } else if (clientX < base.left + best.right) {
    const probe = document.createRange();
    for (let i = 0; i < len; i++) {
      probe.setStart(node, i);
      probe.setEnd(node, i + 1);
      if (clientX < probe.getBoundingClientRect().right) {
        charIndex = i;
        break;
      }
    }
  }
  return { node, charIndex };
}

function wordStartAt(text, i) {
  if (isSpaceChar(text[i])) return Math.min(i + 1, text.length);
  while (i > 0 && !isSpaceChar(text[i - 1])) i--;
  return i;
}

function wordEndAt(text, i) {
  if (isSpaceChar(text[i])) return i;
  while (i < text.length && !isSpaceChar(text[i])) i++;
  return i;
}

// The word under (or, when the finger landed in a gap, right next to) a character.
function wordBoundsAt(text, i) {
  if (isSpaceChar(text[i])) {
    for (let d = 1; d < text.length; d++) {
      if (i - d >= 0 && !isSpaceChar(text[i - d])) return { start: wordStartAt(text, i - d), end: wordEndAt(text, i - d) };
      if (i + d < text.length && !isSpaceChar(text[i + d])) return { start: wordStartAt(text, i + d), end: wordEndAt(text, i + d) };
    }
    return { start: i, end: i };
  }
  return { start: wordStartAt(text, i), end: wordEndAt(text, i) };
}

function comparePositions(a, b) {
  if (a.node === b.node) return a.offset - b.offset;
  return a.node.compareDocumentPosition(b.node) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

// A Range's client rects list a fully selected element's box AND its text, so
// the same words come back two or three times over — which stacks translucent
// marks into a darker one. This folds them into a single rectangle per stretch
// of a line ({ left, top, width, height } in client coordinates).
function mergeLineRects(rects) {
  const items = Array.from(rects)
    .filter((r) => r.width > 1 && r.height > 1)
    .map((r) => ({ left: r.left, right: r.right, top: r.top, bottom: r.bottom }))
    .sort((a, b) => a.top + a.bottom - (b.top + b.bottom));

  const lines = [];
  for (const it of items) {
    const line = lines[lines.length - 1];
    if (line) {
      const overlap = Math.min(line.bottom, it.bottom) - Math.max(line.top, it.top);
      if (overlap >= 0.5 * Math.min(line.bottom - line.top, it.bottom - it.top)) {
        line.top = Math.min(line.top, it.top);
        line.bottom = Math.max(line.bottom, it.bottom);
        line.items.push(it);
        continue;
      }
    }
    lines.push({ top: it.top, bottom: it.bottom, items: [it] });
  }

  const out = [];
  for (const line of lines) {
    const height = line.bottom - line.top;
    const gap = height * 0.6; // about a couple of spaces
    line.items.sort((a, b) => a.left - b.left);
    const pieces = [];
    for (const it of line.items) {
      const last = pieces[pieces.length - 1];
      if (last && it.left <= last.right + gap) last.right = Math.max(last.right, it.right);
      else pieces.push({ left: it.left, right: it.right });
    }
    // every piece on a line shares the line's top and bottom
    for (const pc of pieces) out.push({ left: pc.left, top: line.top, width: pc.right - pc.left, height });
  }
  return out;
}

// Highlight boxes as ratios of the page, from client rects: the same shape the
// highlights themselves are stored in, with a little vertical padding so the
// mark reads as a highlighter stroke rather than a tight box around the glyphs.
function rectsToStageBoxes(rects, stageRect) {
  if (!stageRect.width || !stageRect.height) return [];
  return rects.map((r) => {
    const padY = r.height * 0.15;
    return {
      xRatio: (r.left - stageRect.left) / stageRect.width,
      yRatio: (r.top - stageRect.top - padY) / stageRect.height,
      widthRatio: r.width / stageRect.width,
      heightRatio: (r.height + padY * 2) / stageRect.height,
    };
  });
}

function edgeScrollSpeed(pos, lo, hi) {
  if (pos < lo + TOUCH_HL_EDGE_PX) {
    return -Math.ceil(TOUCH_HL_MAX_SCROLL_STEP * Math.min(1, (lo + TOUCH_HL_EDGE_PX - pos) / TOUCH_HL_EDGE_PX));
  }
  if (pos > hi - TOUCH_HL_EDGE_PX) {
    return Math.ceil(TOUCH_HL_MAX_SCROLL_STEP * Math.min(1, (pos - (hi - TOUCH_HL_EDGE_PX)) / TOUCH_HL_EDGE_PX));
  }
  return 0;
}

// Wires the press-and-hold-then-drag gesture onto the text layer. Nothing here
// touches React: it reports what to draw through onPreview(rects | null) and
// what to keep through onCommit(rects), both in client coordinates.
function createTouchHighlighter({ container, getScroller, onPreview, onCommit }) {
  let g = null; // the touch in progress, if any

  function end() {
    if (!g) return;
    clearTimeout(g.timer);
    if (g.raf) cancelAnimationFrame(g.raf);
    g = null;
    container.classList.remove("hl-touch");
    onPreview(null);
  }

  // The selection so far: the word that was pressed, stretched to the word
  // under the finger now (whichever direction it's dragged).
  function computeRange() {
    const { word } = g;
    let start = { node: word.node, offset: word.start };
    let stop = { node: word.node, offset: word.end };
    const focus = textPositionAt(g.runs, container.getBoundingClientRect(), g.x, g.y);
    if (focus) {
      const at = { node: focus.node, offset: focus.charIndex };
      const text = focus.node.data;
      if (comparePositions(at, start) < 0) start = { node: focus.node, offset: wordStartAt(text, focus.charIndex) };
      else if (comparePositions(at, stop) >= 0) stop = { node: focus.node, offset: wordEndAt(text, focus.charIndex) };
    }
    const range = document.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(stop.node, stop.offset);
    return range;
  }

  function refresh() {
    try {
      const rects = mergeLineRects(computeRange().getClientRects());
      const key = rects.map((r) => [r.left, r.top, r.width, r.height].map(Math.round).join(",")).join(";");
      if (key === g.key) return;
      g.key = key;
      onPreview(rects);
    } catch (err) {
      end(); // the text layer was rebuilt under us
    }
  }

  function step() {
    if (!g || !g.armed) return;
    g.raf = null;
    let moved = false;
    const scroller = getScroller && getScroller();
    if (scroller) {
      const box = scroller.getBoundingClientRect();
      const dx = edgeScrollSpeed(g.x, box.left, box.right);
      const dy = edgeScrollSpeed(g.y, box.top, box.bottom);
      if (dx || dy) {
        const top = scroller.scrollTop;
        const left = scroller.scrollLeft;
        scroller.scrollBy(dx, dy);
        moved = scroller.scrollTop !== top || scroller.scrollLeft !== left;
      }
    }
    refresh();
    if (g && moved) g.raf = requestAnimationFrame(step); // keep going while the finger rests at the edge
  }

  function arm() {
    if (!g) return;
    g.timer = null;
    const runs = collectTextRuns(container);
    const pos = textPositionAt(runs, container.getBoundingClientRect(), g.x, g.y, TOUCH_HL_MAX_REACH_PX);
    if (!pos) {
      g.failed = true; // pressed on empty margin: do nothing, but keep native selection suppressed until lift
      return;
    }
    const { start, end: stop } = wordBoundsAt(pos.node.data, pos.charIndex);
    g.runs = runs;
    g.word = { node: pos.node, start, end: stop };
    g.armed = true;
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (err) {
      // not supported here
    }
    refresh();
  }

  function onPointerDown(e) {
    if (e.pointerType !== "touch" || !e.isPrimary) {
      end(); // a mouse, a pen, or a second finger (pinching): not ours
      return;
    }
    end();
    g = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      armed: false,
      failed: false,
      runs: null,
      word: null,
      key: "",
      raf: null,
      timer: null,
    };
    // Set before the browser's own long-press can start selecting text.
    container.classList.add("hl-touch");
    g.timer = setTimeout(arm, TOUCH_HL_LONG_PRESS_MS);
  }

  function onPointerMove(e) {
    if (!g || e.pointerId !== g.id) return;
    g.x = e.clientX;
    g.y = e.clientY;
    if (!g.armed) {
      // Moved before the hold finished: the person is scrolling, so let them.
      if (!g.failed && Math.hypot(g.x - g.startX, g.y - g.startY) > TOUCH_HL_SLOP_PX) end();
      return;
    }
    if (!g.raf) g.raf = requestAnimationFrame(step);
  }

  function onPointerUp(e) {
    if (!g || e.pointerId !== g.id) return;
    if (!g.armed) {
      end();
      return;
    }
    if (g.raf) cancelAnimationFrame(g.raf);
    g.raf = null;
    g.x = e.clientX;
    g.y = e.clientY;
    let rects = [];
    try {
      rects = mergeLineRects(computeRange().getClientRects());
    } catch (err) {
      rects = [];
    }
    end();
    if (rects.length) onCommit(rects);
  }

  function onPointerCancel(e) {
    if (g && e.pointerId === g.id) end();
  }

  // Once the hold has become a highlight the drag belongs to it, not the scroller.
  function onTouchMove(e) {
    if (g && g.armed && e.cancelable) e.preventDefault();
  }
  function onContextMenu(e) {
    if (g) e.preventDefault(); // Android's long-press menu
  }
  function onSelectStart(e) {
    if (g) e.preventDefault();
  }

  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerup", onPointerUp);
  container.addEventListener("pointercancel", onPointerCancel);
  container.addEventListener("touchmove", onTouchMove, { passive: false });
  container.addEventListener("contextmenu", onContextMenu);
  container.addEventListener("selectstart", onSelectStart);

  return {
    destroy() {
      end();
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerCancel);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("contextmenu", onContextMenu);
      container.removeEventListener("selectstart", onSelectStart);
    },
  };
}

const TEXT_LAYER_CSS = `
.pdf-text-layer{--min-font-size:1;--text-scale-factor:calc(var(--total-scale-factor) * var(--min-font-size));--min-font-size-inv:calc(1 / var(--min-font-size));position:absolute;text-align:initial;inset:0;overflow:clip;opacity:1;line-height:1;-webkit-text-size-adjust:none;text-size-adjust:none;forced-color-adjust:none;transform-origin:0 0;caret-color:CanvasText;z-index:0;color-scheme:only light}
.pdf-text-layer :is(span,br){color:transparent;position:absolute;white-space:pre;cursor:text;transform-origin:0% 0%}
.pdf-text-layer > :not(.markedContent),.pdf-text-layer .markedContent span:not(.markedContent){z-index:1;--font-height:0;font-size:calc(var(--text-scale-factor) * var(--font-height));--scale-x:1;--rotate:0deg;transform:rotate(var(--rotate)) scaleX(var(--scale-x)) scale(var(--min-font-size-inv))}
.pdf-text-layer .markedContent{display:contents}
.pdf-text-layer ::selection{background:rgba(0,0,255,.25);background:color-mix(in srgb, AccentColor, transparent 75%)}
.pdf-text-layer br::selection{background:transparent}
.pdf-text-layer .endOfContent{display:block;position:absolute;inset:100% 0 0;z-index:0;cursor:default;-webkit-user-select:none;user-select:none}
.pdf-text-layer.selecting .endOfContent{top:0}
.pdf-text-layer.hl-touch,.pdf-text-layer.hl-touch *{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}
`;

const DEFAULT_COLOR = "#171717";
const DEFAULT_BG_COLOR = "#FFFFFF";
const DEFAULT_SIGNATURE_WIDTH_RATIO = 0.22;
const DEFAULT_IMAGE_WIDTH_RATIO = 0.3;
const DRAG_SLOP_PX = 4;

const STANDARD_FONT_VARIANTS = {
  Helvetica: {
    normal: "Helvetica",
    bold: "HelveticaBold",
    italic: "HelveticaOblique",
    boldItalic: "HelveticaBoldOblique",
  },
  TimesRoman: {
    normal: "TimesRoman",
    bold: "TimesRomanBold",
    italic: "TimesRomanItalic",
    boldItalic: "TimesRomanBoldItalic",
  },
  Courier: {
    normal: "Courier",
    bold: "CourierBold",
    italic: "CourierOblique",
    boldItalic: "CourierBoldOblique",
  },
};

function resolveStandardFont(fontFamily, bold, italic) {
  const variants = STANDARD_FONT_VARIANTS[fontFamily] || STANDARD_FONT_VARIANTS.Helvetica;
  if (bold && italic) return variants.boldItalic;
  if (bold) return variants.bold;
  if (italic) return variants.italic;
  return variants.normal;
}

function hexToRgb01(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255,
  };
}

function bytesToBase64(bytes) {
  const CHUNK_SIZE = 0x8000; // 32K chars at a time is safe for fromCharCode
  let binary = "";
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK_SIZE));
  }
  return btoa(binary);
}

function bytesToDownloadableDataUrl(bytes, mimeType, filename) {
  const base64 = bytesToBase64(bytes);
  return `data:${mimeType};name=${encodeURIComponent(filename)};base64,${base64}`;
}

function rotatedAnchor(centerX, centerY, width, height, angleDegCCW) {
  const rad = (angleDegCCW * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const halfW = width / 2;
  const halfH = height / 2;
  const offsetX = halfW * cos - halfH * sin;
  const offsetY = halfW * sin + halfH * cos;
  return { x: centerX - offsetX, y: centerY - offsetY };
}

// Page rotation. A page is shown (and exported) turned by its own /Rotate plus
// whatever turn was added in the editor; both are clockwise multiples of 90.
function normalizeRotation(deg) {
  return ((deg % 360) + 360) % 360;
}

// Everything the editor places is positioned on the page as it's *displayed*
// (origin bottom-left after the rotation is applied), but pdf-lib draws in the
// page's own unrotated space. makePageFrame bridges the two for one page:
//   width / height  the displayed size (swapped for 90° / 270°)
//   toPage(x, y)    a displayed point -> the page's own coordinates
//   place(x, y, a)  { x, y, rotate } for a draw call whose origin sits at the
//                   displayed point (x, y) and is turned `a` degrees CCW there
function makePageFrame(page, rotationDeg) {
  const { width: w, height: h } = page.getSize();
  const R = normalizeRotation(rotationDeg);
  const sideways = R === 90 || R === 270;
  const toPage = (x, y) => {
    switch (R) {
      case 90:
        return { x: w - y, y: x };
      case 180:
        return { x: w - x, y: h - y };
      case 270:
        return { x: y, y: h - x };
      default:
        return { x, y };
    }
  };
  return {
    width: sideways ? h : w,
    height: sideways ? w : h,
    toPage,
    place: (x, y, angleCCW = 0) => ({ ...toPage(x, y), rotate: degrees(angleCCW + R) }),
  };
}

let measureCanvas = null;
function measureTextWidth(text, { fontSize, fontFamily, bold, italic }) {
  if (!measureCanvas) measureCanvas = document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d");
  const weight = bold ? "700" : "400";
  const style = italic ? "italic" : "normal";
  ctx.font = `${style} ${weight} ${fontSize}px ${fontFamily}`;
  return ctx.measureText(text).width;
}

function measureFontMetrics(fontPx, { fontFamily, bold, italic }) {
  if (!measureCanvas) measureCanvas = document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d");
  ctx.font = `${italic ? "italic" : "normal"} ${bold ? "700" : "400"} ${fontPx}px ${fontFamily}`;
  const m = ctx.measureText("Hg");
  if (typeof m.fontBoundingBoxAscent !== "number") return null;
  return { ascent: m.fontBoundingBoxAscent, descent: m.fontBoundingBoxDescent };
}

const MONO_FONT_RE = /courier|consolas|menlo|monaco|inconsolata|lucidaconsole|typewriter|andale|mono(?!type)/;
const SERIF_FONT_RE = /times|georgia|garamond|palatino|bookantiqua|bookman|cambria|minion|caslon|baskerville|didot|bodoni|charter|constantia|utopia|sabon|merriweather|playfair|serif/;
const SANS_FONT_RE = /arial|helvetica|calibri|verdana|tahoma|segoe|roboto|opensans|gothic|sans|frutiger|myriad|univers|futura|avenir|trebuchet|montserrat|liberation/;

function guessFontStyle(rawName, fallbackCss, fontObj) {
  const name = String(rawName || "")
    .replace(/^[A-Z]{6}\+/, "")
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  let fontFamily;
  if (MONO_FONT_RE.test(name)) fontFamily = "Courier";
  else if (/sans/.test(name)) fontFamily = "Helvetica"; // must beat "serif" ("SansSerif")
  else if (SERIF_FONT_RE.test(name)) fontFamily = "TimesRoman";
  else if (SANS_FONT_RE.test(name)) fontFamily = "Helvetica";
  else if (fontObj && fontObj.isMonospace) fontFamily = "Courier";
  else if (fontObj && fontObj.isSerifFont) fontFamily = "TimesRoman";
  else {
    const fb = String(fallbackCss || "").toLowerCase();
    if (fb.includes("mono")) fontFamily = "Courier";
    else if (fb.includes("serif") && !fb.includes("sans")) fontFamily = "TimesRoman";
    else fontFamily = "Helvetica";
  }

  const isLight = /light|thin/.test(name);
  const bold =
    (/bold|black|heavy|demi|ultra/.test(name) && !isLight) || !!(fontObj && (fontObj.bold || fontObj.black));
  const italic = /italic|oblique|kursiv/.test(name) || !!(fontObj && fontObj.italic);
  return { fontFamily, bold, italic };
}

function rgbToHex(r, g, b) {
  const h = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function sampleTextAppearance(canvas, item) {
  const W = canvas.width;
  const H = canvas.height;
  if (!W || !H) return null;

  const bx0 = Math.max(0, Math.floor(item.xRatio * W));
  const by0 = Math.max(0, Math.floor(item.yRatio * H));
  const bx1 = Math.min(W, Math.ceil((item.xRatio + item.widthRatio) * W));
  const by1 = Math.min(H, Math.ceil((item.yRatio + item.heightRatio) * H));
  if (bx1 - bx0 < 1 || by1 - by0 < 1) return null;

  const RING = 3;
  const rx0 = Math.max(0, bx0 - RING);
  const ry0 = Math.max(0, by0 - RING);
  const rx1 = Math.min(W, bx1 + RING);
  const ry1 = Math.min(H, by1 + RING);
  const rw = rx1 - rx0;
  const rh = ry1 - ry0;

  let data;
  try {
    data = canvas.getContext("2d").getImageData(rx0, ry0, rw, rh).data;
  } catch (err) {
    return null;
  }

  // Composite over white in case any pixel isn't fully opaque.
  const pixel = (x, y) => {
    const i = (y * rw + x) * 4;
    const a = data[i + 3] / 255;
    return [
      data[i] * a + 255 * (1 - a),
      data[i + 1] * a + 255 * (1 - a),
      data[i + 2] * a + 255 * (1 - a),
    ];
  };
  const inBox = (x, y) => x >= bx0 - rx0 && x < bx1 - rx0 && y >= by0 - ry0 && y < by1 - ry0;

  const tally = (includeBox) => {
    const buckets = new Map();
    let count = 0;
    for (let y = 0; y < rh; y++) {
      for (let x = 0; x < rw; x++) {
        if (!includeBox && inBox(x, y)) continue;
        const [r, g, b] = pixel(x, y);
        const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
        const e = buckets.get(key);
        if (e) {
          e.n++;
          e.r += r;
          e.g += g;
          e.b += b;
        } else {
          buckets.set(key, { n: 1, r, g, b });
        }
        count++;
      }
    }
    let best = null;
    for (const e of buckets.values()) if (!best || e.n > best.n) best = e;
    return { best, count };
  };

  // Run sits against the page edge and there's no ring to read: use the box itself.
  let { best, count } = tally(false);
  if (!best || count < 12) ({ best } = tally(true));
  if (!best) return null;
  const bg = [best.r / best.n, best.g / best.n, best.b / best.n];

  const dist = (p) => Math.hypot(p[0] - bg[0], p[1] - bg[1], p[2] - bg[2]);
  let maxD = 0;
  for (let y = by0 - ry0; y < by1 - ry0; y++) {
    for (let x = bx0 - rx0; x < bx1 - rx0; x++) {
      const d = dist(pixel(x, y));
      if (d > maxD) maxD = d;
    }
  }

  const bgLuma = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2];
  const bgColor = rgbToHex(bg[0], bg[1], bg[2]);
  // Nothing stands out from the background (e.g. invisible text): fall back to
  // whichever of dark/light text is readable on it.
  if (maxD < 60) return { color: bgLuma > 140 ? DEFAULT_COLOR : "#ffffff", bgColor };

  let n = 0;
  let sr = 0;
  let sg = 0;
  let sb = 0;
  for (let y = by0 - ry0; y < by1 - ry0; y++) {
    for (let x = bx0 - rx0; x < bx1 - rx0; x++) {
      const p = pixel(x, y);
      if (dist(p) >= maxD * 0.9) {
        n++;
        sr += p[0];
        sg += p[1];
        sb += p[2];
      }
    }
  }
  return { color: rgbToHex(sr / n, sg / n, sb / n), bgColor };
}

// The size dropdowns list the usual sizes, plus whatever size a piece of
// existing text really is (e.g. 10.5) so the control can show it.
function sizeOptionsFor(current) {
  const opts = new Set(FONT_SIZE_OPTIONS);
  if (Number.isFinite(current)) opts.add(current);
  return [...opts].sort((a, b) => a - b);
}

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 400;

// Font size control that lets the person either pick a common size from a
// list or type any size themselves (e.g. 18.5). Backed by a text input +
// <datalist> rather than a plain <select> so both paths work, and it keeps
// its own "draft" text while focused so a decimal point being typed isn't
// clobbered by the parent re-rendering with the last committed number.
// The value only commits (and gets clamped/normalized) on blur or Enter.
function FontSizeInput({ id, value, options, onChange, className }) {
  const [draft, setDraft] = useState(String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(String(value));
  }, [value]);

  const commit = () => {
    const parsed = parseFloat(draft);
    if (Number.isFinite(parsed) && parsed > 0) {
      const clamped = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, parsed));
      setDraft(String(clamped));
      if (clamped !== value) onChange(clamped);
    } else {
      setDraft(String(value));
    }
  };

  return (
    <>
      <input
        type="text"
        inputMode="decimal"
        list={id}
        value={draft}
        onFocus={() => {
          focused.current = true;
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          focused.current = false;
          commit();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className={className}
      />
      <datalist id={id}>
        {options.map((size) => (
          <option key={size} value={size} />
        ))}
      </datalist>
    </>
  );
}

// Cheap "did anything change?" check for two document snapshots. Edits always
// create new item objects, so comparing items by reference is enough.
function sameItems(a, b) {
  return a.length === b.length && a.every((item, i) => item === b[i]);
}
function sameDocContents(a, b) {
  return (
    sameItems(a.fields, b.fields) &&
    sameItems(a.signatures, b.signatures) &&
    sameItems(a.images, b.images) &&
    sameItems(a.textEdits, b.textEdits) &&
    a.rotations === b.rotations
  );
}

// --- Small inline icons (no icon-library dependency) ------------------------
const ICON = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
function MenuIcon() { return (<svg {...ICON}><path d="M4 7h16M4 12h16M4 17h16" /></svg>); }
function ListIcon() { return (<svg {...ICON}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>); }
function CloseIcon() { return (<svg {...ICON}><path d="M6 6l12 12M18 6L6 18" /></svg>); }
function CursorIcon() { return (<svg {...ICON}><path d="M5 3l15 7-6.5 2-2 6.5z" /></svg>); }
function TextToolIcon() { return (<svg {...ICON}><path d="M5 5h14M12 5v14" /></svg>); }
function SignatureIcon() { return (<svg {...ICON}><path d="M3 16c2-4 4-4 6 0s4 4 6 0 4-4 6 0" /><path d="M4 20h16" /></svg>); }
function ImageToolIcon() { return (<svg {...ICON}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="M21 16l-5-5-4 4-2-2-5 5" /></svg>); }
function EditTextIcon() { return (<svg {...ICON}><path d="M4 20h4L18.5 9.5a2.1 2.1 0 00-3-3L5 17v3z" /><path d="M13 8l3 3" /><path d="M4 20h16" /></svg>); }
function HighlightIcon() { return (<svg {...ICON}><path d="M12 3l4 4-9 9H3v-4l9-9z" /><path d="M3 21h7" strokeWidth={3} /></svg>); }
function UndoIcon() { return (<svg {...ICON}><path d="M9 7L4 12l5 5" /><path d="M4 12h11a5 5 0 010 10h-1" /></svg>); }
function RedoIcon() { return (<svg {...ICON}><path d="M15 7l5 5-5 5" /><path d="M20 12H9a5 5 0 000 10h1" /></svg>); }
function DownloadIcon() { return (<svg {...ICON}><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" /></svg>); }
function MoreIcon() { return (<svg {...ICON} fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" /></svg>); }
function ChevronLeftIcon() { return (<svg {...ICON}><path d="M15 6l-6 6 6 6" /></svg>); }
function ChevronRightIcon() { return (<svg {...ICON}><path d="M9 6l6 6-6 6" /></svg>); }
function ZoomInIcon() { return (<svg {...ICON}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" /></svg>); }
function ZoomOutIcon() { return (<svg {...ICON}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35M8 11h6" /></svg>); }
function RotateLeftIcon() { return (<svg {...ICON}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>); }
function RotateRightIcon() { return (<svg {...ICON}><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>); }
function WatermarkIcon() { return (<svg {...ICON}><path d="M6 3h8l5 5v13H6z" /><path d="M14 3v5h5" /><path d="M9.5 17.5l5-5" strokeWidth={3} /></svg>); }

function ToolButton({ active, disabled, onClick, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-md text-[10px] font-medium shrink-0 min-w-[56px] ${
        active ? "bg-blue-50 text-blue-700" : "text-neutral-600 hover:bg-neutral-100"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
      <span>{title}</span>
    </button>
  );
}

// --- Signature drawing pad -------------------------------------------------
function SignaturePad({ onSave, onClose }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [penSize, setPenSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#171717";
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e) => {
    drawingRef.current = true;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = penSize;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setIsEmpty(false);
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (isEmpty) return;
    onSave(canvasRef.current.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4">
        <h3 className="text-sm font-semibold mb-2">Draw your signature</h3>
        <canvas
          ref={canvasRef}
          width={440}
          height={180}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="w-full border border-dashed border-neutral-300 rounded-md bg-neutral-50 touch-none cursor-crosshair"
        />

        <div className="flex items-center gap-3 mt-3">
          <label className="flex-1 flex items-center gap-2 text-xs text-neutral-600">
            Pen size
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={penSize}
              onChange={(e) => setPenSize(Number(e.target.value))}
              className="flex-1"
            />
          </label>
          <span
            className="rounded-full bg-neutral-900 shrink-0"
            style={{ width: penSize * 2 + 4, height: penSize * 2 + 4 }}
            aria-hidden="true"
          />
        </div>

        <div className="flex justify-between items-center mt-3">
          <button
            onClick={handleClear}
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            Clear
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-md border border-neutral-300 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isEmpty}
              className="px-3 py-1.5 rounded-md bg-neutral-900 text-white text-sm disabled:opacity-40"
            >
              Use signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PdfFillerApp() {
  const [pdfBytes, setPdfBytes] = useState(null); // ArrayBuffer of the original PDF
  const [fileName, setFileName] = useState("");
  const [pdfDoc, setPdfDoc] = useState(null); // pdfjs document proxy
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [viewport, setViewport] = useState(null); // current render viewport
  const [zoom, setZoom] = useState(1);
  const [thumbnails, setThumbnails] = useState([]); // dataURLs, index 0 = page 1

  // Existing text detected in the PDF itself (via pdf.js text extraction),
  // cached per page so revisiting a page doesn't re-read it. Shape:
  // { [pageNum]: { pageWidth, pageHeight, items: [{ key, str, xRatio, yRatio,
  //   widthRatio, heightRatio, baselineYRatio, fontSizePt, fontFamily, bold,
  //   italic }] } } — all ratios are relative to the page at scale 1, so
  // they're zoom-independent. fontFamily/bold/italic are the closest match
  // (among the fonts we can export with) to the PDF's own font for that run.
  const [pageTextIndex, setPageTextIndex] = useState({});

  // fields:     { id, page, xRatio, yRatio, text, fontSize, fontFamily, color, bold, italic, underline }
  // signatures: { id, page, xRatio, yRatio, widthRatio, aspectRatio, dataUrl }
  // images:     { id, page, xRatio, yRatio, widthRatio, aspectRatio, rotation, dataUrl }
  // textEdits:  { id, key, page, xRatio, yRatio, boxWidthRatio, boxHeightRatio,
  //               baselineYRatio, originalText, text, fontSize, fontFamily,
  //               color, bgColor, bold, italic } — an edit to text that was
  //               already in the PDF: on export the original is covered with
  //               a bgColor rectangle and `text` is drawn on top of it.
  // highlights: { id, page, xRatio, yRatio, widthRatio, heightRatio, color, opacity } —
  //              a translucent marker rectangle (see highlightOpacityOf) drawn
  //              under the page's own text; created from the page's real
  //              text selection while the Highlight tool is active.
  // rotations:  { [pageNum]: 90 | 180 | 270 } — the clockwise turn added to a page
  //              in the editor, on top of the PDF's own /Rotate (absent = none).
  const [doc, setDoc] = useState({ fields: [], signatures: [], images: [], textEdits: [], highlights: [], rotations: {} });
  const docRef = useRef(doc);
  docRef.current = doc;
  const { fields, signatures, images, textEdits, highlights, rotations } = doc;
  const pageRotation = rotations[pageNum] || 0; // current page's added turn
  // Existing-text detection depends on how the page is turned, so it's cached per rotation.
  const textIndexKey = `${pageNum}:${pageRotation}`;

  // --- Undo / redo -----------------------------------------------------------
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const [historyVersion, setHistoryVersion] = useState(0); // bump to re-render Undo/Redo buttons
  const canUndo = undoStackRef.current.length > 0;
  const canRedo = redoStackRef.current.length > 0;

  const setFields = useCallback((updater) => {
    setDoc((prev) => ({
      ...prev,
      fields: typeof updater === "function" ? updater(prev.fields) : updater,
    }));
  }, []);
  const setSignatures = useCallback((updater) => {
    setDoc((prev) => ({
      ...prev,
      signatures: typeof updater === "function" ? updater(prev.signatures) : updater,
    }));
  }, []);
  const setImages = useCallback((updater) => {
    setDoc((prev) => ({
      ...prev,
      images: typeof updater === "function" ? updater(prev.images) : updater,
    }));
  }, []);
  const setTextEdits = useCallback((updater) => {
    setDoc((prev) => ({
      ...prev,
      textEdits: typeof updater === "function" ? updater(prev.textEdits) : updater,
    }));
  }, []);
  const setHighlights = useCallback((updater) => {
    setDoc((prev) => ({
      ...prev,
      highlights: typeof updater === "function" ? updater(prev.highlights) : updater,
    }));
  }, []);

  // Call this right before a change you want on the undo stack. Kept as a
  // plain side-effecting function (not inside a setState updater) so it's
  // safe under React StrictMode's double-invoked updaters.
  const snapshotHistory = useCallback(() => {
    undoStackRef.current.push(docRef.current);
    if (undoStackRef.current.length > 100) undoStackRef.current.shift();
    redoStackRef.current = [];
    setHistoryVersion((v) => v + 1);
  }, []);

  const undo = useCallback(() => {
    if (undoStackRef.current.length === 0) return;
    const previous = undoStackRef.current.pop();
    redoStackRef.current.push(docRef.current);
    setDoc(previous);
    setHistoryVersion((v) => v + 1);
  }, []);

  const redo = useCallback(() => {
    if (redoStackRef.current.length === 0) return;
    const nextState = redoStackRef.current.pop();
    undoStackRef.current.push(docRef.current);
    setDoc(nextState);
    setHistoryVersion((v) => v + 1);
  }, []);

  // What's about to be placed on the next page click: a drawn signature or
  // an uploaded image, waiting for the user to choose where it goes.
  const [pendingPlacement, setPendingPlacement] = useState(null); // { type, dataUrl, aspectRatio, widthRatio }
  const [activeTool, setActiveTool] = useState("text"); // "select" | "text" | "edit-text" | "highlight"
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0]);
  const [highlightOpacity, setHighlightOpacity] = useState(DEFAULT_HIGHLIGHT_OPACITY);
  // Boxes (as page ratios) of the mark being drawn by a press-and-drag on touch, before it's kept.
  const [highlightDraft, setHighlightDraft] = useState(null);
  // What a highlight made right now would look like, for handlers that outlive a render.
  const highlightLatestRef = useRef({});
  highlightLatestRef.current = { color: highlightColor, opacity: highlightOpacity, page: pageNum };

  const [activeId, setActiveId] = useState(null); // id of active field, signature OR image
  const [hoveredId, setHoveredId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  // Responsive chrome: thumbnail drawer + inspector sheet on narrow screens.
  const [mobilePagesOpen, setMobilePagesOpen] = useState(false);
  const [mobileElementsOpen, setMobileElementsOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Watermark: baked into every page at download time (no on-page element
  // to place/drag, since it's meant to cover the whole page uniformly).
  // Off until the person turns it on from the Watermark button in the top bar.
  const [showWatermarkPanel, setShowWatermarkPanel] = useState(false);
  const [watermark, setWatermark] = useState({
    enabled: false,
    text: "CONFIDENTIAL",
    fontSize: 48,
    color: "#888888",
    opacity: 0.3,
    rotation: 45, // degrees, counter-clockwise
  });

  const canvasRef = useRef(null);
  const textLayerRef = useRef(null); // invisible selectable-text layer (Select tool)
  const pageScrollRef = useRef(null); // the scrolling area the page sits in (auto-scroll while highlighting on touch)
  const stageRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const dragStateRef = useRef(null); // { kind, id, offsetXRatio, offsetYRatio }
  const resizeStateRef = useRef(null); // { kind, id, startWidthRatio, startX }
  const rotateStateRef = useRef(null); // { id, centerX, centerY } (screen px)
  const activePointerIdRef = useRef(null); // the one pointer (finger/mouse) driving the current gesture
  const latestPointRef = useRef(null); // newest { x, y } seen; applied at most once per animation frame
  const rafRef = useRef(null);
  const gestureStartRef = useRef(null); // { x, y } where the current gesture began
  const gestureMovedRef = useRef(false); // true once the pointer has travelled past the tap slop

  // --- Load a new PDF file -------------------------------------------------
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const buf = await file.arrayBuffer();
      const parsed = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
      setPdfBytes(buf);
      setPdfDoc(parsed);
      setNumPages(parsed.numPages);
      setPageNum(1);
      setZoom(1);
      setDoc({ fields: [], signatures: [], images: [], textEdits: [], highlights: [], rotations: {} });
      setPageTextIndex({});
      undoStackRef.current = [];
      redoStackRef.current = [];
      setHistoryVersion((v) => v + 1);
      setPendingPlacement(null);
      setActiveTool("text");
      setActiveId(null);
      setMobilePagesOpen(false);
      setMobileElementsOpen(false);
      setFileName(file.name.replace(/\.pdf$/i, ""));
    } catch (err) {
      console.error(err);
      setError("Couldn't read that file. Make sure it's a valid PDF.");
    }
  };

  // --- Render the current page onto the canvas -----------------------------
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;

    (async () => {
      setIsRendering(true);
      try {
        const page = await pdfDoc.getPage(pageNum);
        const scale = 1.4 * zoom;
        const vp = page.getViewport({ scale, rotation: normalizeRotation(page.rotate + pageRotation) });
        if (cancelled) return;

        const canvas = canvasRef.current;
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport: vp }).promise;

        if (!cancelled) setViewport({ width: vp.width, height: vp.height, scale, rotation: vp.rotation });
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Couldn't render that page.");
      } finally {
        if (!cancelled) setIsRendering(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, pageNum, zoom, pageRotation]);

  // --- Detect existing text on the current page, so it can be edited -------
  // Reads each text run's position via pdf.js at scale 1 (i.e. in PDF point
  // units) and stores it as page-relative ratios, exactly like the fields we
  // let people drop — so the resulting overlay boxes are zoom-independent.
  useEffect(() => {
    if (!pdfDoc || pageTextIndex[textIndexKey]) return;
    let cancelled = false;

    (async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        // Parsing the page's content is what loads its fonts into
        // page.commonObjs (name, bold/italic/serif/mono flags). The render
        // effect does the same work and pdf.js shares it, so this is cheap.
        try {
          await page.getOperatorList();
        } catch (err) {
          console.warn("Couldn't load this page's fonts; text edits will use default styling", err);
        }
        if (cancelled) return;
        const [textContent, vp1] = await Promise.all([
          page.getTextContent(),
          Promise.resolve(page.getViewport({ scale: 1, rotation: normalizeRotation(page.rotate + pageRotation) })),
        ]);
        if (cancelled) return;

        const pageWidth = vp1.width;
        const pageHeight = vp1.height;
        const items = [];
        const styles = textContent.styles || {};
        const lookByFont = {}; // one guess per PDF font, not per text run
        const lookFor = (fontName) => {
          if (!lookByFont[fontName]) {
            let fontObj = null;
            try {
              fontObj = page.commonObjs.get(fontName);
            } catch (err) {
              // font not resolved — fall through to the generic family below
            }
            const realName = (fontObj && (fontObj.name || fontObj.fallbackName)) || "";
            lookByFont[fontName] = guessFontStyle(realName, styles[fontName]?.fontFamily, fontObj);
          }
          return lookByFont[fontName];
        };
        textContent.items.forEach((item, idx) => {
          if (!item.str || !item.str.trim() || !item.width) return;
          const tx = pdfjsLib.Util.transform(vp1.transform, item.transform);
          // Only text that reads left-to-right on screen can be edited; after a
          // page is turned sideways its lines run vertically and the box maths
          // below (which assumes horizontal runs) would be wrong for them.
          if (tx[0] <= 0 || Math.abs(tx[1]) > tx[0]) return;
          const fontHeight = Math.hypot(tx[2], tx[3]);
          if (!fontHeight) return;
          const look = lookFor(item.fontName);
          const left = tx[4];
          const baselineY = tx[5];
          const top = baselineY - fontHeight * 0.83; // approx ascent
          const height = fontHeight * 1.1; // approx ascent + descent
          items.push({
            key: `${pageNum}_${idx}`,
            str: item.str,
            xRatio: left / pageWidth,
            yRatio: top / pageHeight,
            widthRatio: item.width / pageWidth,
            heightRatio: height / pageHeight,
            baselineYRatio: baselineY / pageHeight,
            fontSizePt: fontHeight,
            fontFamily: look.fontFamily,
            bold: look.bold,
            italic: look.italic,
          });
        });

        if (!cancelled) {
          setPageTextIndex((prev) => ({ ...prev, [textIndexKey]: { pageWidth, pageHeight, items } }));
        }
      } catch (err) {
        console.error("Couldn't read the text on this page", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, pageNum, pageRotation, textIndexKey, pageTextIndex]);

  // --- Selectable text layer (Select tool) ------------------------------------
  // With the Select or Highlight tool active, an invisible layer of the page's
  // real text is laid over the canvas, exactly like a PDF reader's: drag to
  // select, double click a word, triple click a line, Ctrl/Cmd+A for
  // everything, Ctrl/Cmd+C to copy — and on touch screens, long-press. With
  // the Highlight tool, releasing that same drag-selection turns it into
  // marker rectangles instead (see the effect below). It's only mounted for
  // these two tools (the Text tool needs clicks to reach the canvas to drop a
  // field) and while nothing is waiting to be placed (same reason).
  const canSelectText = (activeTool === "select" || activeTool === "highlight") && !pendingPlacement && !!viewport;

  useEffect(() => {
    const container = textLayerRef.current;
    if (!container || !pdfDoc || !viewport || !canSelectText) return;
    let cancelled = false;
    let layer = null;
    container.replaceChildren();

    (async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        if (cancelled) return;

        // pdf.js sizes and positions everything from these CSS variables.
        container.style.setProperty("--total-scale-factor", String(viewport.scale));
        container.style.setProperty("--scale-factor", String(viewport.scale));
        container.style.setProperty("--scale-round-x", "1px");
        container.style.setProperty("--scale-round-y", "1px");
        layer = new pdfjsLib.TextLayer({
          textContentSource: textContent,
          container,
          viewport: page.getViewport({ scale: viewport.scale, rotation: viewport.rotation }),
        });
        // Match the canvas exactly (the constructor sizes it with calc()/round()).
        container.style.width = `${viewport.width}px`;
        container.style.height = `${viewport.height}px`;
        await layer.render();
        if (cancelled) return;

        // Catches the pointer while dragging through the gaps between words so
        // the selection follows the cursor instead of jumping to the page's end.
        const end = document.createElement("div");
        end.className = "endOfContent";
        container.append(end);
      } catch (err) {
        if (!cancelled && err?.name !== "AbortException") {
          console.error("Couldn't build the selectable text layer", err);
        }
      }
    })();

    // "selecting" makes the catch-all strip above cover the whole layer for as
    // long as a selection touches it.
    const onMouseDown = () => container.classList.add("selecting");
    const onSelectionChange = () => {
      const sel = document.getSelection();
      const touches = !!sel && sel.rangeCount > 0 && sel.getRangeAt(0).intersectsNode(container);
      container.classList.toggle("selecting", touches);
    };
    container.addEventListener("mousedown", onMouseDown);
    document.addEventListener("selectionchange", onSelectionChange);

    return () => {
      cancelled = true;
      try {
        layer?.cancel();
      } catch (err) {
        // already finished
      }
      container.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [pdfDoc, pageNum, viewport, canSelectText]);

  // Turns client rects (one per stretch of a line) into stored highlights on the
  // current page, in whatever color and opacity are picked right now.
  const addHighlightsFromRects = useCallback(
    (rects) => {
      const stageEl = canvasRef.current;
      if (!stageEl || !rects || rects.length === 0) return;
      const boxes = rectsToStageBoxes(rects, stageEl.getBoundingClientRect());
      if (boxes.length === 0) return;
      const { color, opacity, page } = highlightLatestRef.current;
      const stamp = Date.now();
      const additions = boxes.map((box) => ({
        id: `hl_${stamp}_${Math.random().toString(36).slice(2, 7)}`,
        page,
        ...box,
        color,
        opacity,
      }));
      snapshotHistory();
      setHighlights((prev) => [...prev, ...additions]);
    },
    [snapshotHistory, setHighlights]
  );

  // Mouse (and pen): while the Highlight tool is active, releasing a drag-selection
  // made on the real text layer above turns it into marker rectangles — one per
  // line, taken straight from the selection's own client rects — instead of just
  // leaving text selected. Touch doesn't come through here; see the next effect.
  useEffect(() => {
    if (activeTool !== "highlight") return;

    const handleSelectionRelease = () => {
      const container = textLayerRef.current;
      const sel = document.getSelection();
      if (!container || !sel || sel.isCollapsed || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      if (!range.intersectsNode(container)) return;

      const rects = mergeLineRects(range.getClientRects());
      if (rects.length === 0) return;

      addHighlightsFromRects(rects);
      sel.removeAllRanges();
    };

    window.addEventListener("mouseup", handleSelectionRelease);
    return () => {
      window.removeEventListener("mouseup", handleSelectionRelease);
    };
  }, [activeTool, addHighlightsFromRects]);

  // Touch: press and hold on a word, then drag to extend the mark, lift to keep
  // it (see createTouchHighlighter). A plain one-finger drag still scrolls.
  useEffect(() => {
    const container = textLayerRef.current;
    if (activeTool !== "highlight" || !canSelectText || !container) return;

    const controller = createTouchHighlighter({
      container,
      getScroller: () => pageScrollRef.current,
      onPreview: (rects) => {
        const stageEl = canvasRef.current;
        if (!rects || !stageEl) {
          setHighlightDraft(null);
          return;
        }
        setHighlightDraft(rectsToStageBoxes(rects, stageEl.getBoundingClientRect()));
      },
      onCommit: addHighlightsFromRects,
    });
    return () => controller.destroy();
  }, [activeTool, canSelectText, addHighlightsFromRects]);

  // --- Low-res page thumbnails for the sidebar / mobile drawer -------------
  // Each one is drawn with its page's rotation applied. Turning a page redraws
  // only that page's thumbnail; the others are kept.
  const thumbSourceRef = useRef(null); // the pdf.js document the thumbnails belong to
  const thumbRotationsRef = useRef({}); // rotation each page's thumbnail was drawn with
  useEffect(() => {
    if (!pdfDoc) {
      thumbSourceRef.current = null;
      thumbRotationsRef.current = {};
      setThumbnails([]);
      return;
    }
    if (thumbSourceRef.current !== pdfDoc) {
      thumbSourceRef.current = pdfDoc;
      thumbRotationsRef.current = {};
      setThumbnails(new Array(pdfDoc.numPages).fill(null));
    }
    let cancelled = false;

    (async () => {
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        if (cancelled) return;
        const turn = rotations[i] || 0;
        if (thumbRotationsRef.current[i] === turn) continue; // already drawn this way
        try {
          const page = await pdfDoc.getPage(i);
          const vp = page.getViewport({ scale: 0.22, rotation: normalizeRotation(page.rotate + turn) });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          const ctx = canvas.getContext("2d");
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          const dataUrl = canvas.toDataURL("image/png");
          if (cancelled) return;
          thumbRotationsRef.current[i] = turn;
          setThumbnails((prev) => {
            const next = prev.slice();
            next[i - 1] = dataUrl;
            return next;
          });
        } catch (err) {
          console.error("Couldn't render a thumbnail for page", i, err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, rotations]);

  // --- Click the page: place a pending signature/image, or drop a field ----
  const handleStageClick = useCallback(
    (e) => {
      if (!viewport || e.target !== canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const xRatio = (e.clientX - rect.left) / rect.width;
      const yRatio = (e.clientY - rect.top) / rect.height;

      if (pendingPlacement) {
        const { type, dataUrl, aspectRatio, widthRatio } = pendingPlacement;
        // Convert the image's on-screen height into a fraction of the
        // stage's height (the stage isn't square, so this isn't just
        // widthRatio * aspectRatio).
        const heightRatio = widthRatio * aspectRatio * (viewport.width / viewport.height);
        let placeX = xRatio - widthRatio / 2;
        let placeY = yRatio - heightRatio / 2;
        placeX = Math.min(Math.max(placeX, 0), Math.max(0, 1 - widthRatio));
        placeY = Math.min(Math.max(placeY, 0), Math.max(0, 1 - heightRatio));

        snapshotHistory();
        if (type === "signature") {
          const id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
          setSignatures((prev) => [
            ...prev,
            { id, page: pageNum, xRatio: placeX, yRatio: placeY, widthRatio, aspectRatio, dataUrl },
          ]);
          setActiveId(id);
        } else {
          const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
          setImages((prev) => [
            ...prev,
            { id, page: pageNum, xRatio: placeX, yRatio: placeY, widthRatio, aspectRatio, rotation: 0, dataUrl },
          ]);
          setActiveId(id);
        }
        setPendingPlacement(null);
        return;
      }

      if (activeTool !== "text") {
        setActiveId(null);
        return;
      }

      const id = `f_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const newField = {
        id,
        page: pageNum,
        xRatio,
        yRatio,
        text: "",
        fontSize: 14,
        fontFamily: "Helvetica",
        color: DEFAULT_COLOR,
        bold: false,
        italic: false,
        underline: false,
      };
      snapshotHistory();
      setFields((prev) => [...prev, newField]);
      setActiveId(id);
    },
    [viewport, pageNum, pendingPlacement, activeTool, snapshotHistory, setFields, setSignatures, setImages]
  );

  // --- Turn a detected text run into an editable (and exportable) edit -----
  const startEditingText = useCallback(
    (item) => {
      // Start from exactly what the original looked like: its real size (not
      // snapped to the dropdown's presets), the closest font we can export
      // with, and the text/background colours read off the rendered page.
      const exactSize = Math.round(item.fontSizePt * 10) / 10;
      const look = canvasRef.current ? sampleTextAppearance(canvasRef.current, item) : null;
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      snapshotHistory();
      setTextEdits((prev) => [
        ...prev,
        {
          id,
          key: item.key,
          page: pageNum,
          xRatio: item.xRatio,
          yRatio: item.yRatio,
          boxWidthRatio: item.widthRatio,
          boxHeightRatio: item.heightRatio,
          baselineYRatio: item.baselineYRatio,
          originalText: item.str,
          text: item.str,
          fontSize: exactSize,
          fontFamily: item.fontFamily || "Helvetica",
          color: look?.color || DEFAULT_COLOR,
          bgColor: look?.bgColor || DEFAULT_BG_COLOR,
          bold: !!item.bold,
          italic: !!item.italic,
        },
      ]);
      setActiveId(id);
    },
    [pageNum, snapshotHistory, setTextEdits]
  );

  const updateTextEdit = (id, patch, opts) => {
    const { snapshot = true } = opts || {};
    if (snapshot) snapshotHistory();
    setTextEdits((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  // Removing a text edit reverts to the PDF's own original text, since
  // nothing is left to cover it or draw over it on export.
  const removeTextEdit = (id) => {
    snapshotHistory();
    setTextEdits((prev) => prev.filter((t) => t.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const updateField = (id, patch, opts) => {
    const { snapshot = true } = opts || {};
    if (snapshot) snapshotHistory();
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const updateImage = (id, patch, opts) => {
    const { snapshot = true } = opts || {};
    if (snapshot) snapshotHistory();
    setImages((prev) => prev.map((im) => (im.id === id ? { ...im, ...patch } : im)));
  };

  const removeField = (id) => {
    snapshotHistory();
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const removeSignature = (id) => {
    snapshotHistory();
    setSignatures((prev) => prev.filter((s) => s.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const removeImage = (id) => {
    snapshotHistory();
    setImages((prev) => prev.filter((im) => im.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const updateHighlight = (id, patch, opts) => {
    const { snapshot = true } = opts || {};
    if (snapshot) snapshotHistory();
    setHighlights((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  };

  const removeHighlight = (id) => {
    snapshotHistory();
    setHighlights((prev) => prev.filter((h) => h.id !== id));
    if (activeId === id) setActiveId(null);
  };

  // --- Rotate pages ------------------------------------------------------------
  // Turns one page number (or an array of them) by `degreesCW` — a multiple of
  // 90, negative for counter-clockwise — on top of whatever each page already
  // has. Nothing in the PDF changes until Download: the turn lives in `doc`, so
  // it's undoable, drives the preview and thumbnails, and is written out with
  // page.setRotation() on export. Things already placed on a page keep their
  // spot on screen rather than turning with it.
  //   rotatePages(pageNum, 90)                                  this page, clockwise
  //   rotatePages(Array.from({ length: numPages }, (_, i) => i + 1), 180)   every page
  const rotatePages = useCallback(
    (pageNumbers, degreesCW) => {
      if (!pdfDoc || !Number.isInteger(degreesCW / 90) || normalizeRotation(degreesCW) === 0) return;
      const targets = [].concat(pageNumbers).filter((n) => Number.isInteger(n) && n >= 1 && n <= pdfDoc.numPages);
      if (targets.length === 0) return;
      snapshotHistory();
      setDoc((prev) => {
        const next = { ...prev.rotations };
        for (const n of targets) {
          const turned = normalizeRotation((next[n] || 0) + degreesCW);
          if (turned) next[n] = turned;
          else delete next[n]; // back to the PDF's own orientation
        }
        return { ...prev, rotations: next };
      });
    },
    [pdfDoc, snapshotHistory]
  );

  // Drops a text box that was never filled in. Unlike removeField this is
  // silent as far as Undo goes: the steps recorded while the empty box was
  // being created are removed too, so Undo doesn't "resurrect" a blank box or
  // burn a click on a step that changes nothing.
  const discardEmptyField = useCallback(
    (id) => {
      const current = docRef.current;
      const after = { ...current, fields: current.fields.filter((f) => f.id !== id) };
      setFields((prev) => prev.filter((f) => f.id !== id));
      setActiveId((prev) => (prev === id ? null : prev));

      const stack = undoStackRef.current;
      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        const boxInTop = top.fields.find((f) => f.id === id);
        if (boxInTop && boxInTop.text.trim()) break; // it had real text back then — keep that step
        const topWithoutBox = { ...top, fields: top.fields.filter((f) => f.id !== id) };
        if (!sameDocContents(topWithoutBox, after)) break; // something else changed too — keep it
        stack.pop();
      }
      setHistoryVersion((v) => v + 1);
    },
    [setFields]
  );

  // A text box that's still empty when you move on (select something else,
  // click off the page, drop a box somewhere else) has nothing to export, so
  // delete it rather than leaving a lone "Type here" behind. This is keyed to
  // the selection changing rather than the input blurring, so using the font /
  // size / colour controls on a still-empty box doesn't wipe it out.
  const prevActiveIdRef = useRef(null);
  useEffect(() => {
    const previousId = prevActiveIdRef.current;
    prevActiveIdRef.current = activeId;
    if (!previousId || previousId === activeId) return;
    const leftBehind = docRef.current.fields.find((f) => f.id === previousId);
    if (leftBehind && !leftBehind.text.trim()) discardEmptyField(previousId);
  }, [activeId, discardEmptyField]);

  // --- Signature drawn: wait for the user to click where it goes -----------
  const handleSaveSignature = (dataUrl) => {
    const img = new Image();
    img.onload = () => {
      setPendingPlacement({
        type: "signature",
        dataUrl,
        aspectRatio: img.naturalHeight / img.naturalWidth,
        widthRatio: DEFAULT_SIGNATURE_WIDTH_RATIO,
      });
      setShowSignaturePad(false);
    };
    img.src = dataUrl;
  };

  // --- Image chosen: wait for the user to click where it goes --------------
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const img = new Image();
      img.onload = () => {
        setPendingPlacement({
          type: "image",
          dataUrl,
          aspectRatio: img.naturalHeight / img.naturalWidth,
          widthRatio: DEFAULT_IMAGE_WIDTH_RATIO,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // --- Dragging / resizing / rotating fields, signatures & images ----------
  //
  // Touch notes: every drag surface also needs `touch-none` (touch-action: none)
  // in its className, otherwise the browser claims the gesture for scrolling
  // and fires `pointercancel` a few pixels in. We also (a) track only the one
  // pointer that started the gesture, so a second finger can't make the item
  // jump, (b) treat `pointercancel` like `pointerup` so a gesture can never get
  // stuck, and (c) apply at most one position update per animation frame,
  // because touch screens fire pointermove far faster than React can re-render.
  const applyPointerMove = useCallback(() => {
    rafRef.current = null;
    const point = latestPointRef.current;
    if (!point || !stageRef.current) return;
    if (!gestureMovedRef.current) {
      const start = gestureStartRef.current;
      if (start && Math.hypot(point.x - start.x, point.y - start.y) < DRAG_SLOP_PX) return;
      gestureMovedRef.current = true;
      snapshotHistory(); // one undo step per real gesture, taken just before the first change
    }
    const drag = dragStateRef.current;
    const resize = resizeStateRef.current;
    const rotate = rotateStateRef.current;
    const stageRect = stageRef.current.getBoundingClientRect();

    if (drag) {
      let xRatio = (point.x - stageRect.left) / stageRect.width + drag.offsetXRatio;
      let yRatio = (point.y - stageRect.top) / stageRect.height + drag.offsetYRatio;
      xRatio = Math.min(1, Math.max(0, xRatio));
      yRatio = Math.min(1, Math.max(0, yRatio));
      if (drag.kind === "field") {
        setFields((prev) => prev.map((f) => (f.id === drag.id ? { ...f, xRatio, yRatio } : f)));
      } else if (drag.kind === "signature") {
        setSignatures((prev) => prev.map((s) => (s.id === drag.id ? { ...s, xRatio, yRatio } : s)));
      } else if (drag.kind === "textEdit") {
        setTextEdits((prev) => prev.map((t) => (t.id === drag.id ? { ...t, xRatio, yRatio } : t)));
      } else {
        setImages((prev) => prev.map((im) => (im.id === drag.id ? { ...im, xRatio, yRatio } : im)));
      }
    } else if (resize) {
      const deltaXRatio = (point.x - resize.startX) / stageRect.width;
      const widthRatio = Math.min(0.9, Math.max(0.05, resize.startWidthRatio + deltaXRatio));
      if (resize.kind === "signature") {
        setSignatures((prev) => prev.map((s) => (s.id === resize.id ? { ...s, widthRatio } : s)));
      } else {
        setImages((prev) => prev.map((im) => (im.id === resize.id ? { ...im, widthRatio } : im)));
      }
    } else if (rotate) {
      const angleRad = Math.atan2(point.y - rotate.centerY, point.x - rotate.centerX);
      let rotationDeg = (angleRad * 180) / Math.PI + 90;
      if (rotationDeg > 180) rotationDeg -= 360;
      if (rotationDeg < -180) rotationDeg += 360;
      setImages((prev) => prev.map((im) => (im.id === rotate.id ? { ...im, rotation: rotationDeg } : im)));
    }
  }, [setFields, setSignatures, setImages, setTextEdits, snapshotHistory]);

  const handlePointerMove = useCallback(
    (e) => {
      // Ignore any other finger that happens to be on the screen.
      if (e.pointerId !== activePointerIdRef.current) return;
      latestPointRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(applyPointerMove);
      }
    },
    [applyPointerMove]
  );

  // Used for both pointerup and pointercancel.
  const handlePointerUp = useCallback(
    (e) => {
      if (e && e.pointerId !== activePointerIdRef.current) return;
      // Flush the last position so the item lands exactly where the finger left it.
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        applyPointerMove();
      }
      dragStateRef.current = null;
      resizeStateRef.current = null;
      rotateStateRef.current = null;
      activePointerIdRef.current = null;
      latestPointRef.current = null;
      gestureStartRef.current = null;
      gestureMovedRef.current = false;
      setIsDragging(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    },
    [handlePointerMove, applyPointerMove]
  );

  // Shared by beginDrag / beginResize / beginRotate.
  const trackPointer = (e) => {
    activePointerIdRef.current = e.pointerId;
    latestPointRef.current = { x: e.clientX, y: e.clientY };
    gestureStartRef.current = { x: e.clientX, y: e.clientY };
    gestureMovedRef.current = false;
    setIsDragging(true);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  };

  const beginDrag = (e, kind, item) => {
    if (!e.isPrimary) return; // a second finger shouldn't start (or hijack) a gesture
    e.preventDefault();
    e.stopPropagation();
    const stageRect = stageRef.current.getBoundingClientRect();
    const pointerXRatio = (e.clientX - stageRect.left) / stageRect.width;
    const pointerYRatio = (e.clientY - stageRect.top) / stageRect.height;
    dragStateRef.current = {
      kind,
      id: item.id,
      offsetXRatio: item.xRatio - pointerXRatio,
      offsetYRatio: item.yRatio - pointerYRatio,
    };
    setActiveId(item.id);
    trackPointer(e);
  };

  const beginResize = (e, kind, item) => {
    if (!e.isPrimary) return;
    e.preventDefault();
    e.stopPropagation();
    resizeStateRef.current = {
      kind,
      id: item.id,
      startWidthRatio: item.widthRatio,
      startX: e.clientX,
    };
    setActiveId(item.id);
    trackPointer(e);
  };

  const beginRotate = (e, image) => {
    if (!e.isPrimary) return;
    e.preventDefault();
    e.stopPropagation();
    const stageRect = stageRef.current.getBoundingClientRect();
    const drawWidthPx = image.widthRatio * stageRect.width;
    const drawHeightPx = drawWidthPx * image.aspectRatio;
    const centerX = stageRect.left + image.xRatio * stageRect.width + drawWidthPx / 2;
    const centerY = stageRect.top + image.yRatio * stageRect.height + drawHeightPx / 2;
    rotateStateRef.current = { id: image.id, centerX, centerY };
    setActiveId(image.id);
    trackPointer(e);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [handlePointerMove, handlePointerUp]);

  // --- Keyboard shortcuts: undo/redo, escape, and select-all in Select mode --
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPendingPlacement(null);
        if (activeTool === "select" || activeTool === "highlight") document.getSelection()?.removeAllRanges();
        return;
      }
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const key = e.key.toLowerCase();
      if (key === "a" && !e.shiftKey && textLayerRef.current) {
        // Select All should mean "all the text on this page", not the whole
        // app chrome (toolbars, buttons, thumbnails...).
        e.preventDefault();
        const range = document.createRange();
        range.selectNodeContents(textLayerRef.current);
        const sel = document.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return;
      }
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (key === "y" || (key === "z" && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, activeTool]);

  // --- Bake everything into the PDF and download ----------------------------
  const handleDownload = async () => {
    if (!pdfBytes) return;
    setIsExporting(true);
    setError("");
    try {
      const pdf = await PDFDocument.load(pdfBytes);
      const fontCache = {};
      const getFont = async (fontFamily, bold, italic) => {
        const key = resolveStandardFont(fontFamily, bold, italic);
        if (!fontCache[key]) {
          fontCache[key] = await pdf.embedFont(StandardFonts[key]);
        }
        return fontCache[key];
      };
      const pages = pdf.getPages();

      // A page is shown turned by its own /Rotate plus any turn added here, and
      // everything below is placed on the page as shown. So: write the final
      // rotation onto each turned page, and give every page a frame that maps
      // on-screen coordinates back into the page's own unrotated space (which
      // is what pdf-lib draws in).
      const frames = pages.map((page, i) => {
        const turn = rotations[i + 1] || 0;
        const own = page.getRotation().angle;
        const shown = normalizeRotation((own % 90 === 0 ? own : 0) + turn); // pdf.js ignores odd angles too
        if (turn) page.setRotation(degrees(shown));
        return makePageFrame(page, shown);
      });

      // Highlights go down first, as translucent rectangles under everything
      // else, so the page's own text (and any edits made to it) stay legible
      // on top of the marker color.
      for (const hl of highlights) {
        const page = pages[hl.page - 1];
        if (!page) continue;
        const frame = frames[hl.page - 1];
        const { width, height } = frame;
        const { r, g, b } = hexToRgb01(hl.color);
        const rectWidth = hl.widthRatio * width;
        const rectHeight = hl.heightRatio * height;
        const x = hl.xRatio * width;
        const y = height - hl.yRatio * height - rectHeight;

        page.drawRectangle({
          ...frame.place(x, y),
          width: rectWidth,
          height: rectHeight,
          color: rgb(r, g, b),
          opacity: highlightOpacityOf(hl),
        });
      }

      // Edited text is baked in next, as if it were part of the page's own
      // content: cover the original run with a solid rectangle, then draw
      // the replacement text on top of it.
      for (const edit of textEdits) {
        const page = pages[edit.page - 1];
        if (!page) continue;
        const frame = frames[edit.page - 1];
        const { width, height } = frame;
        const font = await getFont(edit.fontFamily, edit.bold, edit.italic);
        const { r, g, b } = hexToRgb01(edit.color);
        const { r: br, g: bgCol, b: bb } = hexToRgb01(edit.bgColor || DEFAULT_BG_COLOR);

        const textToDraw = edit.text || "";
        const textWidth = font.widthOfTextAtSize(textToDraw || " ", edit.fontSize);
        // The text starts exactly where the original did; the cover rectangle
        // is what gets 1pt of breathing room on each side, so no anti-aliased
        // fringe of the old text peeks out without shifting the new text.
        const COVER_PAD = 1;
        const textX = edit.xRatio * width;
        const rectX = textX - COVER_PAD;
        const rectWidth = Math.max(edit.boxWidthRatio * width, textWidth) + COVER_PAD * 2;
        const rectHeight = Math.max(edit.boxHeightRatio * height, edit.fontSize * EDIT_LINE_HEIGHT_FACTOR);
        const rectTopY = edit.yRatio * height;
        const rectBottomY = height - rectTopY - rectHeight;

        page.drawRectangle({
          ...frame.place(rectX, rectBottomY),
          width: rectWidth,
          height: rectHeight,
          color: rgb(br, bgCol, bb),
        });

        if (textToDraw.trim()) {
          const baselineY = height - edit.baselineYRatio * height;
          page.drawText(textToDraw, {
            ...frame.place(textX, baselineY),
            size: edit.fontSize,
            font,
            color: rgb(r, g, b),
          });
        }
      }

      for (const field of fields) {
        if (!field.text.trim()) continue;
        const page = pages[field.page - 1];
        if (!page) continue;
        const frame = frames[field.page - 1];
        const { width, height } = frame;
        const font = await getFont(field.fontFamily, field.bold, field.italic);
        const { r, g, b } = hexToRgb01(field.color);

        // Convert the ratio position (top-left origin, screen space) into
        // PDF coordinates (bottom-left origin).
        const x = field.xRatio * width;
        const y = height - field.yRatio * height - field.fontSize * 0.8;

        page.drawText(field.text, {
          ...frame.place(x, y),
          size: field.fontSize,
          font,
          color: rgb(r, g, b),
        });

        if (field.underline) {
          const textWidth = font.widthOfTextAtSize(field.text, field.fontSize);
          const underlineY = y - field.fontSize * 0.12;
          page.drawLine({
            start: frame.toPage(x, underlineY),
            end: frame.toPage(x + textWidth, underlineY),
            thickness: Math.max(1, field.fontSize * 0.05),
            color: rgb(r, g, b),
          });
        }
      }

      for (const sig of signatures) {
        const page = pages[sig.page - 1];
        if (!page) continue;
        const frame = frames[sig.page - 1];
        const { width, height } = frame;
        const pngBytes = await fetch(sig.dataUrl).then((res) => res.arrayBuffer());
        const pngImage = await pdf.embedPng(pngBytes);

        const drawWidth = sig.widthRatio * width;
        const drawHeight = drawWidth * sig.aspectRatio;
        const x = sig.xRatio * width;
        const y = height - sig.yRatio * height - drawHeight;

        page.drawImage(pngImage, { ...frame.place(x, y), width: drawWidth, height: drawHeight });
      }

      for (const imgItem of images) {
        const page = pages[imgItem.page - 1];
        if (!page) continue;
        try {
          const frame = frames[imgItem.page - 1];
          const { width, height } = frame;
          const bytes = await fetch(imgItem.dataUrl).then((res) => res.arrayBuffer());
          const isPng = imgItem.dataUrl.startsWith("data:image/png");
          const embeddedImage = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);

          const drawWidth = imgItem.widthRatio * width;
          const drawHeight = drawWidth * imgItem.aspectRatio;
          const centerX = imgItem.xRatio * width + drawWidth / 2;
          const centerY = height - imgItem.yRatio * height - drawHeight / 2;
          // Our rotation is stored clockwise-positive (like CSS transform);
          // pdf-lib's is counter-clockwise-positive, hence the negation.
          const pdfAngle = -(imgItem.rotation || 0);
          const anchor = rotatedAnchor(centerX, centerY, drawWidth, drawHeight, pdfAngle);

          page.drawImage(embeddedImage, {
            ...frame.place(anchor.x, anchor.y, pdfAngle),
            width: drawWidth,
            height: drawHeight,
          });
        } catch (imgErr) {
          console.error("Couldn't embed one of the images", imgErr);
        }
      }

      // Watermark goes on last, on top of everything else, on every page.
      if (watermark.enabled && watermark.text.trim()) {
        const wmFont = await getFont("Helvetica", false, false);
        const { r, g, b } = hexToRgb01(watermark.color);
        const wmText = watermark.text;
        const wmSize = watermark.fontSize;

        for (const [pageIdx, page] of pages.entries()) {
          const frame = frames[pageIdx];
          const { width, height } = frame;
          const textWidth = wmFont.widthOfTextAtSize(wmText, wmSize);
          // Same trick used for rotated images: solve for the anchor point
          // that keeps the text's own center pinned to the page's center
          // once pdf-lib rotates it around that anchor.
          const anchor = rotatedAnchor(width / 2, height / 2, textWidth, wmSize, watermark.rotation);

          page.drawText(wmText, {
            ...frame.place(anchor.x, anchor.y, watermark.rotation),
            size: wmSize,
            font: wmFont,
            color: rgb(r, g, b),
            opacity: watermark.opacity,
          });
        }
      }

      const outBytes = await pdf.save();
      const outFileName = `${fileName || "document"}-filled.pdf`;
      const dataUrl = bytesToDownloadableDataUrl(outBytes, "application/pdf", outFileName);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = outFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating the PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const fieldsOnPage = fields.filter((f) => f.page === pageNum);
  const signaturesOnPage = signatures.filter((s) => s.page === pageNum);
  const imagesOnPage = images.filter((im) => im.page === pageNum);
  const textEditsOnPage = textEdits.filter((t) => t.page === pageNum);
  const highlightsOnPage = highlights.filter((h) => h.page === pageNum);
  // Edited text sizes are in PDF points (that's what the export uses), but the
  // page is drawn at several screen pixels per point. Derived from the canvas
  // size itself so it stays in step with the page while a zoom is re-rendering.
  const pageMeta = pageTextIndex[textIndexKey];
  const pxPerPt = viewport && pageMeta ? viewport.width / pageMeta.pageWidth : 1.4 * zoom;
  const activeField = fields.find((f) => f.id === activeId) || null;
  const activeImage = images.find((im) => im.id === activeId) || null;
  const activeTextEdit = textEdits.find((t) => t.id === activeId) || null;

  // Existing text runs on this page that haven't been turned into an edit
  // yet — only surfaced (and clickable) while the Edit Text tool is active.
  const editedKeys = new Set(textEditsOnPage.map((t) => t.key));
  const detectableTextItems =
    activeTool === "edit-text" && pageMeta
      ? pageMeta.items.filter((it) => !editedKeys.has(it.key))
      : [];
  const showMobileSheet = !isDragging && mobileElementsOpen;

  const closeMobileSheet = () => {
    setActiveId(null);
    setMobileElementsOpen(false);
  };

  // --- Shared pieces reused by both the desktop rail/sidebar and the ---------
  // --- mobile drawer/bottom-sheet, so we don't maintain two copies of them --
  const renderPagesList = (afterSelect) => (
    <div className="p-3 space-y-3">
      {Array.from({ length: numPages }).map((_, i) => {
        const n = i + 1;
        const thumb = thumbnails[i];
        return (
          <button
            key={n}
            onClick={() => {
              setPageNum(n);
              if (afterSelect) afterSelect();
            }}
            className={`w-full rounded-md border overflow-hidden text-left block ${
              pageNum === n ? "border-blue-500 ring-2 ring-blue-200" : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            {thumb ? (
              <img src={thumb} alt={`Page ${n}`} className="w-full block" />
            ) : (
              <div className="aspect-[3/4] bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">
                Page {n}
              </div>
            )}
            <div
              className={`text-center text-xs py-1 ${
                pageNum === n ? "bg-blue-50 text-blue-700 font-medium" : "text-neutral-500"
              }`}
            >
              {n}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderInspectorContent = () => (
    <>
      <h2 className="text-sm font-semibold mb-2">Elements</h2>
      <p className="text-xs text-neutral-500 mb-4">
        Pick "Text" and click the page to drop a field, use "Edit Text" and
        click existing text on the page to change it, or use "Signature" /
        "Image" and click where you want it placed. Tap an element on the
        page to reveal its controls and style it below.
      </p>

      {activeField && (
        <div className="mb-4 p-3 rounded-md border border-blue-200 bg-blue-50/50 space-y-3">
          <div className="text-xs font-medium text-neutral-500">Selected field</div>

          <label className="block text-xs text-neutral-600">
            Font
            <select
              value={activeField.fontFamily}
              onChange={(e) => updateField(activeField.id, { fontFamily: e.target.value })}
              className="mt-1 w-full text-sm border border-neutral-300 rounded px-2 py-1"
            >
              {FONT_FAMILIES.map((fam) => (
                <option key={fam.id} value={fam.id}>
                  {fam.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-3">
            <label className="flex-1 text-xs text-neutral-600">
              Size
              <FontSizeInput
                id="font-size-options-field"
                value={activeField.fontSize}
                options={sizeOptionsFor(activeField.fontSize)}
                onChange={(size) => updateField(activeField.id, { fontSize: size })}
                className="mt-1 w-full text-sm border border-neutral-300 rounded px-2 py-1"
              />
            </label>

            <label className="flex-1 text-xs text-neutral-600">
              Color
              <input
                type="color"
                value={activeField.color}
                onChange={(e) => updateField(activeField.id, { color: e.target.value })}
                className="mt-1 w-full h-[30px] border border-neutral-300 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateField(activeField.id, { bold: !activeField.bold })}
              title="Bold"
              className={`flex-1 px-2 py-1.5 rounded border text-sm font-bold ${
                activeField.bold ? "border-blue-500 bg-blue-50 text-blue-700" : "border-neutral-300 text-neutral-600"
              }`}
            >
              B
            </button>
            <button
              type="button"
              onClick={() => updateField(activeField.id, { italic: !activeField.italic })}
              title="Italic"
              className={`flex-1 px-2 py-1.5 rounded border text-sm italic ${
                activeField.italic ? "border-blue-500 bg-blue-50 text-blue-700" : "border-neutral-300 text-neutral-600"
              }`}
            >
              I
            </button>
            <button
              type="button"
              onClick={() => updateField(activeField.id, { underline: !activeField.underline })}
              title="Underline"
              className={`flex-1 px-2 py-1.5 rounded border text-sm underline ${
                activeField.underline ? "border-blue-500 bg-blue-50 text-blue-700" : "border-neutral-300 text-neutral-600"
              }`}
            >
              U
            </button>
          </div>

          <button onClick={() => removeField(activeField.id)} className="text-xs text-red-500 hover:text-red-700">
            Remove field
          </button>
        </div>
      )}

      {activeTextEdit && (
        <div className="mb-4 p-3 rounded-md border border-amber-200 bg-amber-50/50 space-y-3">
          <div className="text-xs font-medium text-neutral-500">Selected text</div>
          <div className="text-xs text-neutral-500">
            Original: <span className="italic text-neutral-600">"{activeTextEdit.originalText}"</span>
          </div>

          <label className="block text-xs text-neutral-600">
            Font
            <select
              value={activeTextEdit.fontFamily}
              onChange={(e) => updateTextEdit(activeTextEdit.id, { fontFamily: e.target.value })}
              className="mt-1 w-full text-sm border border-neutral-300 rounded px-2 py-1"
            >
              {FONT_FAMILIES.map((fam) => (
                <option key={fam.id} value={fam.id}>
                  {fam.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-3">
            <label className="flex-1 text-xs text-neutral-600">
              Size
              <FontSizeInput
                id="font-size-options-textedit"
                value={activeTextEdit.fontSize}
                options={sizeOptionsFor(activeTextEdit.fontSize)}
                onChange={(size) => updateTextEdit(activeTextEdit.id, { fontSize: size })}
                className="mt-1 w-full text-sm border border-neutral-300 rounded px-2 py-1"
              />
            </label>

            <label className="flex-1 text-xs text-neutral-600">
              Color
              <input
                type="color"
                value={activeTextEdit.color}
                onChange={(e) => updateTextEdit(activeTextEdit.id, { color: e.target.value })}
                className="mt-1 w-full h-[30px] border border-neutral-300 rounded cursor-pointer"
              />
            </label>
          </div>

          <label className="block text-xs text-neutral-600">
            Cover color
            <input
              type="color"
              value={activeTextEdit.bgColor}
              onChange={(e) => updateTextEdit(activeTextEdit.id, { bgColor: e.target.value })}
              className="mt-1 w-full h-[30px] border border-neutral-300 rounded cursor-pointer"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateTextEdit(activeTextEdit.id, { bold: !activeTextEdit.bold })}
              title="Bold"
              className={`flex-1 px-2 py-1.5 rounded border text-sm font-bold ${
                activeTextEdit.bold ? "border-blue-500 bg-blue-50 text-blue-700" : "border-neutral-300 text-neutral-600"
              }`}
            >
              B
            </button>
            <button
              type="button"
              onClick={() => updateTextEdit(activeTextEdit.id, { italic: !activeTextEdit.italic })}
              title="Italic"
              className={`flex-1 px-2 py-1.5 rounded border text-sm italic ${
                activeTextEdit.italic ? "border-blue-500 bg-blue-50 text-blue-700" : "border-neutral-300 text-neutral-600"
              }`}
            >
              I
            </button>
          </div>

          <button onClick={() => removeTextEdit(activeTextEdit.id)} className="text-xs text-amber-600 hover:text-amber-800">
            Restore original text
          </button>
        </div>
      )}

      {activeImage && (
        <div className="mb-4 p-3 rounded-md border border-emerald-200 bg-emerald-50/50 space-y-3">
          <div className="text-xs font-medium text-neutral-500">Selected image</div>
          <label className="block text-xs text-neutral-600">
            Rotation ({Math.round(activeImage.rotation || 0)}°)
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={activeImage.rotation || 0}
              onPointerDown={() => snapshotHistory()}
              onChange={(e) =>
                updateImage(activeImage.id, { rotation: Number(e.target.value) }, { snapshot: false })
              }
              className="mt-1 w-full"
            />
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => updateImage(activeImage.id, { rotation: 0 })}
              className="flex-1 px-2 py-1.5 rounded border border-neutral-300 text-xs text-neutral-600 hover:bg-neutral-50"
            >
              Reset rotation
            </button>
            <button
              onClick={() => removeImage(activeImage.id)}
              className="flex-1 px-2 py-1.5 rounded border border-red-200 text-xs text-red-500 hover:bg-red-50"
            >
              Delete image
            </button>
          </div>
        </div>
      )}

      {fields.length === 0 &&
        signatures.length === 0 &&
        images.length === 0 &&
        textEdits.length === 0 &&
        highlights.length === 0 && <p className="text-sm text-neutral-400">Nothing added yet.</p>}

      <ul className="space-y-2">
        {fields.map((f) => (
          <li
            key={f.id}
            onClick={() => {
              setActiveId(f.id);
              setPageNum(f.page);
            }}
            className={`p-2 rounded-md border cursor-pointer text-sm flex items-center justify-between gap-2 ${
              activeId === f.id ? "border-blue-400 bg-blue-50" : "border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <div className="min-w-0">
              <div
                className="truncate font-medium"
                style={{
                  textDecoration: f.underline ? "underline" : "none",
                  fontWeight: f.bold ? "bold" : "normal",
                  fontStyle: f.italic ? "italic" : "normal",
                }}
              >
                {f.text || "(empty)"}
              </div>
              <div className="text-xs text-neutral-400">
                Page {f.page} · {f.fontSize}px · {FONT_FAMILIES.find((x) => x.id === f.fontFamily)?.label}
              </div>
            </div>
            <span className="w-4 h-4 rounded-full border border-neutral-300 shrink-0" style={{ backgroundColor: f.color }} />
          </li>
        ))}
      </ul>

      {textEdits.length > 0 && (
        <>
          <h2 className="text-sm font-semibold mt-5 mb-2">Edited text</h2>
          <ul className="space-y-2">
            {textEdits.map((t) => (
              <li
                key={t.id}
                onClick={() => {
                  setActiveId(t.id);
                  setPageNum(t.page);
                }}
                className={`p-2 rounded-md border cursor-pointer text-sm flex items-center justify-between gap-2 ${
                  activeId === t.id ? "border-blue-400 bg-blue-50" : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{t.text || "(empty)"}</div>
                  <div className="text-xs text-neutral-400 truncate">
                    Page {t.page} · was "{t.originalText}"
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTextEdit(t.id);
                  }}
                  className="text-xs text-amber-600 hover:text-amber-800 px-1 shrink-0"
                  aria-label="Restore original text"
                  title="Restore original text"
                >
                  ↺
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {signatures.length > 0 && (
        <>
          <h2 className="text-sm font-semibold mt-5 mb-2">Signatures</h2>
          <ul className="space-y-2">
            {signatures.map((s) => (
              <li
                key={s.id}
                onClick={() => {
                  setActiveId(s.id);
                  setPageNum(s.page);
                }}
                className={`p-2 rounded-md border cursor-pointer text-sm flex items-center justify-between gap-2 ${
                  activeId === s.id ? "border-blue-400 bg-blue-50" : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img src={s.dataUrl} alt="Signature" className="h-6 w-auto shrink-0" />
                  <span className="text-xs text-neutral-400">Page {s.page}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSignature(s.id);
                  }}
                  className="text-xs text-red-500 hover:text-red-700 px-1"
                  aria-label="Remove signature"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {images.length > 0 && (
        <>
          <h2 className="text-sm font-semibold mt-5 mb-2">Images</h2>
          <ul className="space-y-2">
            {images.map((im) => (
              <li
                key={im.id}
                onClick={() => {
                  setActiveId(im.id);
                  setPageNum(im.page);
                }}
                className={`p-2 rounded-md border cursor-pointer text-sm flex items-center justify-between gap-2 ${
                  activeId === im.id ? "border-blue-400 bg-blue-50" : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img src={im.dataUrl} alt="Inserted" className="h-6 w-auto shrink-0" />
                  <span className="text-xs text-neutral-400">
                    Page {im.page} · {Math.round(im.rotation || 0)}°
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(im.id);
                  }}
                  className="text-xs text-red-500 hover:text-red-700 px-1"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {highlights.length > 0 && (
        <>
          <h2 className="text-sm font-semibold mt-5 mb-2">Highlights</h2>
          <ul className="space-y-2">
            {highlights.map((h) => (
              <li
                key={h.id}
                onClick={() => {
                  setActiveId(h.id);
                  setPageNum(h.page);
                }}
                className={`p-2 rounded-md border cursor-pointer text-sm flex items-center justify-between gap-2 ${
                  activeId === h.id ? "border-blue-400 bg-blue-50" : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <input
                    type="color"
                    value={h.color}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateHighlight(h.id, { color: e.target.value })}
                    title="Highlight color"
                    className="w-5 h-5 rounded border border-neutral-300 cursor-pointer p-0 shrink-0"
                  />
                  <span className="text-xs text-neutral-400 shrink-0">Page {h.page}</span>
                  <input
                    type="range"
                    min={MIN_HIGHLIGHT_OPACITY}
                    max={MAX_HIGHLIGHT_OPACITY}
                    step={HIGHLIGHT_OPACITY_STEP}
                    value={highlightOpacityOf(h)}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      snapshotHistory();
                    }}
                    onChange={(e) => updateHighlight(h.id, { opacity: Number(e.target.value) }, { snapshot: false })}
                    title="Highlight opacity"
                    aria-label="Highlight opacity"
                    className="min-w-0 w-full max-w-[110px]"
                  />
                  <span className="text-[11px] text-neutral-400 w-8 text-right tabular-nums shrink-0">
                    {Math.round(highlightOpacityOf(h) * 100)}%
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeHighlight(h.id);
                  }}
                  className="text-xs text-red-500 hover:text-red-700 px-1"
                  aria-label="Remove highlight"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );

  // --- UI --------------------------------------------------------------------
  return (
    <div className="h-screen flex flex-col bg-neutral-50 text-neutral-900 overflow-hidden">
      {/* Top bar */}
      <header className="bg-slate-900 text-white px-2.5 sm:px-4 py-2.5 flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <button
          onClick={() => setMobilePagesOpen(true)}
          disabled={!pdfDoc}
          className="lg:hidden p-1.5 rounded hover:bg-white/10 disabled:opacity-30"
          title="Pages"
        >
          <MenuIcon />
        </button>

                <div className="text-lg sm:text-xl font-bold flex items-center gap-2 z-[70]">
  <Link to="/" className="flex items-center gap-2 outline-none rounded-lg group">
    <span className="text-[1.25rem] text-white tracking-tight">
      Remo <span className="text-red-600">PDF</span>
    </span>
  </Link>
</div>

        {fileName && (
          <div className="hidden md:flex items-center bg-white/10 rounded-md px-2.5 py-1 text-xs max-w-[10rem]">
            <span className="truncate">{fileName}.pdf</span>
          </div>
        )}

        <div className="flex-1" />

        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <UndoIcon />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <RedoIcon />
        </button>

        <button
          onClick={handleDownload}
          disabled={!pdfDoc || isExporting}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs sm:text-sm font-medium px-2.5 sm:px-3.5 py-1.5 rounded-md"
        >
          <DownloadIcon />
          <span className="hidden sm:inline">{isExporting ? "Preparing…" : "Download"}</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowWatermarkPanel((v) => !v)}
            disabled={!pdfDoc}
            aria-expanded={showWatermarkPanel}
            className={`relative flex items-center gap-1.5 p-1.5 sm:px-2.5 rounded text-sm hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent ${
              watermark.enabled && watermark.text.trim() ? "text-blue-400" : ""
            }`}
            title="Watermark"
          >
            <WatermarkIcon />
            {/* The label needs room, so narrow screens get the icon plus a dot while it's on. */}
            <span className="hidden sm:inline">Watermark</span>
            {watermark.enabled && watermark.text.trim() && (
              <span
                aria-label="Watermark is on"
                className="sm:hidden absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-blue-400"
              />
            )}
          </button>
          {showWatermarkPanel && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowWatermarkPanel(false)} />
              <div className="absolute right-0 mt-1 w-64 bg-white text-neutral-800 rounded-md shadow-lg border border-neutral-200 p-3 z-40 space-y-3">
                <label className="flex items-center justify-between text-sm font-medium">
                  Watermark
                  <input
                    type="checkbox"
                    checked={watermark.enabled}
                    onChange={(e) =>
                      setWatermark((w) => ({ ...w, enabled: e.target.checked }))
                    }
                  />
                </label>

                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Text</label>
                  <input
                    type="text"
                    value={watermark.text}
                    onChange={(e) => setWatermark((w) => ({ ...w, text: e.target.value }))}
                    placeholder="e.g. CONFIDENTIAL"
                    className="w-full text-sm border border-neutral-300 rounded px-2 py-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Size</label>
                    <input
                      type="number"
                      min={8}
                      max={200}
                      value={watermark.fontSize}
                      onChange={(e) =>
                        setWatermark((w) => ({ ...w, fontSize: Number(e.target.value) || w.fontSize }))
                      }
                      className="w-full text-sm border border-neutral-300 rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Rotation</label>
                    <input
                      type="number"
                      min={-180}
                      max={180}
                      value={watermark.rotation}
                      onChange={(e) =>
                        setWatermark((w) => ({ ...w, rotation: Number(e.target.value) || 0 }))
                      }
                      className="w-full text-sm border border-neutral-300 rounded px-2 py-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Color</label>
                  <input
                    type="color"
                    value={watermark.color}
                    onChange={(e) => setWatermark((w) => ({ ...w, color: e.target.value }))}
                    className="w-full h-7 border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                    Opacity
                    <span>{Math.round(watermark.opacity * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min={0.05}
                    max={1}
                    step={0.05}
                    value={watermark.opacity}
                    onChange={(e) => setWatermark((w) => ({ ...w, opacity: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <p className="text-[11px] text-neutral-400">
                  Applied to every page when you download.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMoreMenu((v) => !v)}
            className="p-1.5 rounded hover:bg-white/10"
            title="More"
          >
            <MoreIcon />
          </button>
          {showMoreMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowMoreMenu(false)} />
              <div className="absolute right-0 mt-1 w-44 bg-white text-neutral-800 rounded-md shadow-lg border border-neutral-200 py-1 z-40">
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50"
                >
                  {pdfDoc ? "Replace PDF" : "Upload PDF"}
                </button>
              </div>
            </>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
      </header>

      {/* Tool row */}
      {pdfDoc && (
        <div className="bg-white border-b border-neutral-200 px-1.5 sm:px-4 py-1.5 flex items-center gap-1 overflow-x-auto shrink-0">
          <ToolButton title="Select" active={activeTool === "select"} onClick={() => setActiveTool("select")}>
            <CursorIcon />
          </ToolButton>
          <ToolButton title="Text" active={activeTool === "text"} onClick={() => setActiveTool("text")}>
            <TextToolIcon />
          </ToolButton>
          <ToolButton
            title="Edit Text"
            active={activeTool === "edit-text"}
            onClick={() => setActiveTool("edit-text")}
          >
            <EditTextIcon />
          </ToolButton>
          <ToolButton title="Highlight" active={activeTool === "highlight"} onClick={() => setActiveTool("highlight")}>
            <HighlightIcon />
          </ToolButton>
          {activeTool === "highlight" && (
            <div className="flex items-center gap-1 pl-1.5 ml-0.5 border-l border-neutral-200 shrink-0">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setHighlightColor(c)}
                  title="Highlight color"
                  className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                    highlightColor === c ? "border-neutral-900" : "border-white"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <label
                className="flex items-center gap-1.5 pl-1.5 ml-0.5 border-l border-neutral-200 text-xs text-neutral-500 shrink-0"
                title="Highlight opacity (lower = more transparent)"
              >
                <span>Opacity</span>
                <input
                  type="range"
                  min={MIN_HIGHLIGHT_OPACITY}
                  max={MAX_HIGHLIGHT_OPACITY}
                  step={HIGHLIGHT_OPACITY_STEP}
                  value={highlightOpacity}
                  onChange={(e) => setHighlightOpacity(Number(e.target.value))}
                  className="w-20 sm:w-28"
                />
                <span className="w-8 text-right tabular-nums">{Math.round(highlightOpacity * 100)}%</span>
              </label>
            </div>
          )}
          <ToolButton
            title="Signature"
            disabled={!!pendingPlacement}
            onClick={() => setShowSignaturePad(true)}
          >
            <SignatureIcon />
          </ToolButton>
          <ToolButton
            title="Image"
            disabled={!!pendingPlacement}
            onClick={() => imageInputRef.current?.click()}
          >
            <ImageToolIcon />
          </ToolButton>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleImageFileChange}
            className="hidden"
          />

          <div className="flex items-center gap-1 pl-1.5 ml-0.5 border-l border-neutral-200 shrink-0">
            <ToolButton title="Rotate left" onClick={() => rotatePages(pageNum, -90)}>
              <RotateLeftIcon />
            </ToolButton>
            <ToolButton title="Rotate right" onClick={() => rotatePages(pageNum, 90)}>
              <RotateRightIcon />
            </ToolButton>
          </div>

          <button
            onClick={() => setMobileElementsOpen(true)}
            className="lg:hidden ml-auto p-2 rounded-md text-neutral-600 hover:bg-neutral-100 shrink-0"
            title="Elements"
          >
            <ListIcon />
          </button>
        </div>
      )}

      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-700 text-sm border-b border-red-100 shrink-0">{error}</div>
      )}

      {!pdfDoc ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50">
          <div className="text-center max-w-sm w-full">
            <div className="w-20 h-20 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mx-auto mb-6 overflow-hidden">
              <img src={image1} alt="RemoPDF" className="w-full h-full object-contain p-3" />
            </div>

            <h2 className="text-xl font-bold text-neutral-900 mb-2">Welcome to RemoPDF</h2>
            <p className="text-neutral-500 mb-6 text-sm leading-relaxed">
              Edit text, sign, add images, and manage every page — all in one place.
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-5 py-3.5 rounded-xl bg-black text-white text-sm font-semibold tracking-wide border border-black hover:bg-neutral-800 active:scale-[0.98] transition-transform"
            >
              Choose a PDF
            </button>

            <div className="mt-8 flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-700">
                  <EditTextIcon />
                </div>
                <span className="text-[11px] text-neutral-500">Edit</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-700">
                  <SignatureIcon />
                </div>
                <span className="text-[11px] text-neutral-500">Sign</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-700">
                  <ImageToolIcon />
                </div>
                <span className="text-[11px] text-neutral-500">Add image</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop pages rail */}
          <aside className="hidden lg:flex w-48 shrink-0 flex-col border-r border-neutral-200 bg-white overflow-y-auto">
            <div className="px-3 pt-3 pb-1 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              Pages
            </div>
            {renderPagesList()}
          </aside>

          {/* Center: canvas + bottom bar */}
          <div className="flex-1 flex flex-col overflow-hidden bg-neutral-100">
            <div
              ref={pageScrollRef}
              className="flex-1 overflow-auto flex flex-col items-start lg:items-center py-6 px-4"
              onClick={(e) => {
                // Only the grey backdrop itself — not clicks that bubbled up from the page.
                if (e.target === e.currentTarget) setActiveId(null);
              }}
            >
              {pendingPlacement && (
                <div className="w-full max-w-2xl mb-3 px-3 py-2 rounded-md bg-blue-50 border border-blue-200 text-xs text-blue-700 flex items-center justify-between gap-3">
                  <span>Click anywhere on the page to place your {pendingPlacement.type}.</span>
                  <button
                    onClick={() => setPendingPlacement(null)}
                    className="text-blue-600 hover:text-blue-800 font-medium shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {activeTool === "highlight" && !pendingPlacement && (
                <div className="w-full max-w-2xl mb-3 px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-700">
                  Drag across text on the page to highlight it. On a touch screen, press and hold on a word, then drag.
                </div>
              )}

              <div
                ref={stageRef}
                className="relative shadow-md bg-white"
                style={{ width: viewport?.width, height: viewport?.height }}
              >
                <canvas
                  ref={canvasRef}
                  onClick={handleStageClick}
                  className={`block ${pendingPlacement ? "cursor-copy" : activeTool === "text" ? "cursor-crosshair" : "cursor-default"}`}
                />

                {highlightsOnPage.map((h) => (
                  <div
                    key={h.id}
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: `${h.xRatio * 100}%`,
                      top: `${h.yRatio * 100}%`,
                      width: `${h.widthRatio * 100}%`,
                      height: `${h.heightRatio * 100}%`,
                      backgroundColor: h.color,
                      opacity: highlightOpacityOf(h),
                      pointerEvents: "none",
                    }}
                  />
                ))}

                {highlightDraft &&
                  highlightDraft.map((b, i) => (
                    <div
                      key={`draft_${i}`}
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: `${b.xRatio * 100}%`,
                        top: `${b.yRatio * 100}%`,
                        width: `${b.widthRatio * 100}%`,
                        height: `${b.heightRatio * 100}%`,
                        backgroundColor: highlightColor,
                        opacity: highlightOpacity,
                        pointerEvents: "none",
                      }}
                    />
                  ))}

                {canSelectText && (
                  <>
                    <style>{TEXT_LAYER_CSS}</style>
                    <div
                      ref={textLayerRef}
                      className="pdf-text-layer"
                      // Clicking the page (rather than dragging a selection) also
                      // deselects whichever field/signature/image was active, which
                      // the canvas's own click handler can't do while this covers it.
                      onClick={() => setActiveId(null)}
                    />
                  </>
                )}
                {watermark.enabled && watermark.text.trim() && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: `${watermark.fontSize}px`,
                        color: watermark.color,
                        opacity: watermark.opacity,
                        // CSS rotation is clockwise-positive; the rotation we
                        // store (and hand to pdf-lib on export) is
                        // counter-clockwise-positive, so it's negated here to
                        // make the preview spin the same way the export will.
                        transform: `rotate(${-watermark.rotation}deg)`,
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {watermark.text}
                    </span>
                  </div>
                )}

                {detectableTextItems.map((item) => (
                  <div
                    key={item.key}
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingText(item);
                    }}
                    title="Click to edit this text"
                    style={{
                      position: "absolute",
                      left: `${item.xRatio * 100}%`,
                      top: `${item.yRatio * 100}%`,
                      width: `${item.widthRatio * 100}%`,
                      height: `${item.heightRatio * 100}%`,
                    }}
                    className="cursor-text rounded-sm hover:bg-amber-400/20 hover:outline hover:outline-1 hover:outline-amber-400"
                  />
                ))}

                {textEditsOnPage.map((t) => {
                  const family = FONT_FAMILIES.find((x) => x.id === t.fontFamily);
                  const isActive = activeId === t.id;
                  const isHovered = hoveredId === t.id;
                  const showControls = isActive || isHovered;
                  // Everything here mirrors the export: size in points scaled up
                  // to screen pixels, text starting at the original's left edge,
                  // and 1pt of extra cover on each side.
                  const fontPx = t.fontSize * pxPerPt;
                  const padPx = pxPerPt;
                  const textStyle = {
                    fontSize: fontPx,
                    fontFamily: family?.css || "sans-serif",
                    bold: t.bold,
                    italic: t.italic,
                  };
                  const measuredWidth = measureTextWidth(t.text && t.text.length > 0 ? t.text : " ", textStyle);
                  const boxWidthPx = viewport ? t.boxWidthRatio * viewport.width : 0;
                  const boxHeightPx = viewport ? t.boxHeightRatio * viewport.height : 0;
                  const patchWidth = Math.max(boxWidthPx, measuredWidth) + padPx * 2;
                  const patchHeight = Math.max(boxHeightPx, fontPx * EDIT_LINE_HEIGHT_FACTOR);
                  // Sit the typed text on the original baseline. In a
                  // line-height-centred input the baseline lands at
                  // (lineHeight - (ascent + descent)) / 2 + ascent from the top;
                  // shift by whatever gap there is to the real baseline.
                  const metrics = measureFontMetrics(fontPx, textStyle);
                  const wantedBaseline = viewport ? (t.baselineYRatio - t.yRatio) * viewport.height : 0;
                  const naturalBaseline = metrics
                    ? (patchHeight - (metrics.ascent + metrics.descent)) / 2 + metrics.ascent
                    : wantedBaseline;
                  const baselineShift = wantedBaseline - naturalBaseline;
                  return (
                    <div
                      key={t.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveId(t.id);
                      }}
                      onMouseEnter={() => setHoveredId(t.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        position: "absolute",
                        left: `calc(${t.xRatio * 100}% - ${padPx}px)`,
                        top: `${t.yRatio * 100}%`,
                        width: patchWidth,
                        height: patchHeight,
                        backgroundColor: t.bgColor || DEFAULT_BG_COLOR,
                        // While the Highlight tool is active, edited text must stay
                        // highlightable like any other text on the page — without
                        // this, dragging over it would hit this box (and its input)
                        // instead of the selectable text layer underneath, and just
                        // put the cursor in the box instead of starting a highlight.
                        pointerEvents: activeTool === "highlight" ? "none" : undefined,
                      }}
                      className={
                        showControls
                          ? isActive
                            ? "outline outline-1 outline-blue-500"
                            : "outline outline-1 outline-dashed outline-neutral-300"
                          : ""
                      }
                    >
                      {/* Grip sits outside the patch box (absolute, hung off its
                          left edge) so dragging never fights clicking into the
                          input to place the caret or select text. */}
                      {showControls && (
                        <span
                          onPointerDown={(e) => beginDrag(e, "textEdit", t)}
                          onContextMenu={(e) => e.preventDefault()}
                          title="Drag to move"
                          className={`touch-none before:absolute before:-inset-y-2 before:-left-2 before:right-0 absolute right-full top-0 bottom-0 w-4 select-none cursor-grab active:cursor-grabbing flex items-center justify-center text-[10px] leading-none rounded-l ${
                            isActive ? "bg-blue-500 text-white" : "bg-neutral-200 text-neutral-500"
                          }`}
                        >
                          ⠿
                        </span>
                      )}
                      <input
                        value={t.text}
                        onChange={(e) => updateTextEdit(t.id, { text: e.target.value }, { snapshot: false })}
                        onFocus={() => {
                          snapshotHistory();
                          setActiveId(t.id);
                        }}
                        style={{
                          fontSize: fontPx,
                          lineHeight: `${patchHeight}px`,
                          color: t.color,
                          fontFamily: family?.css,
                          fontWeight: t.bold ? "bold" : "normal",
                          fontStyle: t.italic ? "italic" : "normal",
                          width: "100%",
                          height: "100%",
                          padding: `0 ${padPx}px`,
                          transform: baselineShift ? `translateY(${baselineShift}px)` : undefined,
                        }}
                        className="bg-transparent outline-none block"
                      />
                      {showControls && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTextEdit(t.id);
                          }}
                          title="Restore original text"
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] leading-none flex items-center justify-center"
                        >
                          ↺
                        </button>
                      )}
                    </div>
                  );
                })}

                {fieldsOnPage.map((f) => {
                  const family = FONT_FAMILIES.find((x) => x.id === f.fontFamily);
                  const isActive = activeId === f.id;
                  const isHovered = hoveredId === f.id;
                  const showControls = isActive || isHovered;
                  const measuredWidth = measureTextWidth(f.text && f.text.length > 0 ? f.text : "Type here", {
                    fontSize: f.fontSize,
                    fontFamily: family?.css || "sans-serif",
                    bold: f.bold,
                    italic: f.italic,
                  });
                  const inputWidth = Math.max(measuredWidth, 4) + 2;
                  return (
                    <div
                      key={f.id}
                      onMouseEnter={() => setHoveredId(f.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        position: "absolute",
                        left: `${f.xRatio * 100}%`,
                        top: `${f.yRatio * 100}%`,
                        transform: "translateY(-100%)",
                      }}
                      className="flex items-stretch"
                    >
                      {/* The grip sits *outside* the box (absolute, hung off its left
                          edge) rather than in the flex row. As a flex child it pushed
                          the input to the right while shown and let it snap back left
                          the moment the box lost focus/hover, so the text jumped. */}
                      {showControls && (
                        <span
                          onPointerDown={(e) => beginDrag(e, "field", f)}
                          onContextMenu={(e) => e.preventDefault()}
                          title="Drag to move"
                          className={`touch-none before:absolute before:-inset-y-2 before:-left-2 before:right-0 absolute right-full top-0 bottom-0 w-4 select-none cursor-grab active:cursor-grabbing flex items-center justify-center text-[10px] leading-none rounded-l ${
                            isActive ? "bg-blue-500 text-white" : "bg-neutral-200 text-neutral-500"
                          }`}
                        >
                          ⠿
                        </span>
                      )}
                      <input
                        value={f.text}
                        placeholder="Type here"
                        onChange={(e) => updateField(f.id, { text: e.target.value }, { snapshot: false })}
                        onFocus={() => {
                          snapshotHistory();
                          setActiveId(f.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && f.text === "") discardEmptyField(f.id);
                        }}
                        style={{
                          fontSize: f.fontSize,
                          lineHeight: `${f.fontSize}px`,
                          color: f.color,
                          fontFamily: family?.css,
                          fontWeight: f.bold ? "bold" : "normal",
                          fontStyle: f.italic ? "italic" : "normal",
                          textDecoration: f.underline ? "underline" : "none",
                          width: `${inputWidth}px`,
                          padding: 0,
                        }}
                        className={`bg-transparent outline-none ${
                          showControls
                            ? isActive
                              ? "border border-blue-500 ring-1 ring-blue-300"
                              : "border border-dashed border-neutral-300"
                            : "border border-transparent"
                        }`}
                      />
                    </div>
                  );
                })}

                {signaturesOnPage.map((s) => {
                  const isActive = activeId === s.id;
                  const isHovered = hoveredId === s.id;
                  const showControls = isActive || isHovered;
                  return (
                    <div
                      key={s.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveId(s.id);
                      }}
                      onPointerDown={(e) => beginDrag(e, "signature", s)}
                      onContextMenu={(e) => e.preventDefault()}
                      onMouseEnter={() => setHoveredId(s.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        position: "absolute",
                        left: `${s.xRatio * 100}%`,
                        top: `${s.yRatio * 100}%`,
                        width: `${s.widthRatio * 100}%`,
                      }}
                      className={`group touch-none select-none cursor-move ${
                        showControls
                          ? isActive
                            ? "outline outline-1 outline-blue-500"
                            : "outline outline-1 outline-dashed outline-neutral-300"
                          : ""
                      }`}
                    >
                      {showControls && (
                        <>
                          <span
                            onPointerDown={(e) => beginDrag(e, "signature", s)}
                            onContextMenu={(e) => e.preventDefault()}
                            title="Drag to move"
                            className={`touch-none before:absolute before:-inset-2 absolute -top-5 left-0 select-none cursor-grab active:cursor-grabbing flex items-center justify-center w-5 h-5 text-[10px] leading-none rounded ${
                              isActive ? "bg-blue-500 text-white" : "bg-neutral-200 text-neutral-500"
                            }`}
                          >
                            ⠿
                          </span>
                          <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSignature(s.id);
                            }}
                            title="Delete signature"
                            className="absolute -top-5 -right-5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] leading-none flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </>
                      )}
                      <img
                        src={s.dataUrl}
                        alt="Signature"
                        draggable={false}
                        className="w-full h-auto pointer-events-none select-none"
                      />
                      {showControls && (
                        <span
                          onPointerDown={(e) => beginResize(e, "signature", s)}
                          title="Drag to resize"
                          className="touch-none before:absolute before:-inset-3 absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-sm cursor-nwse-resize"
                        />
                      )}
                    </div>
                  );
                })}

                {imagesOnPage.map((im) => {
                  const isActive = activeId === im.id;
                  const isHovered = hoveredId === im.id;
                  const showControls = isActive || isHovered;
                  return (
                    <div
                      key={im.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveId(im.id);
                      }}
                      onPointerDown={(e) => beginDrag(e, "image", im)}
                      onContextMenu={(e) => e.preventDefault()}
                      onMouseEnter={() => setHoveredId(im.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        position: "absolute",
                        left: `${im.xRatio * 100}%`,
                        top: `${im.yRatio * 100}%`,
                        width: `${im.widthRatio * 100}%`,
                      }}
                      className={`group touch-none select-none cursor-move ${
                        showControls
                          ? isActive
                            ? "outline outline-1 outline-blue-500"
                            : "outline outline-1 outline-dashed outline-neutral-300"
                          : ""
                      }`}
                    >
                      {showControls && (
                        <>
                          <span
                            onPointerDown={(e) => beginDrag(e, "image", im)}
                            onContextMenu={(e) => e.preventDefault()}
                            title="Drag to move"
                            className={`touch-none before:absolute before:-inset-2 absolute -top-5 left-0 select-none cursor-grab active:cursor-grabbing flex items-center justify-center w-5 h-5 text-[10px] leading-none rounded ${
                              isActive ? "bg-blue-500 text-white" : "bg-neutral-200 text-neutral-500"
                            }`}
                          >
                            ⠿
                          </span>
                          <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(im.id);
                            }}
                            title="Delete image"
                            className="absolute -top-5 -right-5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] leading-none flex items-center justify-center"
                          >
                            ✕
                          </button>
                          <span
                            onPointerDown={(e) => beginRotate(e, im)}
                            title="Drag to rotate"
                            className="touch-none before:absolute before:-inset-3 absolute -top-9 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-emerald-500 rounded-full cursor-grab active:cursor-grabbing border-2 border-white shadow"
                          />
                        </>
                      )}
                      <div
                        style={{
                          transform: `rotate(${im.rotation || 0}deg)`,
                          transformOrigin: "center center",
                        }}
                      >
                        <img
                          src={im.dataUrl}
                          alt="Inserted"
                          draggable={false}
                          className="w-full h-auto pointer-events-none select-none block"
                        />
                      </div>
                      {showControls && (
                        <span
                          onPointerDown={(e) => beginResize(e, "image", im)}
                          title="Drag to resize"
                          className="touch-none before:absolute before:-inset-3 absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-sm cursor-nwse-resize"
                        />
                      )}
                    </div>
                  );
                })}

                {isRendering && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-sm text-neutral-500">
                    Rendering page…
                  </div>
                )}

                {/* Mobile/tablet: a compact toolbar right above whichever
                    field or piece of text is currently being edited, instead
                    of sending the person all the way to the bottom sheet for
                    every font tweak. Desktop already has the docked sidebar. */}
                {(() => {
                  const target =
                    activeField && activeField.page === pageNum
                      ? { kind: "field", data: activeField }
                      : activeTextEdit && activeTextEdit.page === pageNum
                      ? { kind: "textEdit", data: activeTextEdit }
                      : null;
                  if (!target) return null;
                  const { kind, data } = target;
                  const update = kind === "field" ? updateField : updateTextEdit;
                  const remove = kind === "field" ? removeField : removeTextEdit;

                  // Keep the toolbar clear of the box it edits. The two kinds
                  // hang off their anchor point in opposite directions: a new
                  // text field is drawn *above* (x, y), while edited PDF text
                  // is a patch drawn *below* it — so "just above the anchor"
                  // only clears the second kind. Work out where the box's
                  // top and bottom edges really are and hang the toolbar off
                  // those instead, flipping underneath when the box is too
                  // close to the top of the page for it to fit above.
                  const TOOLBAR_GAP = 10;
                  const TOOLBAR_HEIGHT = 44; // 28px controls + padding + border
                  const stageHeight = viewport ? viewport.height : 0;
                  const anchorY = data.yRatio * stageHeight;
                  const boxHeight =
                    kind === "field"
                      ? data.fontSize + 2 // line height + the input's 1px borders
                      : Math.max(data.boxHeightRatio * stageHeight, data.fontSize * pxPerPt * EDIT_LINE_HEIGHT_FACTOR);
                  const boxTop = kind === "field" ? anchorY - boxHeight : anchorY;
                  const boxBottom = kind === "field" ? anchorY : anchorY + boxHeight;
                  // The page has ~24px of padding above it in the scroll area, so
                  // the toolbar may poke a little above the page and still be visible.
                  const fitsAbove = boxTop - TOOLBAR_GAP - TOOLBAR_HEIGHT >= -16;

                  return (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="lg:hidden absolute z-20 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-neutral-200 px-1.5 py-1"
                      style={{
                        left: `${data.xRatio * 100}%`,
                        top: fitsAbove ? `${boxTop - TOOLBAR_GAP}px` : `${boxBottom + TOOLBAR_GAP}px`,
                        transform: fitsAbove ? "translateY(-100%)" : "none",
                        maxWidth: "calc(100% - 8px)",
                      }}
                    >
                      <FontSizeInput
                        id="font-size-options-mobile"
                        value={data.fontSize}
                        options={sizeOptionsFor(data.fontSize)}
                        onChange={(size) => update(data.id, { fontSize: size })}
                        className="text-xs border border-neutral-300 rounded px-1 py-1 shrink-0 w-12"
                      />
                      <button
                        type="button"
                        onClick={() => update(data.id, { bold: !data.bold })}
                        title="Bold"
                        className={`w-7 h-7 shrink-0 rounded text-sm font-bold ${
                          data.bold ? "bg-blue-50 text-blue-700 border border-blue-400" : "text-neutral-600"
                        }`}
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => update(data.id, { italic: !data.italic })}
                        title="Italic"
                        className={`w-7 h-7 shrink-0 rounded text-sm italic ${
                          data.italic ? "bg-blue-50 text-blue-700 border border-blue-400" : "text-neutral-600"
                        }`}
                      >
                        I
                      </button>
                      {kind === "field" && (
                        <button
                          type="button"
                          onClick={() => update(data.id, { underline: !data.underline })}
                          title="Underline"
                          className={`w-7 h-7 shrink-0 rounded text-sm underline ${
                            data.underline ? "bg-blue-50 text-blue-700 border border-blue-400" : "text-neutral-600"
                          }`}
                        >
                          U
                        </button>
                      )}
                      <input
                        type="color"
                        value={data.color}
                        onChange={(e) => update(data.id, { color: e.target.value })}
                        title="Color"
                        className="w-7 h-7 shrink-0 rounded border border-neutral-300 cursor-pointer p-0"
                      />
                      <div className="w-px h-5 bg-neutral-200 mx-0.5 shrink-0" />
                      <button
                        type="button"
                        onClick={() => setMobileElementsOpen(true)}
                        title="More options"
                        className="w-7 h-7 shrink-0 rounded text-neutral-500 flex items-center justify-center"
                      >
                        <MoreIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(data.id)}
                        title="Delete"
                        className="w-7 h-7 shrink-0 rounded text-red-500 flex items-center justify-center text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Bottom bar: page nav + zoom */}
            <div className="border-t border-neutral-200 bg-white px-3 sm:px-4 py-2 flex items-center justify-between gap-3 text-sm shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                  disabled={pageNum <= 1}
                  className="p-1.5 rounded border border-neutral-300 disabled:opacity-40"
                >
                  <ChevronLeftIcon />
                </button>
                <span className="text-neutral-600 text-xs sm:text-sm whitespace-nowrap">
                  Page {pageNum} / {numPages}
                </span>
                <button
                  onClick={() => setPageNum((p) => Math.min(numPages, p + 1))}
                  disabled={pageNum >= numPages}
                  className="p-1.5 rounded border border-neutral-300 disabled:opacity-40"
                >
                  <ChevronRightIcon />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
                  className="p-1.5 rounded border border-neutral-300"
                  title="Zoom out"
                >
                  <ZoomOutIcon />
                </button>
                <span className="text-xs text-neutral-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.1).toFixed(2)))}
                  className="p-1.5 rounded border border-neutral-300"
                  title="Zoom in"
                >
                  <ZoomInIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop inspector */}
          <aside className="hidden lg:block w-80 shrink-0 border-l border-neutral-200 bg-white overflow-y-auto p-4">
            {renderInspectorContent()}
          </aside>
        </div>
      )}

      {/* Mobile: pages drawer */}
      {mobilePagesOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobilePagesOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-3 border-b border-neutral-200">
              <span className="text-sm font-semibold">Pages</span>
              <button onClick={() => setMobilePagesOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            {renderPagesList(() => setMobilePagesOpen(false))}
          </div>
        </div>
      )}

      {/* Mobile: elements bottom sheet */}
      {showMobileSheet && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={closeMobileSheet} />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl shadow-xl max-h-[75vh] overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Elements</span>
              <button onClick={closeMobileSheet}>
                <CloseIcon />
              </button>
            </div>
            {renderInspectorContent()}
          </div>
        </div>
      )}

      {showSignaturePad && (
        <SignaturePad onSave={handleSaveSignature} onClose={() => setShowSignaturePad(false)} />
      )}
    </div>
  );
}
