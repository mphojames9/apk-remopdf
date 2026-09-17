import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';

/* ---------------------------------------------------------------------- *
 * PLATFORM DETECTION
 * The same component runs in a desktop browser and inside the Capacitor
 * WebView. Almost every file API behaves differently between the two, so
 * everything below branches on this instead of on screen size.
 * ---------------------------------------------------------------------- */
const isNative =
  typeof window !== 'undefined' &&
  (window.Capacitor?.isNativePlatform?.() === true ||
    /* older Capacitor builds */ !!window.Capacitor?.isNative);

const nativeFilesystem = () =>
  (typeof window !== 'undefined' && window.Capacitor?.Plugins?.Filesystem) || null;

// showDirectoryPicker does not exist in Android WebView, and webkitdirectory
// is ignored by the Android file chooser, so folder mode is desktop-only.
const supportsDirectoryPicker =
  !isNative && typeof window !== 'undefined' && 'showDirectoryPicker' in window;
const supportsFolderInput = !isNative;

// A phone cannot hold a 500MB archive in the WebView heap; the renderer
// process gets killed long before that.
const MAX_ZIP_MB = isNative ? 150 : 500;

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

/* ---------------------------------------------------------------------- *
 * FILE HELPERS
 * ---------------------------------------------------------------------- */

/** Base64 payload of a Blob, without the `data:...;base64,` prefix. */
const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
    reader.onerror = () => reject(reader.error || new Error('Could not read data'));
    reader.readAsDataURL(blob);
  });

/**
 * Android hands picked files over as content:// backed Blobs whose stream can
 * only be read ONCE. JSZip reads lazily, so passing the File straight to
 * zip.file() fails silently on the second touch. Read the bytes up front.
 */
const readFileOnce = async (file) => {
  if (typeof file.arrayBuffer === 'function') return file.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error(`Could not read ${file.name}`));
    reader.readAsArrayBuffer(file);
  });
};

/** Strip `..`, leading slashes and drive letters out of a zip entry path. */
const safeEntryPath = (name) =>
  String(name)
    .replace(/\\/g, '/')
    .split('/')
    .filter((part) => part && part !== '.' && part !== '..')
    .join('/');

// Directory.Documents is blocked on Android 11+. The first failure flips this
// flag so every later save goes down the DownloadListener route instead.
let filesystemBroken = false;

/** Try the Capacitor Filesystem plugin. Returns false if it is unavailable. */
async function writeWithFilesystem(base64, path) {
  const fs = nativeFilesystem();
  if (!fs || filesystemBroken) return false;
  try {
    await fs.writeFile({ path, data: base64, directory: 'DOCUMENTS', recursive: true });
    return true;
  } catch (err) {
    console.warn('Filesystem write failed, falling back to the download listener:', err);
    filesystemBroken = true;
    return false;
  }
}

/**
 * Emit a data: URL in exactly the shape MainActivity.saveBase64ToDownloads()
 * already parses — `data:<mime>;name=<encoded>;base64,<payload>` — which lands
 * the file in Downloads/RemoPDF through MediaStore on every Android version.
 * A blob: URL is useless here: it never reaches WebView's DownloadListener.
 */
function triggerNativeDownload(base64, filename, mime) {
  const dataUrl = `data:${mime};name=${encodeURIComponent(filename)};base64,${base64}`;
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Save a Blob so the user can actually find it.
 * Returns a short human-readable description of where the file went.
 */
async function saveBlob(blob, filename, mimeOverride) {
  const mime = mimeOverride || blob.type || 'application/octet-stream';

  if (!isNative) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Revoking synchronously can cancel the download in some browsers.
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return 'Downloads';
  }

  const base64 = await blobToBase64(blob);

  if (await writeWithFilesystem(base64, `RemoPDF/${safeEntryPath(filename)}`)) {
    return 'Documents/RemoPDF';
  }

  triggerNativeDownload(base64, filename, mime);
  return 'Downloads/RemoPDF';
}

async function writeFileToDirectory(dirHandle, relativePath, data) {
  const parts = safeEntryPath(relativePath).split('/').filter(Boolean);
  const fileName = parts.pop();
  let currentDir = dirHandle;
  for (const folder of parts) {
    currentDir = await currentDir.getDirectoryHandle(folder, { create: true });
  }
  const fileHandle = await currentDir.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(data);
  await writable.close();
}

/* ---------------------------------------------------------------------- *
 * DESIGN TOKENS — premium white surface, orange → red accent
 * ---------------------------------------------------------------------- */
const TOKENS = `
  .zs-scope {
    --zs-bg: #FFFFFF;
    --zs-surface: #FFFFFF;
    --zs-surface-2: #F5F5F7;
    --zs-line: rgba(18,21,37,0.08);
    --zs-text: #121525;
    --zs-dim: #767187;
    --zs-orange: #FF7A1A;
    --zs-red: #FF2D55;
    --zs-grad: linear-gradient(135deg, var(--zs-orange), var(--zs-red));
    font-family: "Outfit", sans-serif;
  }
  /* A display:none input is not reliably clickable in Android WebView —
     keep it in the layout but invisible. */
  .zs-file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
  }
  @keyframes zsPulseRing {
    0%   { box-shadow: 0 0 0 0 rgba(255,45,85,0.35); }
    70%  { box-shadow: 0 0 0 16px rgba(255,45,85,0); }
    100% { box-shadow: 0 0 0 0 rgba(255,45,85,0); }
  }
  @keyframes zsShine {
    0%   { transform: translateX(-130%) skewX(-15deg); }
    100% { transform: translateX(230%) skewX(-15deg); }
  }
  .zs-cta {
    animation: zsPulseRing 2.6s ease-out infinite;
  }
  .zs-cta .zs-shine {
    animation: zsShine 3.2s ease-in-out infinite;
  }
  .zs-cta:hover .zs-arrow {
    transform: translateX(4px);
  }
`;

/* Circular progress ring — used instead of a bar for a native-app feel */
const RingProgress = ({ percent = 0, size = 64, stroke = 5, children }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(18,21,37,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#zsGradStroke)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 200ms ease' }}
        />
        <defs>
          <linearGradient id="zsGradStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A1A" />
            <stop offset="100%" stopColor="#FF2D55" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};

const IconBadge = ({ icon, size = 44, active = true }) => (
  <div
    className="rounded-2xl flex items-center justify-center shrink-0"
    style={{
      width: size,
      height: size,
      background: active ? 'var(--zs-grad)' : 'var(--zs-surface-2)',
      boxShadow: active ? '0 8px 20px -6px rgba(255,45,85,0.35)' : 'none',
    }}
  >
    <i className={`fa-solid ${icon} ${active ? 'text-white' : ''}`} style={{ fontSize: size * 0.4, color: active ? '#fff' : 'var(--zs-dim)' }} />
  </div>
);

const PrimaryButton = ({ onClick, disabled, busy, icon, label, busyLabel }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full h-16 rounded-[1.5rem] text-white text-[15px] font-bold flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100"
    style={{
      background: 'var(--zs-grad)',
      boxShadow: disabled ? 'none' : '0 14px 30px -10px rgba(255,45,85,0.45)',
    }}
  >
    {busy ? (
      <>
        <i className="fa-solid fa-circle-notch animate-spin" />
        <span>{busyLabel}</span>
      </>
    ) : (
      <>
        <i className={`fa-solid ${icon}`} />
        <span>{label}</span>
      </>
    )}
  </button>
);

/* Big tappable target used for both empty states — icon-led, near no copy */
const TapTarget = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="w-full flex flex-col items-center py-10 active:scale-[0.98] transition-transform duration-200">
    <div
      className="w-28 h-28 rounded-full flex items-center justify-center mb-4 relative"
      style={{ background: 'var(--zs-surface-2)', border: '1.5px dashed rgba(255,122,26,0.45)' }}
    >
      <i className={`fa-solid ${icon} text-3xl relative`} style={{ color: '#FF6A1A' }} />
    </div>
    <span className="text-[13px] font-semibold" style={{ color: 'var(--zs-dim)' }}>{label}</span>
  </button>
);

/* Inline status line — on device there is no console, so failures have to be
   visible in the UI or the app just looks broken. */
const StatusLine = ({ error, notice }) => {
  if (!error && !notice) return null;
  return (
    <p
      className="mt-3 text-[12px] font-semibold leading-relaxed text-center"
      style={{ color: error ? '#FF2D55' : 'var(--zs-dim)' }}
    >
      <i className={`fa-solid ${error ? 'fa-circle-exclamation' : 'fa-circle-check'} mr-1.5`} />
      {error || notice}
    </p>
  );
};

/* ---------------------------------------------------------------------- */
/* ZIP TAB                                                                 */
/* ---------------------------------------------------------------------- */
const ZipPanel = () => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handlePick = (e) => {
    try {
      const picked = Array.from(e.target.files || []);
      if (!picked.length) return;

      const total = picked.reduce((sum, f) => sum + (f.size || 0), 0);
      if (total > MAX_ZIP_MB * 1024 * 1024) {
        setError(`That selection is ${formatBytes(total)}. Keep it under ${MAX_ZIP_MB}MB.`);
        return;
      }

      // webkitRelativePath is undefined/'' in the Android chooser — never
      // call .split() on it blindly.
      const root = picked[0].webkitRelativePath
        ? picked[0].webkitRelativePath.split('/')[0]
        : '';
      const base =
        root ||
        (picked.length === 1 ? picked[0].name.replace(/\.[^.]+$/, '') : 'archive');

      setFiles(picked);
      setFolderName(base || 'archive');
      setError('');
      setNotice('');
    } catch (err) {
      setError(`Could not read that selection: ${err?.message || err}`);
    } finally {
      // Lets the user re-pick the same files after a reset.
      if (e.target) e.target.value = '';
    }
  };

  const reset = () => {
    setFiles([]);
    setFolderName('');
    setProgress(0);
    setError('');
    setNotice('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleZip = useCallback(async () => {
    if (!files.length) return;
    setBusy(true);
    setProgress(0);
    setError('');
    setNotice('');
    try {
      const zip = new JSZip();

      // Phase 1 (0-40%): pull the bytes out of every picked file exactly once.
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = await readFileOnce(file);
        zip.file(file.webkitRelativePath || file.name, buffer);
        setProgress(Math.round(((i + 1) / files.length) * 40));
      }

      // Phase 2 (40-100%): compress.
      const blob = await zip.generateAsync(
        { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
        (meta) => setProgress(40 + Math.round(meta.percent * 0.6))
      );

      const where = await saveBlob(blob, `${folderName || 'archive'}.zip`, 'application/zip');
      setNotice(`Saved ${formatBytes(blob.size)} to ${where}`);
    } catch (err) {
      console.error('Zip failed:', err);
      setError(`Zip failed: ${err?.message || err}`);
    } finally {
      setBusy(false);
    }
  }, [files, folderName]);

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div>
      {/* Android's file chooser ignores webkitdirectory, so native builds pick
          multiple files instead of a folder. */}
      {supportsFolderInput ? (
        <input
          ref={inputRef}
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          onChange={handlePick}
          className="zs-file-input"
        />
      ) : (
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handlePick}
          className="zs-file-input"
        />
      )}

      {!files.length ? (
        <TapTarget
          icon={supportsFolderInput ? 'fa-folder-plus' : 'fa-file-circle-plus'}
          label={supportsFolderInput ? 'Tap to pick a folder' : 'Tap to pick files'}
          onClick={() => inputRef.current?.click()}
        />
      ) : (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'var(--zs-surface-2)' }}>
          {busy ? (
            <RingProgress percent={progress} size={48}>
              <span className="text-[11px] font-bold" style={{ color: 'var(--zs-text)' }}>{progress}%</span>
            </RingProgress>
          ) : (
            <IconBadge icon={supportsFolderInput ? 'fa-folder' : 'fa-copy'} size={48} />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold truncate" style={{ color: 'var(--zs-text)' }}>{folderName}</p>
            <p className="text-[12px] font-medium" style={{ color: 'var(--zs-dim)' }}>
              {files.length} files · {formatBytes(totalSize)}
            </p>
          </div>
          {!busy && (
            <button onClick={reset} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(18,21,37,0.05)' }}>
              <i className="fa-solid fa-xmark text-sm" style={{ color: 'var(--zs-dim)' }} />
            </button>
          )}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-5">
          <PrimaryButton
            onClick={handleZip}
            disabled={busy}
            busy={busy}
            icon="fa-file-zipper"
            label="Zip it"
            busyLabel="Zipping…"
          />
        </div>
      )}

      <StatusLine error={error} notice={notice} />
    </div>
  );
};

/* ---------------------------------------------------------------------- */
/* UNZIP TAB                                                               */
/* ---------------------------------------------------------------------- */
const UnzipPanel = () => {
  const inputRef = useRef(null);
  const [zipFile, setZipFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handlePick = (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Android providers report zips as application/zip,
      // application/x-zip-compressed, octet-stream or nothing at all — trust
      // the extension, not the MIME type.
      const looksZip =
        /\.zip$/i.test(file.name || '') ||
        ['application/zip', 'application/x-zip-compressed', 'multipart/x-zip'].includes(file.type);

      if (!looksZip) {
        setError(`That is not a .zip (name: ${file.name || 'unknown'}, type: ${file.type || 'none'}).`);
        return;
      }
      if (file.size > MAX_ZIP_MB * 1024 * 1024) {
        setError(`That archive is ${formatBytes(file.size)}. Keep it under ${MAX_ZIP_MB}MB.`);
        return;
      }

      setZipFile(file);
      setError('');
      setNotice('');
    } catch (err) {
      setError(`Could not read that file: ${err?.message || err}`);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const reset = () => {
    setZipFile(null);
    setProgress(0);
    setError('');
    setNotice('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleUnzip = useCallback(async () => {
    if (!zipFile) return;
    setBusy(true);
    setProgress(0);
    setError('');
    setNotice('');
    try {
      // Single read of the content:// stream, then work from memory.
      const buffer = await readFileOnce(zipFile);
      const zip = await JSZip.loadAsync(buffer);
      const entries = Object.values(zip.files).filter((entry) => !entry.dir);

      if (!entries.length) {
        setError('That archive is empty.');
        setBusy(false);
        return;
      }

      const outRoot = (zipFile.name || 'archive').replace(/\.zip$/i, '') || 'archive';

      /* --- Native: write straight to disk with the Filesystem plugin ------
         Keeps folder structure and avoids one download prompt per file. If
         the plugin is missing or the OS blocks the folder, we drop through
         to the per-file path below.                                        */
      if (isNative && nativeFilesystem() && !filesystemBroken) {
        let wroteAll = true;
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const relative = safeEntryPath(entry.name);
          if (!relative) continue;
          const base64 = await blobToBase64(await entry.async('blob'));
          if (!(await writeWithFilesystem(base64, `RemoPDF/${outRoot}/${relative}`))) {
            wroteAll = false;
            break;
          }
          setProgress(Math.round(((i + 1) / entries.length) * 100));
        }
        if (wroteAll) {
          setNotice(`Extracted ${entries.length} files to Documents/RemoPDF/${outRoot}`);
          return;
        }
        setProgress(0);
      }

      /* --- Desktop with the File System Access API ----------------------- */
      if (supportsDirectoryPicker) {
        let dirHandle;
        try {
          dirHandle = await window.showDirectoryPicker();
        } catch {
          setBusy(false);
          return;
        }
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const data = await entry.async('blob');
          await writeFileToDirectory(dirHandle, entry.name, data);
          setProgress(Math.round(((i + 1) / entries.length) * 100));
        }
        setNotice(`Extracted ${entries.length} files.`);
        return;
      }

      /* --- Fallback: save each entry one by one --------------------------
         On native this goes through MainActivity's DownloadListener, which
         fires a toast (and an interstitial) per file, so keep the batch
         small and tell the user what is happening.                        */
      const HARD_LIMIT = isNative ? 25 : entries.length;
      const batch = entries.slice(0, HARD_LIMIT);

      for (let i = 0; i < batch.length; i++) {
        const entry = batch[i];
        const data = await entry.async('blob');
        const flatName = safeEntryPath(entry.name).replace(/\//g, '__') || `file_${i + 1}`;
        await saveBlob(data, flatName, data.type || 'application/octet-stream');
        setProgress(Math.round(((i + 1) / batch.length) * 100));
        // Give the WebView time to hand each file to the download layer.
        await new Promise((r) => setTimeout(r, isNative ? 450 : 150));
      }

      setNotice(
        batch.length < entries.length
          ? `Saved the first ${batch.length} of ${entries.length} files. Install @capacitor/filesystem to extract whole archives at once.`
          : `Saved ${batch.length} files.`
      );
    } catch (err) {
      console.error('Unzip failed:', err);
      setError(`Unzip failed: ${err?.message || err}`);
    } finally {
      setBusy(false);
    }
  }, [zipFile]);

  return (
    <div>
      {/* accept must list every MIME type Android might report for a zip, or
          the picker greys the file out. */}
      <input
        ref={inputRef}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed,multipart/x-zip,application/octet-stream"
        onChange={handlePick}
        className="zs-file-input"
      />

      {!zipFile ? (
        <TapTarget icon="fa-file-zipper" label="Tap to pick a .zip" onClick={() => inputRef.current?.click()} />
      ) : (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'var(--zs-surface-2)' }}>
          {busy ? (
            <RingProgress percent={progress} size={48}>
              <span className="text-[11px] font-bold" style={{ color: 'var(--zs-text)' }}>{progress}%</span>
            </RingProgress>
          ) : (
            <IconBadge icon="fa-file-zipper" size={48} />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold truncate" style={{ color: 'var(--zs-text)' }}>{zipFile.name}</p>
            <p className="text-[12px] font-medium" style={{ color: 'var(--zs-dim)' }}>{formatBytes(zipFile.size)}</p>
          </div>
          {!busy && (
            <button onClick={reset} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(18,21,37,0.05)' }}>
              <i className="fa-solid fa-xmark text-sm" style={{ color: 'var(--zs-dim)' }} />
            </button>
          )}
        </div>
      )}

      {zipFile && (
        <div className="mt-5">
          <PrimaryButton
            onClick={handleUnzip}
            disabled={busy}
            busy={busy}
            icon="fa-box-open"
            label={supportsDirectoryPicker || (isNative && nativeFilesystem()) ? 'Unzip to folder' : 'Unzip it'}
            busyLabel="Extracting…"
          />
        </div>
      )}

      <StatusLine error={error} notice={notice} />
    </div>
  );
};

/* ---------------------------------------------------------------------- */
/* SEGMENTED TAB SWITCH                                                    */
/* ---------------------------------------------------------------------- */
const TabSwitch = ({ tab, setTab }) => (
  <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl" style={{ background: 'var(--zs-surface-2)' }}>
    {[
      { id: 'zip', icon: 'fa-file-zipper', label: 'Zip' },
      { id: 'unzip', icon: 'fa-box-open', label: 'Unzip' },
    ].map((t) => {
      const active = tab === t.id;
      return (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className="h-12 rounded-xl flex items-center justify-center gap-2 text-[14px] font-bold transition-all duration-200"
          style={{
            background: active ? 'var(--zs-grad)' : 'transparent',
            color: active ? '#fff' : 'var(--zs-dim)',
            boxShadow: active ? '0 8px 18px -8px rgba(255,45,85,0.4)' : 'none',
          }}
        >
          <i className={`fa-solid ${t.icon}`} />
          <span>{t.label}</span>
        </button>
      );
    })}
  </div>
);

/* ---------------------------------------------------------------------- */
/* FULL-WIDTH BRAND HEADER                                                 */
/* ---------------------------------------------------------------------- */
const BrandHeader = () => {
  // No mobile menu on this page — kept as a no-op so the link behaves
  // the same way it does in the site's main Navbar.
  const closeMobileMenu = () => {};

  return (
    <header className="w-full sticky top-0 z-[70] bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center">
        {/* Logo Brand Title */}
        <div className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 z-[70]">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2 outline-none rounded-lg group">
            <span className="font-black text-[1.25rem] text-slate-800 tracking-tight">
              Remo<span className="text-red-600">PDF</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

/* ---------------------------------------------------------------------- */
/* ANIMATED RESUME CTA                                                     */
/* ---------------------------------------------------------------------- */
const ResumeCTA = () => (
  <Link
    to="/ResumeBuilder"
    className="zs-cta relative mt-6 w-full h-16 rounded-[1.5rem] flex items-center justify-center gap-3 overflow-hidden text-white text-[15px] font-bold transition-transform duration-300 active:scale-[0.97] hover:-translate-y-0.5"
    style={{ background: 'linear-gradient(135deg, #17151C, #0B0A0E)' }}
  >
    <span className="zs-shine absolute inset-y-0 left-0 w-1/3 bg-white/10 blur-md pointer-events-none" />
    <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#FF7A1A' }} />
    <span>Build your resume</span>
    <i className="fa-solid fa-arrow-right zs-arrow transition-transform duration-300" style={{ color: '#FF2D55' }} />
  </Link>
);

/* ---------------------------------------------------------------------- */
/* PAGE                                                                    */
/* ---------------------------------------------------------------------- */
export default function ZipTool() {
  const [tab, setTab] = useState('zip');

  return (
    <div className="zs-scope" style={{ minHeight: '100vh', background: 'var(--zs-bg)' }}>
      <style>{TOKENS}</style>

      <BrandHeader />

      <div className="relative max-w-md mx-auto px-5 pt-8 pb-6 flex flex-col">

        <TabSwitch tab={tab} setTab={setTab} />

        {/* card */}
        <div
          className="mt-5 rounded-[1.75rem] p-5"
          style={{ background: 'var(--zs-surface)', border: '1px solid var(--zs-line)', boxShadow: '0 20px 45px -25px rgba(18,21,37,0.15)' }}
        >
          {tab === 'zip' ? <ZipPanel /> : <UnzipPanel />}
        </div>

        <ResumeCTA />
      </div>

      {/* footer */}
      <footer className="w-full border-t border-slate-100 mt-8">
        <div className="max-w-md mx-auto px-5 py-6 flex items-start gap-2.5 text-center sm:text-left justify-center sm:justify-start">
          <i className="fa-solid fa-circle-info mt-0.5" style={{ color: 'var(--zs-dim)' }} />
          <p className="text-[12px] font-medium leading-relaxed" style={{ color: 'var(--zs-dim)' }}>
            Zip files are processed entirely on your device — for smooth performance, keep archives under {MAX_ZIP_MB}MB.
          </p>
        </div>
      </footer>
    </div>
  );
}
