import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import './Workspace.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { processEditedPdf, getPdfPreviews } from '../api/client';

// The worker MUST be same-origin and shipped inside the APK.
// A CDN worker (unpkg) is cross-origin for the Capacitor WebView (https://localhost)
// and needs live internet, so it silently fails on device -> "Setting up fake worker failed".
// Copy node_modules/pdfjs-dist/build/pdf.worker.min.mjs into public/ as pdf.worker.min.js
// (the .js extension guarantees a correct JS mime type from Capacitor's local server).
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PdfEditor() {
  const [pdfFile, setPdfFile] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rawFile, setRawFile] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);

  // --- Toast Notification State ---
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });

  // --- Image Placement State ---
  const [pendingImage, setPendingImage] = useState(null);

  // --- Signature State ---
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const signatureCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pendingSignature, setPendingSignature] = useState(null);

  // Dynamic Signature States
  const [signColor, setSignColor] = useState('#000000');
  const [signStrokeWidth, setSignStrokeWidth] = useState(3);
  const pathsRef = useRef([]); 
  const currentPathRef = useRef([]);

  // --- Watermark Modal & Customization State ---
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkColor, setWatermarkColor] = useState('#0f172a');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.2);
  const [watermarkApplyToAll, setWatermarkApplyToAll] = useState(true);
  
  // Edits and Interaction State
  const [textEdits, setTextEdits] = useState({});
  const [imageEdits, setImageEdits] = useState({});
  const imageInputRef = useRef(null);
  const [activeEditId, setActiveEditId] = useState(null);
  const [dragInfo, setDragInfo] = useState({
    id: null, page: null, type: null, itemType: null, startX: 0, startY: 0, centerX: 0, centerY: 0, initialX: 0, initialY: 0, initialWidth: 0, initialRotation: 0
  });

  // Page state for thumbnails and navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // --- Undo/Redo State ---
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // Helper to show toasts for debugging and alerts
  const showToast = (message, type = 'error') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 6000); // 6 seconds to allow reading errors
  };

  const hasWatermark = Object.values(imageEdits).some(pageEdits =>
    pageEdits?.some(img => img.isWatermark)
  );

  const saveState = () => {
    setPast(prev => {
      const currentStateString = JSON.stringify({ text: textEdits, image: imageEdits });
      const lastStateString = prev.length > 0 ? JSON.stringify(prev[prev.length - 1]) : null;
      if (currentStateString === lastStateString) return prev;
      return [...prev, JSON.parse(currentStateString)];
    });
    setFuture([]); 
  };

  const handleUndo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast(past.slice(0, -1));
    setFuture([{ text: textEdits, image: imageEdits }, ...future]);
    setTextEdits(previous.text);
    setImageEdits(previous.image);
    setActiveEditId(null);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(future.slice(1));
    setPast([...past, { text: textEdits, image: imageEdits }]);
    setTextEdits(next.text);
    setImageEdits(next.image);
    setActiveEditId(null);
  };
  
  const fileInputRef = useRef(null);

  // Phone screens cannot afford an 800px-wide canvas per page.
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 800
  );
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const pageWidth = Math.max(280, Math.min(800, viewportWidth - 24));
  // Cap the render resolution: phones report devicePixelRatio 3-4, which makes
  // every canvas 9-16x larger in memory and kills the WebView renderer process.
  const renderDpr = typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio || 1, 2)
    : 1;
  // How many pages either side of the current one get a real canvas.
  const RENDER_WINDOW = 1;
  
  const handleImageUpload = (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const isImageMime = file.type && file.type.startsWith('image/');
      const isImageExt = file.name && /\.(jpe?g|png|gif|webp|svg|bmp)$/i.test(file.name);

      if (isImageMime || isImageExt) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPendingImage(event.target.result);
          setActiveTool('place-image');
        };
        reader.onerror = (error) => {
          console.error("Failed to read image file on Android:", error);
          showToast(`File Reader Error: ${error?.message || 'Unable to read image.'}`);
        };
        reader.readAsDataURL(file);
      } else {
        showToast(`Invalid image format. Detected type: ${file.type}`);
      }
    } catch (err) {
      showToast(`Image Upload Error: ${err.message}`);
    } finally {
      if (e.target) e.target.value = null;
    }
  };

  const removeImage = (page, id) => {
    setImageEdits(prev => ({
      ...prev,
      [page]: prev[page].filter(img => img.id !== id)
    }));
  };

  const mainContainerRef = useRef(null);
  const pageRefs = useRef({});

const handleFileUpload = async (e) => {
  try {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdfType = file.type === 'application/pdf' || file.type === 'application/octet-stream' || !file.type;
    const isPdfExt = file.name && file.name.toLowerCase().endsWith('.pdf');

    if (isPdfType || isPdfExt) {
      setCurrentPage(1);
      setTextEdits({});
      setImageEdits({});
      setActiveEditId(null);
      setIsProcessing(true);

      // Android hands us picked files (Drive, Downloads, etc.) as a
      // content:// backed Blob whose underlying stream can only be read
      // ONCE. We read it a single time here, then rebuild a plain,
      // fully in-memory File from those bytes so every later consumer
      // (preview call, download call, etc.) reads from memory instead
      // of re-touching the original content:// stream, which fails
      // silently the second time.
      const arrayBuffer = await file.arrayBuffer();
      const uploadFile = new File(
        [arrayBuffer],
        file.name || 'document.pdf',
        { type: file.type || 'application/pdf' }
      );

      setRawFile(uploadFile);

      // Do NOT hand the raw ArrayBuffer to react-pdf: pdf.js transfers it to the
      // worker, which detaches it. The second <Document> (and every re-render)
      // then gets a zero-length buffer. A blob: URL is read-only and reusable.
      setPdfFile((prev) => {
        if (typeof prev === 'string' && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev);
        }
        return URL.createObjectURL(uploadFile);
      });

      try {
        const previewData = await getPdfPreviews([uploadFile]);
        if (previewData && previewData.length > 0) {
          setPdfPages(previewData[0].pages);
          setTotalPages(previewData[0].pages.length);
        } else {
          throw new Error("Invalid response from server. Missing preview data.");
        }
      } catch (err) {
        console.error("Failed to parse PDF via backend:", err);
        showToast(`Server Error: ${err.message || JSON.stringify(err)}`);
        setRawFile(null);
        setPdfFile((prev) => {
          if (typeof prev === 'string' && prev.startsWith('blob:')) {
            URL.revokeObjectURL(prev);
          }
          return null;
        });
      } finally {
        setIsProcessing(false);
      }
    } else {
      showToast(`File rejected. Name: ${file.name}, Detected Type: ${file.type || 'None'}`);
    }
  } catch (err) {
    showToast(`System Error during upload: ${err.message}`);
  } finally {
    if (e.target) e.target.value = null;
  }
};

  const handleDownload = async () => {
    if (!rawFile) return;
    setIsProcessing(true);
    setActiveEditId(null);
    
    const payload = {
      deletedPages: [],
      pages: {}
    };

    const editedPages = new Set([
      ...Object.keys(textEdits), 
      ...Object.keys(imageEdits)
    ]);

    editedPages.forEach(pageNum => {
      payload.pages[pageNum] = {
        texts: textEdits[pageNum] || [],
        images: imageEdits[pageNum] || [] 
      };
    });

    try {
      await processEditedPdf(rawFile, payload);
    } catch (error) {
      console.error("Error processing PDF:", error);
      showToast(`Download Failed: ${error.message || JSON.stringify(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextChange = (page, id, newText) => {
    setTextEdits(prev => ({
      ...prev,
      [page]: (prev[page] || []).map(edit => edit.id === id ? { ...edit, text: newText } : edit)
    }));
  };

  const updateTextAttribute = (page, id, key, value) => {
    saveState();
    setTextEdits(prev => ({
      ...prev,
      [page]: (prev[page] || []).map(edit => edit.id === id ? { ...edit, [key]: value } : edit)
    }));
  };

  const createWatermarkSvg = (text, color, opacity) => {
    const safeText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const estimatedWidth = Math.max(1200, text.length * 115);
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${estimatedWidth} 300" width="${estimatedWidth}" height="300"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="140" font-weight="900" fill="${color}" fill-opacity="${opacity}">${safeText}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  };

  const handleApplyWatermark = () => {
    if (!watermarkText.trim()) {
      showToast("Please enter watermark text.", 'info');
      return;
    }

    saveState();
    const svgDataUrl = createWatermarkSvg(watermarkText, watermarkColor, watermarkOpacity);
    const baseId = Date.now();

    const watermarkWidth = 750;
    const centerX = (800 - watermarkWidth) / 2;
    const centerY = 460;

    setImageEdits(prev => {
      const updated = { ...prev };

      if (watermarkApplyToAll) {
        for (let p = 1; p <= totalPages; p++) {
          const nonWatermarks = (updated[p] || []).filter(img => !img.isWatermark);
          const newWatermark = {
            id: baseId + p,
            src: svgDataUrl,
            x: centerX,
            y: centerY,
            width: watermarkWidth,
            rotation: -45,
            isWatermark: true,
          };
          updated[p] = [...nonWatermarks, newWatermark];
        }
      } else {
        const nonWatermarks = (updated[currentPage] || []).filter(img => !img.isWatermark);
        const newWatermark = {
          id: baseId,
          src: svgDataUrl,
          x: centerX,
          y: centerY,
          width: watermarkWidth,
          rotation: -45,
          isWatermark: true,
        };
        updated[currentPage] = [...nonWatermarks, newWatermark];
        setActiveEditId(newWatermark.id);
      }
      return updated;
    });

    setIsWatermarkModalOpen(false);
  };

  const handleRemoveWatermark = () => {
    saveState();
    setImageEdits(prev => {
      const updated = {};
      Object.keys(prev).forEach(page => {
        updated[page] = (prev[page] || []).filter(img => !img.isWatermark);
      });
      return updated;
    });
    setIsWatermarkModalOpen(false);
  };

  const redrawAllPaths = () => {
    if (!signatureCanvasRef.current) return;
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = signStrokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = signColor;

    pathsRef.current.forEach(path => {
      if (path.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      
      if (path.length === 1) {
        ctx.lineTo(path[0].x, path[0].y);
      } else if (path.length === 2) {
        ctx.lineTo(path[1].x, path[1].y);
      } else {
        for (let i = 1; i < path.length - 1; i++) {
          const xc = (path[i].x + path[i + 1].x) / 2;
          const yc = (path[i].y + path[i + 1].y) / 2;
          ctx.quadraticCurveTo(path[i].x, path[i].y, xc, yc);
        }
        const last = path.length - 1;
        ctx.quadraticCurveTo(path[last-1].x, path[last-1].y, path[last].x, path[last].y);
      }
      ctx.stroke();
    });
  };

  useEffect(() => {
    if (isSignModalOpen) {
      redrawAllPaths();
    }
  }, [isSignModalOpen, signColor, signStrokeWidth]);

  const getCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    if (e.cancelable) {
      e.preventDefault();
    }
    
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = signatureCanvasRef.current;
    const blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    if (canvas.toDataURL() === blank.toDataURL()) {
      showToast("Please draw a signature first.", "info");
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    setPendingSignature(dataUrl);
    setActiveTool('place-signature');
    setIsSignModalOpen(false);
  };

  useEffect(() => {
    if (!mainContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = Number(entry.target.getAttribute('data-page-number'));
            if (pageNum) {
              setCurrentPage(pageNum);
            }
          }
        });
      },
      {
        root: mainContainerRef.current,
        rootMargin: '-15% 0px -60% 0px', 
        threshold: 0
      }
    );

    const timeout = setTimeout(() => {
      Object.values(pageRefs.current).forEach((el) => {
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [totalPages, pdfFile, zoom]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [past, future, textEdits]);

  useEffect(() => {
    if (!dragInfo.id) return;

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const scale = zoom / 100;
      const dx = (clientX - dragInfo.startX) / scale;
      const dy = (clientY - dragInfo.startY) / scale;

      if (dragInfo.itemType === 'text') {
        setTextEdits((prev) => {
          const pageEdits = prev[dragInfo.page] || [];
          return {
            ...prev,
            [dragInfo.page]: pageEdits.map((edit) => {
              if (edit.id === dragInfo.id && dragInfo.type === 'move') {
                return { ...edit, x: dragInfo.initialX + dx, y: dragInfo.initialY + dy };
              }
              return edit;
            }),
          };
        });
      } else if (dragInfo.itemType === 'image') {
        setImageEdits((prev) => {
          const pageEdits = prev[dragInfo.page] || [];
          return {
            ...prev,
            [dragInfo.page]: pageEdits.map((edit) => {
              if (edit.id === dragInfo.id) {
                if (dragInfo.type === 'move') {
                  return { ...edit, x: dragInfo.initialX + dx, y: dragInfo.initialY + dy };
                }
                if (dragInfo.type === 'resize') {
                  return { ...edit, width: Math.max(20, dragInfo.initialWidth + dx) };
                }
                if (dragInfo.type === 'rotate') {
                  const currentAngle = Math.atan2(clientY - dragInfo.centerY, clientX - dragInfo.centerX) * (180 / Math.PI);
                  const startAngle = Math.atan2(dragInfo.startY - dragInfo.centerY, dragInfo.startX - dragInfo.centerX) * (180 / Math.PI);
                  const angleDiff = currentAngle - startAngle;
                  
                  return { ...edit, rotation: dragInfo.initialRotation + angleDiff };
                }
              }
              return edit;
            }),
          };
        });
      }
    };

    const handleEnd = () => {
      setDragInfo({ id: null, page: null, type: null, itemType: null, startX: 0, startY: 0, centerX: 0, centerY: 0, initialX: 0, initialY: 0, initialWidth: 0, initialRotation: 0 });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [dragInfo, zoom]);

  const handleDragStart = (e, page, id, type, itemType = 'text') => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    setActiveEditId(id);
    saveState();

    const edit = itemType === 'text' 
      ? textEdits[page]?.find((e) => e.id === id) 
      : imageEdits[page]?.find((e) => e.id === id);

    if (edit) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let centerX = 0;
      let centerY = 0;
      if (type === 'rotate') {
        const rect = e.target.closest('div').getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      }

      setDragInfo({
        id,
        page,
        type,
        itemType,
        startX: clientX,
        startY: clientY,
        centerX,
        centerY,
        initialX: edit.x,
        initialY: edit.y,
        initialWidth: edit.width || 200,
        initialRotation: edit.rotation || 0,
      });
    }
  };

  const tools = [
    { id: 'text', name: 'Add Text', icon: 'fa-solid fa-pen-to-square', color: 'text-blue-500', bg: 'bg-blue-50', disabled: !pdfFile },
    { id: 'image', name: 'Add Image', icon: 'fa-solid fa-image', color: 'text-purple-500', bg: 'bg-purple-50', action: () => imageInputRef.current.click(), disabled: !pdfFile },
    { id: 'sign', name: 'Sign PDF', icon: 'fa-solid fa-signature', color: 'text-amber-500', bg: 'bg-amber-50', action: () => setIsSignModalOpen(true), disabled: !pdfFile },
    { 
      id: 'watermark', 
      name: hasWatermark ? 'Edit Watermark' : 'Watermark', 
      icon: 'fa-solid fa-droplet', 
      color: 'text-teal-500', 
      bg: 'bg-teal-50', 
      action: () => setIsWatermarkModalOpen(true),
      disabled: !pdfFile
    },
    { id: 'undo', name: 'Undo', icon: 'fa-solid fa-rotate-left', color: 'text-slate-500', bg: 'bg-slate-100', action: handleUndo, disabled: !pdfFile || past.length === 0 },
    { id: 'redo', name: 'Redo', icon: 'fa-solid fa-rotate-right', color: 'text-slate-500', bg: 'bg-slate-100', action: handleRedo, disabled: !pdfFile || future.length === 0 }
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans relative">

      {/* --- DEBUG TOAST NOTIFICATION --- */}
      {toast.visible && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md px-4 py-3 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'
        }`}>
          <i className={`fa-solid shrink-0 ${toast.type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info'}`}></i>
          <span className="text-sm font-medium flex-1 break-words leading-tight">{toast.message}</span>
          <button onClick={() => setToast(prev => ({ ...prev, visible: false }))} className="shrink-0 p-1 hover:opacity-75">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-row justify-between items-center px-2 sm:px-6 py-3 sm:py-4 bg-white border-b border-slate-200 shadow-sm z-10 gap-1 sm:gap-4 w-full">
        <div className="text-lg sm:text-xl font-bold text-slate-900 flex items-center shrink-0 z-[70]">
          <Link to="/" className="flex items-center gap-2 outline-none rounded-lg group">
            <span className="hidden sm:inline-block font-black text-[1.25rem] text-slate-800 tracking-tight">
              Remo<span className="text-red-600">PDF</span>
            </span>
            <div className="sm:hidden flex items-center justify-center w-9 h-9 bg-slate-900 text-white rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.3)] hover:bg-slate-800 transition-colors">
              <i className="fa-solid fa-arrow-left text-xs"></i>
            </div>
          </Link>
        </div>

        <div className="flex flex-row items-center justify-end gap-1.5 sm:gap-3 flex-1">
          {pdfFile && (
            <div className="flex items-center bg-slate-100 rounded-lg sm:rounded-xl px-1.5 sm:px-3 py-1 sm:py-1.5 shrink-0">
              <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="px-1.5 sm:px-2 text-slate-500 hover:text-slate-800 transition-colors">
                <i className="fa-solid fa-minus text-[10px] sm:text-sm"></i>
              </button>
              <span className="text-[10px] sm:text-xs font-bold text-slate-700 w-8 sm:w-12 text-center">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="px-1.5 sm:px-2 text-slate-500 hover:text-slate-800 transition-colors">
                <i className="fa-solid fa-plus text-[10px] sm:text-sm"></i>
              </button>
            </div>
          )}
          
          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 rounded-xl font-bold text-sm bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm shrink-0"
            title="Upload New"
          >
            <i className="fa-solid fa-upload"></i>
            <span className="hidden sm:inline sm:ml-2">Upload New</span>
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={!pdfFile || isProcessing}
            className="relative overflow-hidden group px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-[11px] sm:text-sm bg-slate-900 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_10px_30px_-10px_rgba(15,23,42,0.4)] transition-all transform active:scale-95 whitespace-nowrap shrink-0"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
             <span className="relative z-10 flex items-center">
               {isProcessing ? (
                 <><i className="fa-solid fa-circle-notch fa-spin mr-1.5 sm:mr-2"></i> Processing...</>
               ) : (
                 <><i className="fa-solid fa-download mr-1.5 sm:mr-2"></i> Download PDF</>
               )}
             </span>
          </button>
        </div>
      </header>

      {/* Main Editor Workspace */}
      <div className="flex flex-1 overflow-hidden relative min-h-0">
        
        {/* Sidebar Tools */}
        <aside className="hidden md:flex flex-col w-20 bg-white border-r border-slate-200 py-6 items-center gap-6 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0">
          {tools.map((tool) => (
            <button
              key={tool.id}
              disabled={tool.disabled}
              onClick={() => {
                if (tool.action) {
                  tool.action();
                } else {
                  setActiveTool(activeTool === tool.id ? null : tool.id);
                  setActiveEditId(null);
                  setPendingSignature(null);
                  setPendingImage(null);
                }
              }}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                activeTool === tool.id && !tool.action
                  ? `${tool.bg} border-2 border-${tool.color.split('-')[1]}-200 shadow-inner scale-105` 
                  : 'bg-transparent border-2 border-transparent hover:bg-slate-50 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:cursor-not-allowed'
              }`}
            >
              <i className={`${tool.icon} text-lg mb-1 ${activeTool === tool.id && !tool.action ? tool.color : 'text-slate-400'}`}></i>
              <span className={`text-[9px] font-extrabold text-center leading-tight ${activeTool === tool.id && !tool.action ? tool.color : 'text-slate-400'}`}>
                {tool.name}
              </span>
            </button>
          ))}
        </aside>

      {/* Page Thumbnails Sidebar */}
{pdfFile && (
  <aside className="hidden lg:flex flex-col w-48 bg-slate-50 border-r border-slate-200 shrink-0 z-10 h-full">
    <div className="flex justify-between items-center p-4 border-b border-slate-200 shrink-0 bg-slate-50 z-20">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pages</span>
      <span className="text-xs font-semibold text-slate-400">{currentPage} / {totalPages}</span>
    </div>
    
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
      <Document file={pdfFile} className="flex flex-col gap-4">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = currentPage === pageNum;
          
          // Only render visible/nearby thumbnails to prevent Android GPU OOM
          const shouldRenderThumbnail = Math.abs(currentPage - pageNum) <= 3;

          return (
            <button
              key={pageNum}
              onClick={() => {
                setCurrentPage(pageNum);
                setActiveEditId(null);
                pageRefs.current[pageNum]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-50/60 border-2 border-blue-500 shadow-sm' 
                  : 'bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
              }`}
            >
              <div className="w-full h-36 bg-white border border-slate-200 rounded-md flex items-center justify-center relative shadow-xs overflow-hidden mb-2">
                {shouldRenderThumbnail ? (
                  <Page 
                    pageNumber={pageNum} 
                    width={140} 
                    devicePixelRatio={1}
                    renderTextLayer={false} 
                    renderAnnotationLayer={false}
                  />
                ) : (
                  <span className="text-xs text-slate-400 font-bold">Page {pageNum}</span>
                )}

                <span className={`absolute bottom-1 right-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {pageNum}
                </span>
              </div>
            </button>
          );
        })}
      </Document>
    </div>
  </aside>
)}

        {/* Mobile Toolbar (Bottom) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex justify-around z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
           {tools.map((tool) => (
             <button
               key={tool.id}
               disabled={tool.disabled}
               onClick={() => {
                 if (tool.action) {
                   tool.action();
                 } else {
                   setActiveTool(activeTool === tool.id ? null : tool.id);
                   setActiveEditId(null);
                   setPendingSignature(null);
                   setPendingImage(null);
                 }
               }}
               className={`flex flex-col items-center p-2 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed ${activeTool === tool.id && !tool.action ? tool.bg + ' ' + tool.color : 'text-slate-400'}`}
             >
               <i className={`${tool.icon} text-lg mb-1`}></i>
               <span className="text-[10px] font-bold text-center leading-tight">{tool.name}</span>
             </button>
           ))}
        </div>

        {/* Canvas Area */}
        <main 
          ref={mainContainerRef}
          className="flex-1 bg-slate-100/50 relative overflow-auto custom-scrollbar p-4 sm:p-8 pb-32 md:pb-8 flex justify-start sm:justify-center items-start min-h-0"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="application/pdf, application/octet-stream, .pdf" 
            className="hidden" 
          />

          <input 
            type="file" 
            ref={imageInputRef} 
            onChange={handleImageUpload} 
            accept="image/*, image/png, image/jpeg, image/jpg, image/webp" 
            className="hidden" 
          />

          {(activeTool === 'place-signature' || activeTool === 'place-image') && (pendingSignature || pendingImage) && (
            <div className="fixed inset-0 z-[40] bg-slate-900/40 backdrop-blur-[4px] transition-all duration-500 pointer-events-none animate-in fade-in"></div>
          )}

          {!pdfFile ? (
            <div 
              onClick={() => fileInputRef.current.click()}
              className="mt-10 max-w-lg w-full bg-white border-2 border-dashed border-slate-300 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group shadow-sm"
            >
              <div className="w-20 h-20 bg-slate-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center mb-6 transition-colors shadow-inner">
                <i className="fa-solid fa-file-pdf text-4xl text-slate-300 group-hover:text-blue-500 transition-colors"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Drag & Drop Document</h3>
              <p className="text-sm font-medium text-slate-500 px-4">
                Upload a PDF to start adding signatures, text, watermarks, and images directly in your browser.
              </p>
              <div className="mt-8 px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-900 text-white shadow-md group-hover:bg-blue-600 transition-colors">
                Browse Files
              </div>
            </div>
          ) : (
            <Document 
              file={pdfFile} 
              onLoadError={(err) => showToast(`PDF load error: ${err?.message || err}`)}
              onSourceError={(err) => showToast(`PDF source error: ${err?.message || err}`)}
              className={`flex flex-col items-start sm:items-center gap-8 pb-32 w-max sm:w-auto relative transition-all duration-500 ${(activeTool === 'place-signature' || activeTool === 'place-image') ? 'z-[50]' : 'z-0'}`} 
            >
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNum = index + 1;

                return (
                  <div 
                    key={pageNum}
                    ref={(el) => (pageRefs.current[pageNum] = el)}
                    data-page-number={pageNum}
                    className="bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200 transition-all duration-300 relative group scroll-mt-6"
                    onClick={() => {
                      setActiveEditId(null);
                      setCurrentPage(pageNum); 
                    }}
                  >
                    {Math.abs(currentPage - pageNum) <= RENDER_WINDOW ? (
                      <Page 
                        pageNumber={pageNum} 
                        width={pageWidth} 
                        scale={zoom / 100} 
                        devicePixelRatio={renderDpr}
                        renderAnnotationLayer={false}
                        renderTextLayer={true} 
                        className="shadow-sm"
                      />
                    ) : (
                      // Placeholder keeps scroll position stable without holding a canvas
                      <div
                        style={{
                          width: pageWidth * (zoom / 100),
                          height: pageWidth * 1.414 * (zoom / 100)
                        }}
                        className="flex items-center justify-center bg-white text-slate-300 text-sm font-semibold"
                      >
                        Page {pageNum}
                      </div>
                    )}

                    {/* Interactive overlay for adding text, image, or placing signature */}
                    {activeTool && (
                      <div 
                        className={`absolute inset-0 z-10 cursor-crosshair transition-all duration-300 ${
                          (activeTool === 'place-signature' || activeTool === 'place-image')
                            ? 'bg-blue-500/10 ring-4 ring-inset ring-blue-500/50 shadow-[inset_0_0_50px_rgba(59,130,246,0.3)]'
                            : 'bg-blue-500/5 mix-blend-multiply'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveEditId(null);
                          setCurrentPage(pageNum);
                          
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = (e.clientX - rect.left) / (zoom / 100);
                          const y = (e.clientY - rect.top) / (zoom / 100);

                          if (activeTool === 'text') {
                            saveState();
                            const newEdit = {
                              id: Date.now(),
                              text: '',
                              x: x,
                              y: y,
                              fontSize: 14,
                              fontFamily: 'sans-serif',
                              color: "#000000",
                              isBold: false,
                              isItalic: false,
                              isUnderline: false,
                              isStrikethrough: false,
                              isOverline: false,
                              hasShadow: false,
                              listType: 'none', 
                            };

                            setTextEdits(prev => ({
                              ...prev,
                              [pageNum]: [...(prev[pageNum] || []), newEdit]
                            }));
                            
                            setActiveEditId(newEdit.id);
                          } else if (activeTool === 'place-signature' && pendingSignature) {
                            saveState();
                            const newSignature = {
                              id: Date.now(),
                              src: pendingSignature,
                              x: x - 75,
                              y: y - 37.5,
                              width: 150,
                              rotation: 0,
                            };

                            setImageEdits(prev => ({
                              ...prev,
                              [pageNum]: [...(prev[pageNum] || []), newSignature]
                            }));
                            
                            setActiveTool(null);
                            setPendingSignature(null);
                            setActiveEditId(newSignature.id);
                          } else if (activeTool === 'place-image' && pendingImage) {
                            saveState();
                            const newImage = {
                              id: Date.now(),
                              src: pendingImage,
                              x: x - 100, // offset by half the default width
                              y: y - 50,  // general offset estimate
                              width: 200,
                              rotation: 0,
                            };

                            setImageEdits(prev => ({
                              ...prev,
                              [pageNum]: [...(prev[pageNum] || []), newImage]
                            }));
                            
                            setActiveTool(null);
                            setPendingImage(null);
                            setActiveEditId(newImage.id);
                          }
                        }}
                      ></div>
                    )}

                    {/* Render uploaded images and watermarks for THIS page */}
                    {(imageEdits[pageNum] || []).map((img) => {
                      const isActive = activeEditId === img.id;

                      return (
                        <div
                          key={img.id}
                          className="absolute z-40 flex flex-col"
                          style={{
                            left: img.x,
                            top: img.y,
                            transform: `scale(${zoom / 100}) translate(50%, 50%) rotate(${img.rotation || 0}deg) translate(-50%, -50%)`,
                            transformOrigin: 'top left',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveEditId(img.id);
                            setCurrentPage(pageNum);
                          }}
                        >
                          {isActive && (
                            <>
                              <button
                                onMouseDown={(e) => handleDragStart(e, pageNum, img.id, 'move', 'image')}
                                onTouchStart={(e) => handleDragStart(e, pageNum, img.id, 'move', 'image')}
                                className="absolute -top-4 -left-4 w-7 h-7 flex items-center justify-center bg-blue-600 shadow-md border-2 border-white hover:bg-slate-800 rounded-full cursor-move text-white z-30 touch-none"
                              >
                                <i className="fa-solid fa-arrows-up-down-left-right text-[12px]"></i>
                              </button>
                              
                              <button
                                onClick={(e) => { e.stopPropagation(); removeImage(pageNum, img.id); }}
                                className="absolute -top-4 -right-4 w-7 h-7 flex items-center justify-center bg-red-500 shadow-md border-2 border-white hover:bg-red-700 rounded-full cursor-pointer text-white z-30"
                              >
                                <i className="fa-solid fa-xmark text-[12px]"></i>
                              </button>

                              <button
                                onMouseDown={(e) => handleDragStart(e, pageNum, img.id, 'rotate', 'image')}
                                onTouchStart={(e) => handleDragStart(e, pageNum, img.id, 'rotate', 'image')}
                                className="absolute -top-4 left-1/2 -translate-x-1/2 w-7 h-7 flex items-center justify-center bg-amber-500 shadow-md border-2 border-white hover:bg-amber-700 rounded-full cursor-ew-resize text-white z-30 touch-none"
                              >
                                <i className="fa-solid fa-rotate-right text-[12px]"></i>
                              </button>

                              <button
                                onMouseDown={(e) => handleDragStart(e, pageNum, img.id, 'resize', 'image')}
                                onTouchStart={(e) => handleDragStart(e, pageNum, img.id, 'resize', 'image')}
                                className="absolute -bottom-4 -right-4 w-7 h-7 flex items-center justify-center bg-teal-500 shadow-md border-2 border-white hover:bg-teal-700 rounded-full cursor-nwse-resize text-white z-30 touch-none"
                              >
                                <i className="fa-solid fa-expand text-[12px]"></i>
                              </button>
                            </>
                          )}

                          <img 
                            src={img.src} 
                            alt="User edit item" 
                            style={{ width: `${img.width}px`, height: 'auto' }} 
                            className={`border-2 rounded-md pointer-events-none select-none transition-colors ${isActive ? 'border-blue-400' : 'border-transparent'}`}
                          />
                        </div>
                      );
                    })}

                    {/* Render dynamic text inputs for THIS page */}
                    {(textEdits[pageNum] || []).map((edit) => {
                      const isActive = activeEditId === edit.id;
                      const decorations = [
                        edit.isUnderline ? 'underline' : '',
                        edit.isStrikethrough ? 'line-through' : '',
                        edit.isOverline ? 'overline' : ''
                      ].filter(Boolean).join(' ') || 'none';

                      return (
                        <div
                          key={edit.id}
                          className={`absolute z-20 flex flex-col transition-all ${isActive ? 'ring-2 ring-blue-500 rounded bg-blue-50/10' : 'hover:ring-1 hover:ring-slate-300 rounded'}`}
                          style={{
                            left: edit.x,
                            top: edit.y,
                            transform: `scale(${zoom / 100})`,
                            transformOrigin: 'top left',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveEditId(edit.id);
                            setCurrentPage(pageNum);
                          }}
                        >
                          {isActive && (
                            <button
                              onMouseDown={(e) => handleDragStart(e, pageNum, edit.id, 'move', 'text')}
                              onTouchStart={(e) => handleDragStart(e, pageNum, edit.id, 'move', 'text')}
                              className="absolute -top-5 -left-5 w-7 h-7 flex items-center justify-center bg-blue-600 shadow-md border-2 border-white hover:bg-slate-800 rounded-full cursor-move text-white transition-colors z-30 touch-none"
                              title="Move text box"
                            >
                              <i className="fa-solid fa-arrows-up-down-left-right text-[12px]"></i>
                            </button>
                          )}
                          
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            ref={(el) => {
                              if (el) {
                                if (el.textContent !== edit.text) {
                                  el.textContent = edit.text;
                                }
                                if (isActive && document.activeElement !== el) {
                                  el.focus();
                                }
                              }
                            }}
                            onBlur={(e) => {
                              if (!e.currentTarget.textContent.trim()) {
                                saveState();
                                setTextEdits(prev => ({
                                  ...prev,
                                  [pageNum]: (prev[pageNum] || []).filter(item => item.id !== edit.id)
                                }));
                              }
                            }}
                            onInput={(e) => handleTextChange(pageNum, edit.id, e.currentTarget.textContent)}
                            onFocus={() => {
                              setActiveEditId(edit.id);
                              setCurrentPage(pageNum);
                            }}
                            className="bg-transparent border-none focus:outline-none px-1 py-0.5 rounded outline-none whitespace-pre-wrap"
                            style={{
                              color: edit.color,
                              fontSize: `${edit.fontSize}px`,
                              fontFamily: edit.fontFamily || 'sans-serif',
                              fontWeight: edit.isBold ? 'bold' : 'normal',
                              fontStyle: edit.isItalic ? 'italic' : 'normal',
                              textDecoration: decorations,
                              textShadow: edit.hasShadow ? '2px 2px 4px rgba(0,0,0,0.4)' : 'none',
                              display: edit.listType !== 'none' ? 'list-item' : 'inline-block',
                              listStyleType: edit.listType === 'bullet' ? 'disc' : edit.listType === 'number' ? 'decimal' : 'none',
                              listStylePosition: 'inside',
                              minWidth: '20px', 
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </Document>
          )}

          {/* Formatting Dock for active text item */}
          {activeEditId && textEdits[currentPage]?.find(e => e.id === activeEditId) && (() => {
            const edit = textEdits[currentPage].find(e => e.id === activeEditId);
            return (
              <div 
                className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-nowrap items-center justify-start bg-slate-900 text-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] px-3 py-2 sm:px-4 sm:py-2.5 gap-2 sm:gap-3 z-[60] text-sm w-[93%] max-w-[720px] overflow-x-auto select-none animate-in slide-in-from-bottom-8"
                onMouseDown={(e) => e.preventDefault()}
              >
                <select
                  value={edit.fontFamily || 'sans-serif'}
                  onChange={(e) => updateTextAttribute(currentPage, edit.id, 'fontFamily', e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs sm:text-sm rounded-lg px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="sans-serif">Sans-Serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                  <option value="cursive">Cursive</option>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                </select>

                <div className="hidden sm:block w-[1px] h-6 bg-slate-700 mx-1"></div>

                <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5">
                  <button 
                    onClick={() => updateTextAttribute(currentPage, edit.id, 'fontSize', Math.max(8, edit.fontSize - 1))}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  >-</button>
                  <span className="text-xs w-6 text-center font-bold">{edit.fontSize}</span>
                  <button 
                    onClick={() => updateTextAttribute(currentPage, edit.id, 'fontSize', Math.min(72, edit.fontSize + 1))}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  >+</button>
                </div>

                <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateTextAttribute(currentPage, edit.id, 'isBold', !edit.isBold)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${edit.isBold ? 'bg-blue-600 text-white shadow-inner' : 'hover:bg-slate-700 text-slate-300'}`}
                    title="Bold"
                  >B</button>
                  <button
                    onClick={() => updateTextAttribute(currentPage, edit.id, 'isItalic', !edit.isItalic)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center italic font-serif transition-all ${edit.isItalic ? 'bg-blue-600 text-white shadow-inner' : 'hover:bg-slate-700 text-slate-300'}`}
                    title="Italic"
                  >I</button>
                  <button
                    onClick={() => updateTextAttribute(currentPage, edit.id, 'isUnderline', !edit.isUnderline)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center underline transition-all ${edit.isUnderline ? 'bg-blue-600 text-white shadow-inner' : 'hover:bg-slate-700 text-slate-300'}`}
                    title="Underline"
                  >U</button>
                  <button
                    onClick={() => updateTextAttribute(currentPage, edit.id, 'isStrikethrough', !edit.isStrikethrough)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center line-through transition-all ${edit.isStrikethrough ? 'bg-blue-600 text-white shadow-inner' : 'hover:bg-slate-700 text-slate-300'}`}
                    title="Strikethrough"
                  >S</button>
                  <button
                    onClick={() => updateTextAttribute(currentPage, edit.id, 'isOverline', !edit.isOverline)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${edit.isOverline ? 'bg-blue-600 text-white shadow-inner' : 'hover:bg-slate-700 text-slate-300'}`}
                    title="Overline"
                  ><span className="overline text-xs font-bold">O</span></button>
                </div>

                <div className="hidden sm:block w-[1px] h-6 bg-slate-700 mx-1"></div>

                <div className="flex items-center gap-1">
                  <label className="relative w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-700 border border-transparent hover:border-slate-600 transition-colors" title="Text Color">
                    <i className="fa-solid fa-palette" style={{ color: edit.color }}></i>
                    <input 
                      type="color" 
                      value={edit.color || "#000000"} 
                      onChange={(e) => updateTextAttribute(currentPage, edit.id, 'color', e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                  
                  <button
                    onClick={() => updateTextAttribute(currentPage, edit.id, 'hasShadow', !edit.hasShadow)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${edit.hasShadow ? 'bg-blue-600 text-white shadow-inner' : 'hover:bg-slate-700 text-slate-300'}`}
                    title="Text Shadow"
                  >
                    <i className="fa-solid fa-clone text-xs"></i>
                  </button>
                </div>

                <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateTextAttribute(currentPage, edit.id, 'listType', edit.listType === 'bullet' ? 'none' : 'bullet')}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${edit.listType === 'bullet' ? 'bg-blue-600 text-white shadow-inner' : 'hover:bg-slate-700 text-slate-300'}`}
                    title="Bulleted List"
                  >
                    <i className="fa-solid fa-list-ul text-xs"></i>
                  </button>
                  <button
                    onClick={() => updateTextAttribute(currentPage, edit.id, 'listType', edit.listType === 'number' ? 'none' : 'number')}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${edit.listType === 'number' ? 'bg-blue-600 text-white shadow-inner' : 'hover:bg-slate-700 text-slate-300'}`}
                    title="Numbered List"
                  >
                    <i className="fa-solid fa-list-ol text-xs"></i>
                  </button>
                </div>

              </div>
            );
          })()}

        </main>
      </div>

      {/* Placement Notification Pill (Image & Signature) */}
      {(activeTool === 'place-signature' || activeTool === 'place-image') && (pendingSignature || pendingImage) && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500 pointer-events-none drop-shadow-2xl w-[92%] sm:w-auto max-w-sm sm:max-w-none">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] rounded-2xl sm:rounded-full p-2 sm:pl-2 sm:pr-6 sm:py-2 flex items-center gap-2 sm:gap-4 pointer-events-auto">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-full flex items-center justify-center relative shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-25 duration-1000"></div>
              <i className={`fa-solid ${activeTool === 'place-image' ? 'fa-image' : 'fa-signature'} text-blue-400 text-xs sm:text-sm`}></i>
            </div>
            
            <span className="text-slate-100 text-[12px] sm:text-[13px] font-medium tracking-wide flex-1 text-left leading-tight">
              <span className="inline sm:hidden">Tap document to place {activeTool === 'place-image' ? 'image' : 'signature'}</span>
              <span className="hidden sm:inline">Click anywhere on the document to place your {activeTool === 'place-image' ? 'image' : 'signature'}</span>
            </span>
            
            <div className="w-[1px] h-6 bg-slate-700/50 mx-0.5 sm:mx-1 shrink-0"></div>
            
            <button 
              onClick={() => {
                setActiveTool(null);
                setPendingSignature(null);
                setPendingImage(null);
              }}
              className="text-slate-400 hover:text-white transition-colors text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl sm:rounded-full hover:bg-slate-800 shrink-0"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Watermark Modal */}
      {isWatermarkModalOpen && (
        <div className="main-editmodal fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="editModal bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                <i className="fa-solid fa-droplet text-teal-500"></i> {hasWatermark ? 'Edit Watermark' : 'Custom Watermark'}
              </h3>
              <button 
                onClick={() => setIsWatermarkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 shrink-0"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Form Controls */}
            <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 bg-slate-50">
              {/* Custom Text Field */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL, DRAFT, SAMPLE"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white font-semibold text-slate-800 text-sm"
                />
              </div>

              {/* Color & Transparency controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Color
                  </label>
                  <div className="flex items-center gap-2 bg-white border border-slate-300 p-2 rounded-xl">
                    <input
                      type="color"
                      value={watermarkColor}
                      onChange={(e) => setWatermarkColor(e.target.value)}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent shrink-0"
                    />
                    <span className="text-xs font-mono font-bold text-slate-700 uppercase">{watermarkColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Opacity ({Math.round(watermarkOpacity * 100)}%)
                  </label>
                  <div className="flex items-center h-12 bg-white border border-slate-300 px-3 rounded-xl">
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Apply to All Pages Switch */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-bold text-slate-800 block">Apply to all pages</span>
                  <span className="text-[10px] sm:text-xs text-slate-500">Stamp across all {totalPages || 1} pages</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={watermarkApplyToAll}
                    onChange={(e) => setWatermarkApplyToAll(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {/* Live Preview Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-24 sm:h-28 select-none">
                <span className="text-[10px] font-bold text-slate-400 absolute top-2 left-3 uppercase">Live Preview</span>
                <div
                  className="font-black text-xl sm:text-2xl transform -rotate-12 transition-all duration-200 text-center tracking-wider max-w-full truncate px-2"
                  style={{
                    color: watermarkColor,
                    opacity: watermarkOpacity,
                  }}
                >
                  {watermarkText || 'WATERMARK'}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center bg-white gap-3">
              {hasWatermark ? (
                <button
                  onClick={handleRemoveWatermark}
                  className="w-full sm:w-auto justify-center px-4 py-2.5 sm:py-2 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-trash-can text-xs"></i> Remove
                </button>
              ) : (
                <div className="hidden sm:block"></div>
              )}
              
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsWatermarkModalOpen(false)}
                  className="w-full sm:w-auto justify-center px-5 py-2.5 sm:py-2 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyWatermark}
                  className="w-full sm:w-auto justify-center px-5 py-2.5 sm:py-2 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <i className="fa-solid fa-check text-xs"></i> {hasWatermark ? 'Update' : 'Apply'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Signature Modal */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">Draw Signature</h3>
              <button 
                onClick={() => setIsSignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 shrink-0"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
              <div className="flex gap-3 w-full justify-center sm:justify-start sm:w-auto">
                {[
                  { name: 'Black', hex: '#000000' },
                  { name: 'Blue', hex: '#2563eb' },
                  { name: 'Red', hex: '#dc2626' }
                ].map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSignColor(c.hex)}
                    className={`w-8 h-8 sm:w-7 sm:h-7 rounded-full shadow-sm border-2 transition-all ${signColor === c.hex ? 'border-slate-400 scale-110' : 'border-white hover:scale-105'}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thickness</span>
                <input 
                  type="range" min="1" max="10" 
                  value={signStrokeWidth} 
                  onChange={(e) => setSignStrokeWidth(Number(e.target.value))}
                  className="w-full sm:w-24 accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-slate-50 flex justify-center overflow-hidden">
              <canvas
                ref={signatureCanvasRef}
                width={350}
                height={150}
                className="bg-white border-2 border-dashed border-slate-300 rounded-xl cursor-crosshair shadow-sm touch-none max-w-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center bg-white gap-3">
              <button 
                onClick={clearSignature}
                className="w-full sm:w-auto text-sm font-semibold text-slate-500 hover:text-slate-700 px-4 py-2.5 sm:py-2 border border-slate-200 sm:border-none rounded-xl sm:rounded-none"
              >
                Clear
              </button>
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setIsSignModalOpen(false)}
                  className="w-full sm:w-auto justify-center px-5 py-2.5 sm:py-2 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveSignature}
                  className="w-full sm:w-auto justify-center px-5 py-2.5 sm:py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Insert
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}