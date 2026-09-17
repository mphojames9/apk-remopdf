import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mergePdfs, splitPdf, compressPdf, imagesToPdf, pdfToImages, getPdfPreviews, removePdfPages, compressImages, pdfToWord, pdfToExcel, wordToPdf, excelToPdf, addPasswordToPdf, verifyPdfPassword, removePdfPassword, changePdfPassword, pdfToPpt } from '../api/client';
import './Home.css';
import LiveQrScanner from '../components/LiveQrScanner'
import jsQR from 'jsqr'
import QrGeneratorModal from '../components/QrGeneratorModal'
import { extractZipArchive } from '../api/client';
import Navbar from '../components/Navbar';
import { toast } from '../components/PremiumToast';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.png';
import image7 from '../assets/image7.png';
import image8 from '../assets/image8.png';
import image9 from '../assets/image9.png';
import image10 from '../assets/image10.png';
import image11 from '../assets/image11.png';
import image12 from '../assets/image12.png';
import image13 from '../assets/image13.png';
import image14 from '../assets/image14.png';
import {
  Copy,
  Scissors,
  Minimize2,
  FileText,
  Image as ImageIcon,
  Lock,
  Unlock,
  RotateCw,
  Files,
  Search,
  Grid,
  User,
  Layout,
  QrCode,
  FileArchive
} from 'lucide-react';
import TemplateSlider from '../components/Resume/TemplateSlider';


export default function Home() {
  const navigate = useNavigate();
  
  // Premium Pricing States
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
const [isQrScannerModalOpen, setIsQrScannerModalOpen] = useState(false);
const [qrResult, setQrResult] = useState('');
const [isCameraStarting, setIsCameraStarting] = useState(true);
const [cameraError, setCameraError] = useState('');
const videoRef = useRef(null);
const canvasRef = useRef(null);
const streamRef = useRef(null);
const scanFrameRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [isChangeDragActive, setIsChangeDragActive] = useState(false);
  const [isPptDragActive, setIsPptDragActive] = useState(false);
  const [isUnlockDragActive, setIsUnlockDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Modal states
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [splitFile, setSplitFile] = useState(null);

  const [isCompressModalOpen, setIsCompressModalOpen] = useState(false);
  const [compressFile, setCompressFile] = useState(null);
  const [compressQuality, setCompressQuality] = useState(50); 
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isQrGeneratorModalOpen, setIsQrGeneratorModalOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const [isPdfToImgModalOpen, setIsPdfToImgModalOpen] = useState(false);
  const [pdfToImgFiles, setPdfToImgFiles] = useState([]);
  const [imageFormat, setImageFormat] = useState('png');

  const [isRemovePagesModalOpen, setIsRemovePagesModalOpen] = useState(false);
  const [removePagesFiles, setRemovePagesFiles] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [activeKeptPages, setActiveKeptPages] = useState([]); // Array of arrays containing kept index numbers
  const [downloadMode, setDownloadMode] = useState('single'); // 'single' | 'multiple'
  const [fullScreenPreviewUrl, setFullScreenPreviewUrl] = useState(null);
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);

  // Premium Image Compressor States
  const [isImgCompressModalOpen, setIsImgCompressModalOpen] = useState(false);
  const [imgCompressFiles, setImgCompressFiles] = useState([]);
  const [imgCompressQuality, setImgCompressQuality] = useState(60);

  // Word Converter States
  const [isPdfToWordModalOpen, setIsPdfToWordModalOpen] = useState(false);
  const [pdfToWordFiles, setPdfToWordFiles] = useState([]);

  // Excel Converter States
  const [isPdfToExcelModalOpen, setIsPdfToExcelModalOpen] = useState(false);
  const [pdfToExcelFiles, setPdfToExcelFiles] = useState([]);

  // Word to PDF Converter States
  const [isWordToPdfModalOpen, setIsWordToPdfModalOpen] = useState(false);
  const [wordToPdfFiles, setWordToPdfFiles] = useState([]);
  const [isWordToPdfDragActive, setIsWordToPdfDragActive] = useState(false);

  // Excel to PDF Converter States
  const [isExcelToPdfModalOpen, setIsExcelToPdfModalOpen] = useState(false);
  const [excelToPdfFiles, setExcelToPdfFiles] = useState([]);
  const [isExcelToPdfDragActive, setIsExcelToPdfDragActive] = useState(false);


  // Password Protection States
  const [isProtectModalOpen, setIsProtectModalOpen] = useState(false);
  const [protectFile, setProtectFile] = useState(null);
  const [pdfPassword, setPdfPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Unlock / Remove Password States
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockFile, setUnlockFile] = useState(null);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockPreviewUrl, setUnlockPreviewUrl] = useState(null);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isMergeDragActive, setIsMergeDragActive] = useState(false);
  const [isSplitDragActive, setIsSplitDragActive] = useState(false);
  const [isCompressDragActive, setIsCompressDragActive] = useState(false);
  // (You already have isPptDragActive)

  // Change Password States
  const [isChangePwdModalOpen, setIsChangePwdModalOpen] = useState(false);
  const [changeFile, setChangeFile] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changePreviewUrl, setChangePreviewUrl] = useState(null);
  const [isChangeError, setIsChangeError] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // PDF to PowerPoint States
  const [isPdfToPptModalOpen, setIsPdfToPptModalOpen] = useState(false);
  const [pdfToPptFiles, setPdfToPptFiles] = useState([]);
  const [pptProtectedError, setPptProtectedError] = useState(null); // Stores the encrypted filename
  const [isProtectDragActive, setIsProtectDragActive] = useState(false);
  const [isExcelDragActive, setIsExcelDragActive] = useState(false);
  const [isWordDragActive, setIsWordDragActive] = useState(false);
  const [isImgDragActive, setIsImgDragActive] = useState(false);
  const [isRemovePagesDragActive, setIsRemovePagesDragActive] = useState(false);
  const [isPdfToImgDragActive, setIsPdfToImgDragActive] = useState(false);
  const [isImageDragActive, setIsImageDragActive] = useState(false);

  // Extract ZIP / Archive States
const [zipFile, setZipFile] = useState(null);
const [zipPassword, setZipPassword] = useState('');
const [showZipPassword, setShowZipPassword] = useState(false);
const [extractMode, setExtractMode] = useState('all'); // 'all' | 'images'
const [isZipDragActive, setIsZipDragActive] = useState(false);

const [isSearchOpen, setIsSearchOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [activeNav, setActiveNav] = useState('home');
const [activeView, setActiveView] = useState('tools'); // 'tools' | 'resume'   ← ADD
const searchInputRef = useRef(null);


const goHome = () => { setActiveNav('home'); navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
const scrollToTools = () => {
  setActiveNav('tools');
  setActiveView('tools');
  document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
const goFiles = () => { setActiveNav('files'); navigate('/Workspace'); };
const goProfile = () => { setActiveNav('profile'); toast.success('Profile — coming soon ✨'); };

const toolsList = [
  { id: 'merge', title: 'Merge PDF', image: image1, action: () => setIsMergeModalOpen(true) },
  { id: 'split', title: 'Split PDF', image: image2, action: () => setIsSplitModalOpen(true) },
  { id: 'compress', title: 'Compress PDF', image: image3, action: () => setIsCompressModalOpen(true) },
  { id: 'image-to-pdf', title: 'Image to PDF', image: image4, action: () => setIsImageModalOpen(true) },
  { id: 'pdf-to-image', title: 'PDF to Image', image: image5, action: () => setIsPdfToImgModalOpen(true) },
  { id: 'page-manager', title: 'Page Manager', image: image6, action: () => setIsRemovePagesModalOpen(true) },
  { id: 'image-compressor', title: 'Image Compressor', image: image7, action: () => setIsImgCompressModalOpen(true) },
  { id: 'pdf-to-word', title: 'PDF to Word', image: image8, action: () => setIsPdfToWordModalOpen(true) },
  { id: 'pdf-to-excel', title: 'PDF to Excel', image: image9, action: () => setIsPdfToExcelModalOpen(true) },
  { id: 'word-to-pdf', title: 'Word to PDF', image: image8, action: () => setIsWordToPdfModalOpen(true) },
  { id: 'excel-to-pdf', title: 'Excel to PDF', image: image9, action: () => setIsExcelToPdfModalOpen(true) },
  { id: 'protect-pdf', title: 'Protect PDF', image: image10, action: () => setIsProtectModalOpen(true) },
  { id: 'unlock-pdf', title: 'Unlock PDF', image: image11, action: () => setIsUnlockModalOpen(true) },
  { id: 'change-password', title: 'Change Password', image: image12, action: () => setIsChangePwdModalOpen(true) },
  { id: 'pdf-to-ppt', title: 'PDF to PPTX', image: image13, action: () => setIsPdfToPptModalOpen(true) },
  { id: 'resume-builder', title: 'ResumeBuilder', image: image14, action: () => navigate('/ResumeBuilder') },
  
  // Reusing images 1-4 below since only 14 images were imported
  { id: 'qr-scanner', title: 'QR Scanner', image: image1, action: () => { setIsQrScannerModalOpen(true); setQrResult(''); } },
  { id: 'open-workspace', title: 'Open Workspace', image: image2, action: () => navigate('/Workspace') },
  { id: 'qr-generator', title: 'QR Generator', image: image3, action: () => setIsQrGeneratorModalOpen(true) },
  { id: 'extract-zip', title: 'Extract ZIP', image: image4, action: () => navigate('/ZipTool') }
];

const toolCategories = [
  {
    name: 'Organize & Protect',
    icon: 'fa-folder-tree',
    ids: ['merge', 'split', 'page-manager', 'protect-pdf', 'unlock-pdf', 'change-password'],
  },
  {
    name: 'Convert & Compress',
    icon: 'fa-arrows-rotate',
    ids: ['compress', 'image-to-pdf', 'pdf-to-image', 'image-compressor', 'pdf-to-word', 'pdf-to-excel', 'word-to-pdf', 'excel-to-pdf', 'pdf-to-ppt'],
  },
  {
    name: 'Scan & Share',
    icon: 'fa-qrcode',
    ids: ['qr-scanner', 'qr-generator', 'extract-zip', 'open-workspace'],
  },
];

const openResumeBuilder = (templateId = 'modern') =>
  navigate('/ResumeBuilder', { state: { template: templateId } });


useEffect(() => {
  if (isSearchOpen) {
    setTimeout(() => searchInputRef.current?.focus(), 100);
  } else {
    setSearchQuery('');
  }
}, [isSearchOpen]);

const filteredTools = toolsList.filter((t) =>
  t.title.toLowerCase().includes(searchQuery.toLowerCase())
);

// ZIP Extraction Handler
const handleExtractZip = async () => {
  if (!zipFile) return;
  setIsProcessing(true);
  setProgress(0);
  try {
    // Replace with your API endpoint (e.g., extractZipArchive(zipFile, zipPassword, extractMode, setProgress))
    await extractZipArchive(zipFile, zipPassword, extractMode, setProgress); 
    closeOverlay();
  } catch (error) {
    console.error("Extraction failed", error);
    toast.error("Failed to extract file. Verify the password or file integrity.");
  } finally {
    setIsProcessing(false);
    setProgress(0);
  }
};

  // Listen for tool clicks from the Navbar
  useEffect(() => {
    const handleOpenModal = (e) => {
      const toolId = e.detail;
      if (toolId === 'merge') setIsMergeModalOpen(true);
      else if (toolId === 'split') setIsSplitModalOpen(true);
      else if (toolId === 'compress') setIsCompressModalOpen(true);
      else if (toolId === 'pdfToWord') setIsPdfToWordModalOpen(true);
      else if (toolId === 'wordToPdf') setIsWordToPdfModalOpen(true);
      else if (toolId === 'excelToPdf') setIsExcelToPdfModalOpen(true);
      else if (toolId === 'protect') setIsProtectModalOpen(true);
      else if (toolId === 'unlock') setIsUnlockModalOpen(true);
      else if (toolId === 'changePwd') setIsChangePwdModalOpen(true);
      else if (toolId === 'pdfToExcel') setIsPdfToExcelModalOpen(true);
      else if (toolId === 'pdfToImg') setIsPdfToImgModalOpen(true);
      else if (toolId === 'imageToPdf') setIsImageModalOpen(true);
      else if (toolId === 'pdfToPpt') setIsPdfToPptModalOpen(true);
      else if (toolId === 'pageManager') setIsRemovePagesModalOpen(true);
      else if (toolId === 'imgCompress') setIsImgCompressModalOpen(true);
      else if (toolId === 'qrScanner') { setIsQrScannerModalOpen(true); setQrResult(''); }
      else if (toolId === 'qrGenerator') setIsQrGeneratorModalOpen(true);
      else if (toolId === 'pricing') setIsPricingModalOpen(true);
    };

    window.addEventListener('openToolModal', handleOpenModal);
    return () => window.removeEventListener('openToolModal', handleOpenModal);
  }, []);


// Stops the camera stream and any in-flight scan loop
const stopQrCamera = () => {
  if (scanFrameRef.current) {
    cancelAnimationFrame(scanFrameRef.current);
    scanFrameRef.current = null;
  }
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }
  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }
};

// Grabs the current video frame and checks it for a QR code, every animation frame
const scanQrFrame = () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
    scanFrameRef.current = requestAnimationFrame(scanQrFrame);
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert',
  });

  if (code && code.data) {
    setQrResult(code.data);
    toast.success("QR Code scanned successfully!");
    stopQrCamera();
    return;
  }

  scanFrameRef.current = requestAnimationFrame(scanQrFrame);
};

// Requests camera access, attaches the stream to the <video>, and starts the scan loop
const startQrCamera = async () => {
  setCameraError('');
  setIsCameraStarting(true);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false,
    });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    setIsCameraStarting(false);
    scanFrameRef.current = requestAnimationFrame(scanQrFrame);
  } catch (err) {
    console.error(err);
    setIsCameraStarting(false);
    setCameraError('Camera access denied or unavailable. Please allow camera permission and try again.');
  }
};

// Starts the camera whenever the modal is open and there's no result yet;
// stops it as soon as we get a result, or the modal closes, or on unmount.
useEffect(() => {
  if (isQrScannerModalOpen && !qrResult) {
    startQrCamera();
  } else {
    stopQrCamera();
  }
  return () => stopQrCamera();
}, [isQrScannerModalOpen, qrResult]);
  // Comprehensive list of document tools
const documentTools = [
    {
      name: "Resume Builder",
      action: () => navigate('/ResumeBuilder') // <-- Updated
    },
  {
    name: "Merge PDFs",
    action: () => setIsMergeModalOpen(true)
  },
  {
    name: "Split PDF",
    action: () => setIsSplitModalOpen(true)
  },
  {
    name: "Compress PDF",
    action: () => setIsCompressModalOpen(true)
  },
  {
    name: "PDF to Word",
    action: () => setIsPdfToWordModalOpen(true)
  },
  {
    name: "Word to PDF",
    action: () => setIsWordToPdfModalOpen(true)
  },
  {
    name: "Sign Document",
    action: () => setIsSignModalOpen(true) // Note: Need to define setIsSignModalOpen in state
  },
  {
    name: "Protect PDF",
    action: () => setIsProtectModalOpen(true)
  },
  {
    name: "Unlock PDF",
    action: () => setIsUnlockModalOpen(true)
  },
  {
    name: "Change Password",
    action: () => setIsChangePwdModalOpen(true)
  },
  {
    name: "PDF to Excel",
    action: () => setIsPdfToExcelModalOpen(true)
  },
  {
    name: "PDF to Image",
    action: () => setIsPdfToImgModalOpen(true)
  },
  {
    name: "Image to PDF",
    action: () => setIsImageModalOpen(true)
  },
  {
    name: "PDF to PowerPoint",
    action: () => setIsPdfToPptModalOpen(true)
  }
];
  
  const handleSplit = async () => {
    if (!splitFile) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await splitPdf(splitFile, setProgress); 
      closeOverlay();
    } catch (error) {
         const errorMessage = error?.response?.data?.detail || error?.detail || "";
      console.error("Split failed", error);
            toast.error("Invalid file or password protected. Please remove the password using our Unlock tool first.");

    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

const handleMerge = async () => {
  setIsProcessing(true);
  setProgress(0);
  
  try {
    await mergePdfs(selectedFiles, setProgress);
    closeOverlay();
    
  } catch (error) {
    // Safely extract the error detail string
    const errorMessage = error?.response?.data?.detail || error?.detail || "";

    // 1. Check for our custom encryption flag FIRST
    if (errorMessage.startsWith("ENCRYPTED:")) {
      const filename = errorMessage.split("ENCRYPTED:")[1];
      
      // Fire the toast, but DO NOT log anything to the console
      toast.error(`Action Blocked: Password Required`, {
        description: `"${filename}" is protected. Please remove the password using our Unlock tool first.`,
        duration: 5000,
        action: {
          label: "Go to Unlock Tool",
          onClick: () => {
            closeOverlay();
            setIsUnlockModalOpen(true);
          }
        }
      });
      
    } else {
      // 2. Only print to the console if it is a TRUE, unexpected error
      console.error("Merge failed:", error);
      toast.error("Invalid file(s) or password protected. Please remove the password using our Unlock tool first and try again.");
    }
    
  } finally {
    setIsProcessing(false);
    setProgress(0);
  }
};

  const handleCompress = async () => {
    if (!compressFile) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await compressPdf(compressFile, compressQuality, setProgress); 
      closeOverlay();
    } catch (error) {
      console.error("Compression failed", error);
      toast.error("Invalid file or password protected. Please remove the password using our Unlock tool first.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleImageToPdf = async () => {
    if (imageFiles.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await imagesToPdf(imageFiles, setProgress); 
      closeOverlay();
    } catch (error) {
      console.error("Image conversion failed", error);
      toast.error("Invalid file, please try again.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handlePdfToImagesSubmit = async () => {
    if (pdfToImgFiles.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await pdfToImages(pdfToImgFiles, imageFormat, setProgress);
      closeOverlay();
    } catch (error) {
      console.error("PDF to Image conversion failed", error);
      toast.error("Invalid file or password protected. Please remove the password using our Unlock tool first.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleRemovePagesFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setRemovePagesFiles(files);
    setIsLoadingPreviews(true);
    try {
      const data = await getPdfPreviews(files);
      setPreviewData(data);
      // Initialize state to keep all pages by default
      const initialKept = data.map(fileObj => fileObj.pages.map(p => p.page_index));
      setActiveKeptPages(initialKept);
    } catch (err) {
      console.error("Failed to generate document thumbnails", err);
      toast.error("Invalid file or password protected. Please remove the password using our Unlock tool first.");
    } finally {
      setIsLoadingPreviews(false);
    }
  };

  const handleCompressImages = async () => {
    if (imgCompressFiles.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await compressImages(imgCompressFiles, imgCompressQuality, setProgress);
      closeOverlay();
    } catch (error) {
      console.error("Image compression failed", error);
      toast.error("Invalid file, please try again.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handlePdfToWord = async () => {
    if (pdfToWordFiles.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await pdfToWord(pdfToWordFiles, setProgress);
      closeOverlay();
    } catch (error) {
      console.error("PDF to Word conversion failed", error);
      toast.error("Invalid file or password protected. Please remove the password using our Unlock tool first.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handlePdfToExcel = async () => {
    if (pdfToExcelFiles.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await pdfToExcel(pdfToExcelFiles, setProgress);
      closeOverlay();
    } catch (error) {
      console.error("PDF to Excel conversion failed", error);
      toast.error("Invalid file or password protected. Please remove the password using our Unlock tool first.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleWordToPdf = async () => {
    if (wordToPdfFiles.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await wordToPdf(wordToPdfFiles, setProgress);
      closeOverlay();
    } catch (error) {
      console.error("Word to PDF conversion failed", error);
      toast.error("Couldn't convert that file. Please check it's a valid .doc or .docx file.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleExcelToPdf = async () => {
    if (excelToPdfFiles.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await excelToPdf(excelToPdfFiles, setProgress);
      closeOverlay();
    } catch (error) {
      console.error("Excel to PDF conversion failed", error);
      toast.error("Couldn't convert that file. Please check it's a valid .xls or .xlsx file.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleProtectPdf = async () => {
    if (!protectFile || !pdfPassword) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await addPasswordToPdf(protectFile, pdfPassword, setProgress);
      closeOverlay();
    } catch (error) {
      console.error("PDF Encryption failed", error);
      toast.error("PDF Encryption failed", error);
   
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleVerifyPassword = async () => {
    if (!unlockFile || !unlockPassword) return;
    setIsProcessing(true);
    setIsPasswordError(false);
    try {
      const data = await verifyPdfPassword(unlockFile, unlockPassword);
      if (data.success) {
        setUnlockPreviewUrl(data.thumbnail);
      } else if (data.is_encrypted === false) {
        setUnlockPreviewUrl('NOT_ENCRYPTED'); // Handle files that didn't actually have a password
      }
    } catch (error) {
      console.error("Verification failed", error);
         toast.error("Verification failed", error);
            
      setIsPasswordError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePassword = async () => {
    if (!unlockFile || (!unlockPassword && unlockPreviewUrl !== 'NOT_ENCRYPTED')) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await removePdfPassword(unlockFile, unlockPassword || '', setProgress);
      closeOverlay();
    } catch (error) {
      console.error("Removal failed", error);
      toast.error("Removal failed", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleChangeVerify = async () => {
    if (!changeFile || !oldPassword) return;
    setIsProcessing(true);
    setIsChangeError(false);
    try {
      // Reusing the secure verification endpoint
      const data = await verifyPdfPassword(changeFile, oldPassword);
      if (data.success) {
        setChangePreviewUrl(data.thumbnail);
      } else if (data.is_encrypted === false) {
        setChangePreviewUrl('NOT_ENCRYPTED'); 
      }
    } catch (error) {
      console.error("Verification failed", error);
            toast.error("Verification failed", error);
      setIsChangeError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePasswordSubmit = async () => {
    if (!changeFile || !newPassword || (!oldPassword && changePreviewUrl !== 'NOT_ENCRYPTED')) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await changePdfPassword(changeFile, oldPassword || '', newPassword, setProgress);
      closeOverlay();
    } catch (error) {
      console.error("Password change failed", error);
      toast.error("Password change failed", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

const handlePdfToPpt = async () => {
    if (pdfToPptFiles.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setPptProtectedError(null);
    try {
      await pdfToPpt(pdfToPptFiles, setProgress);
      closeOverlay();
    } catch (error) {
      console.error("PDF to PPT conversion failed", error);
      toast.error("Invalid file or password protected. Please remove the password using our Unlock tool first.");
      // Catch the custom encryption flag we created in the backend
      if (error && error.detail && error.detail.startsWith("ENCRYPTED:")) {
        const filename = error.detail.split("ENCRYPTED:")[1];
        setPptProtectedError(filename);
      }
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const goToUnlockTool = () => {
    // Closes the PPT modal and opens the Remove Password modal instantly
    setIsPdfToPptModalOpen(false);
    setPdfToPptFiles([]);
    setPptProtectedError(null);
    setIsUnlockModalOpen(true); 
  };
  
  const togglePageSelection = (fileIndex, pageIndex) => {
    setActiveKeptPages(prev => {
      const updated = [...prev];
      const currentFilePages = updated[fileIndex];
      if (currentFilePages.includes(pageIndex)) {
        updated[fileIndex] = currentFilePages.filter(p => p !== pageIndex);
      } else {
        updated[fileIndex] = [...currentFilePages, pageIndex].sort((a, b) => a - b);
      }
      return updated;
    });
  };

  const handleRemovePagesSubmit = async () => {
    if (removePagesFiles.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      await removePdfPages(removePagesFiles, activeKeptPages, downloadMode, setProgress);
      closeOverlay();
    } catch (error) {
      console.error("Page removal action failed", error);
      toast.error("Invalid file or password protected. Please remove the password using our Unlock tool first.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };



  const closeOverlay = () => {

    if (isProcessing) return;

    setIsMergeModalOpen(false);
    setIsSplitModalOpen(false);
    setIsCompressModalOpen(false);
    setIsImageModalOpen(false);
    setIsPdfToImgModalOpen(false);
    setIsRemovePagesModalOpen(false); 
    setIsImgCompressModalOpen(false); 
    setIsPdfToWordModalOpen(false);
    setIsPdfToExcelModalOpen(false);
    setIsWordToPdfModalOpen(false);
    setIsExcelToPdfModalOpen(false);
    setIsProtectModalOpen(false);
    setProtectFile(null);
    setPdfPassword('');
    setShowPassword(false);
    setSelectedFiles([]); 
    setSplitFile(null);
    setImageFiles([]);
    setPdfToImgFiles([]);
    setCompressFile(null);
    setImgCompressFiles([]); 
    setImageFormat('png');
    setRemovePagesFiles([]); 
    setPreviewData([]); 
    setActiveKeptPages([]); 
    setPdfToWordFiles([]); 
    setPdfToExcelFiles([]);
    setWordToPdfFiles([]);
    setExcelToPdfFiles([]);
    setIsWordToPdfDragActive(false);
    setIsExcelToPdfDragActive(false);
    setDownloadMode('single'); 
    setFullScreenPreviewUrl(null); 
    setIsLoadingPreviews(false); 
    setImgCompressQuality(60); 
    setProgress(0);
    setIsUnlockModalOpen(false);
    setUnlockFile(null);
    setUnlockPassword('');
    setUnlockPreviewUrl(null);
    setIsPasswordError(false);
    setIsChangePwdModalOpen(false);
    setChangeFile(null);
    setOldPassword('');
    setNewPassword('');
    setChangePreviewUrl(null);
    setIsChangeError(false);
    setShowOldPassword(false);
    setShowNewPassword(false);
    setIsPdfToPptModalOpen(false);
    setPdfToPptFiles([]);
    setPptProtectedError(null);
    setIsPricingModalOpen(false);
    setIsQrScannerModalOpen(false)
    setIsQrGeneratorModalOpen(false);
setZipFile(null);
setZipPassword('');
setShowZipPassword(false);
setExtractMode('all');
setIsZipDragActive(false);
  };

  // 1. Combine all modal states to check if ANY overlay is active
  const isAnyModalOpen = isMergeModalOpen || isSplitModalOpen || isCompressModalOpen || 
    isImageModalOpen || isPdfToImgModalOpen || isRemovePagesModalOpen || 
    isImgCompressModalOpen || isPdfToWordModalOpen || isPdfToExcelModalOpen || 
    isWordToPdfModalOpen || isExcelToPdfModalOpen ||
    isProtectModalOpen || isUnlockModalOpen || isChangePwdModalOpen || 
    isPdfToPptModalOpen || isPricingModalOpen;

// Add this to store where the user was scrolled to
const scrollPositionRef = useRef(0);

// 2. Bulletproof lock for the body scroll
useEffect(() => {
  if (isAnyModalOpen) {
    // Capture current scroll position BEFORE locking
    scrollPositionRef.current = window.scrollY;

    // Pin the background in place (The iOS-proof fix)
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none'; 
  } else {
    // Remove the locks
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';

    // Scroll the user back to exactly where they were instantly
    window.scrollTo(0, scrollPositionRef.current);
  }

  // Cleanup function in case the component unmounts
  return () => { 
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  };
}, [isAnyModalOpen]);

  return (
    
    <div className="app-container" style={{ fontFamily: "'Outfit', sans-serif" }}>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

< Navbar />
<div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-slate-800 relative" style={{ fontFamily: "'Outfit', sans-serif" }}>


{/* --- VIEW TOGGLE --- */}
<div className="max-w-7xl mx-auto w-full px-5 pt-5 pb-7 mt-15">
  <div className="relative flex p-1.5 bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-[22px] border border-orange-500/40">

    {/* Sliding active pill - premium black gradient, orange border, no outset shadow */}
    <div
      className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-[16px] bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 border border-orange-500/70 transition-transform duration-300 ease-out ${
        activeView === 'resume' ? 'translate-x-full' : 'translate-x-0'
      }`}
    />

    <button
      onClick={() => setActiveView('tools')}
      className={`relative z-10 flex-1 h-11 rounded-[16px] text-[13px] font-bold flex items-center justify-center gap-2 transition-colors duration-200 ${
        activeView === 'tools' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
      }`}
    >
      <i className={`fa-solid fa-toolbox text-xs ${activeView === 'tools' ? 'text-orange-400' : ''}`}></i> PDF Tools
    </button>

    <button
      onClick={() => setActiveView('resume')}
      className={`relative z-10 flex-1 h-11 rounded-[16px] text-[13px] font-bold flex items-center justify-center gap-2 transition-colors duration-200 ${
        activeView === 'resume' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
      }`}
    >
      <i className={`fa-solid fa-file-lines text-xs ${activeView === 'resume' ? 'text-orange-400' : ''}`}></i> Resume Builder
    </button>
  </div>
</div>

{/* --- ALL TOOLS, GROUPED --- */}
<div id="tools-grid" className={`max-w-7xl mx-auto w-full px-5 ${activeView === 'tools' ? '' : 'hidden'}`}>
  {toolCategories.map((category) => {
    const items = toolsList.filter((tool) => category.ids.includes(tool.id));
    if (!items.length) return null;

    return (
      <div key={category.name} className="mb-11">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 border border-orange-500/30 flex items-center justify-center shrink-0 shadow-[inset_0_2px_3px_rgba(255,255,255,0.08),inset_0_-2px_4px_rgba(0,0,0,0.4)]">
            <i className={`fa-solid ${category.icon} text-orange-400 text-[14px]`}></i>
          </div>
          <h3 className="text-[17px] font-black text-slate-900 tracking-tight">{category.name}</h3>
          <span className="text-[11px] font-extrabold text-white bg-gradient-to-b from-neutral-700 to-neutral-900 px-3.5 py-1.5 rounded-full leading-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.55),inset_0_-1px_1px_rgba(255,255,255,0.08)] border border-black/30">
            {items.length}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent ml-1"></div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {items.map((tool) => (
            <button
              key={tool.id}
              onClick={tool.action}
              className="group relative bg-white p-4 rounded-[24px] border border-slate-200/80 hover:border-black transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-[0.97] flex flex-col items-center text-center cursor-pointer h-full overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              <span className="pointer-events-none absolute -top-10 -right-10 w-24 h-24 rounded-full bg-orange-500/0 group-hover:bg-orange-500/10 blur-2xl transition-colors duration-300"></span>

              <div
                className={`relative w-16 h-16 ${tool.bgColor || 'bg-gradient-to-b from-slate-50 to-slate-100'} border border-slate-200/70 group-hover:border-orange-300 rounded-[18px] flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-3 group-active:scale-90`}
              >
                <img src={tool.image} alt="" className="w-9 h-9 object-contain" />
              </div>

              <h3 className="relative font-bold text-[13px] text-slate-900 leading-tight">
                {tool.title}
              </h3>
            </button>
          ))}
        </div>
      </div>
    );
  })}
</div>

{/* --- RESUME BUILDER HOME --- */}
<div id="resume-home" className={`max-w-7xl mx-auto w-full px-5 ${activeView === 'resume' ? '' : 'hidden'}`}>

  {/* Hero */}
  <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border border-orange-500/25 p-5 sm:p-8 mb-10">
    <span className="pointer-events-none absolute -top-16 -right-10 w-52 h-52 rounded-full bg-orange-500/10 blur-3xl"></span>
    <span className="pointer-events-none absolute -bottom-20 -left-12 w-52 h-52 rounded-full bg-red-600/10 blur-3xl"></span>

    <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
      <div className="flex-1 min-w-0">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-400 bg-white/5 border border-orange-500/30 px-2.5 py-1 rounded-[5px] mb-3">
          <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i> Instant AI resume builder, no account needed.
        </span>
        <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-black text-white leading-tight tracking-tight mb-2">
          Build a resume that gets you hired.
        </h2>
        <p className="text-[13px] text-neutral-300 leading-relaxed max-w-md mb-5">
          100% free and completely private. Easily build and save multiple tailored resume versions directly to your device with full data confidentiality.
        </p>

        <div className="flex flex-wrap gap-2.5">
<button
  onClick={() => navigate('/ResumeBuilder')}
  className="group relative w-full sm:w-auto h-[52px] px-7 rounded-2xl bg-gradient-to-b from-orange-500 to-orange-600 border border-orange-400/30 text-white text-[13px] font-bold tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:from-orange-500 hover:to-orange-500 active:translate-y-0 active:scale-[0.97] flex items-center justify-center gap-2.5 overflow-hidden shadow-[0_8px_20px_-6px_rgba(234,88,12,0.5)]"
>
  {/* Diagonal shimmer sweep on hover */}
  <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] -translate-x-[200%] group-hover:translate-x-[500%] transition-transform duration-[1100ms] ease-out"></span>

  {/* Icon in its own chip */}
  <span className="relative w-6 h-6 rounded-full bg-black/25 border border-white/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-90">
    <i className="fa-solid fa-plus text-[10px]"></i>
  </span>

  <span className="relative">Create new resume</span>
</button>
        </div>
      </div>

      <div className="hidden sm:block w-28 md:w-36 shrink-0">
        <img src={image14} alt="" className="w-full h-auto object-contain" />
      </div>
    </div>
  </div>

<TemplateSlider/>
</div>



{/* --- BOTTOM NAVIGATION FOOTER --- */}
<div className="fixed bottom-0 left-0 right-0 z-50">
  {/* Hairline top border for separation without a heavy shadow */}
  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

  <div className="bg-white/90 backdrop-blur-xl rounded-t-[26px] border-t border-slate-200/70 px-5 py-1.5">
    <div className="flex items-center justify-between max-w-md mx-auto relative h-[50px]">

      {/* Trust badges — left */}
      <div className="flex-1 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-shield-halved text-[11px] text-emerald-600"></i>
          <span className="text-[10px] font-bold text-slate-600 leading-none tracking-tight">100% Private</span>
        </div>
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-user-slash text-[11px] text-emerald-600"></i>
          <span className="text-[10px] font-bold text-slate-600 leading-none tracking-tight">No Account</span>
        </div>
      </div>

      {/* Floating Action Button — Search Tools */}
      <div className="relative -top-5 flex justify-center items-center w-14 shrink-0">
        <button
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search tools"
          className="relative w-[52px] h-[52px] rounded-full flex items-center justify-center text-white bg-gradient-to-b from-orange-500 to-red-600 border-[3px] border-white active:scale-95 transition-transform overflow-hidden"
        >
          <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.6 0 7.5 7.5 0 0010.6 0z" />
          </svg>
        </button>
      </div>

      {/* Trust badges — right */}
      <div className="flex-1 flex items-center justify-end gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-600 leading-none tracking-tight">Free Forever</span>
          <i className="fa-solid fa-tag text-[11px] text-orange-500"></i>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-600 leading-none tracking-tight">On-Device</span>
          <i className="fa-solid fa-mobile-screen text-[11px] text-orange-500"></i>
        </div>
      </div>

    </div>
  </div>
</div>

</div>

{/* --- MERGE MODAL --- */}
{isMergeModalOpen && (
  <div
    className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
    onClick={closeOverlay}
  >
    <style dangerouslySetInnerHTML={{ __html: `
      body { overflow: hidden !important; }
      @keyframes barSweep {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(400%); }
      }
    `}} />

    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Subtle ambient glow */}
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-red-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      {/* Drag handle for mobile sheet feel */}
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Merge PDFs
        </h2>
        <button
          onClick={closeOverlay}
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200"
        >
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        {/* --- DROPZONE --- */}
        <div
          className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isMergeDragActive
              ? 'border-red-500/70 bg-red-500/5'
              : 'border-white/10 hover:border-white/20 bg-white/[0.03]'
            }
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsMergeDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsMergeDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsMergeDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault(); e.stopPropagation(); setIsMergeDragActive(false);
            if (e.dataTransfer.files?.length) setSelectedFiles(Array.from(e.dataTransfer.files));
          }}
        >
          <input
            type="file"
            multiple
            accept=".pdf,application/pdf"
            id="pdf-merge-upload"
            className="hidden"
            onChange={(e) => { if (e.target.files?.length) setSelectedFiles(Array.from(e.target.files)); }}
            disabled={isProcessing}
          />
          <label htmlFor="pdf-merge-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
            {selectedFiles.length > 0 ? (
              <div className="w-full text-left">
                <p className="text-xs font-semibold text-red-400 mb-3">
                  {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {selectedFiles.map((f, i) => (
                    <div key={i} className="bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2.5 border border-white/5">
                      <i className="fa-solid fa-file-pdf text-red-400 text-sm flex-shrink-0"></i>
                      <span className="text-xs font-medium text-slate-300 truncate">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-red-400"></i>
                </div>
                <p className="text-slate-300 text-sm font-medium">Drop PDFs here or tap to browse</p>
                <p className="text-slate-500 text-xs mt-1">Select two or more files to combine</p>
              </div>
            )}

            <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
              ${selectedFiles.length > 0
                ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                : 'bg-red-600 text-white hover:bg-red-500'
              }
            `}>
              {selectedFiles.length > 0 ? 'Change files' : 'Browse files'}
            </div>
          </label>
        </div>

        {/* --- PROGRESS BAR --- */}
        {isProcessing ? (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-2">
                <i className="fa-solid fa-gear text-red-400 animate-spin"></i>
                Merging your files
              </span>
              <span className="font-semibold text-white tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]"
                style={{ animation: 'barSweep 1.1s linear infinite' }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={handleMerge}
            disabled={selectedFiles.length < 2}
            className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-red-500/40 hover:shadow-[0_0_0_1px_rgba(239,68,68,0.2),0_8px_24px_-8px_rgba(239,68,68,0.4)] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-wand-magic-sparkles text-xs text-red-400"></i>
            Merge &amp; Download
          </button>
        )}
      </div>
    </div>
  </div>
)}


{/* --- SPLIT MODAL (accent: emerald) --- */}
{isSplitModalOpen && (
  <div
    className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
    onClick={closeOverlay}
  >
    <style dangerouslySetInnerHTML={{ __html: `
      body { overflow: hidden !important; }
      @keyframes barSweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
    `}} />
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-emerald-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Split PDF</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div
          className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isSplitDragActive ? 'border-emerald-500/70 bg-emerald-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsSplitDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsSplitDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsSplitDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault(); e.stopPropagation(); setIsSplitDragActive(false);
            if (e.dataTransfer.files?.length) setSplitFile(e.dataTransfer.files[0]);
          }}
        >
          <input type="file" accept=".pdf" id="pdf-split-upload" className="hidden" onChange={(e) => { if (e.target.files?.length) setSplitFile(e.target.files[0]); }} disabled={isProcessing} />
          <label htmlFor="pdf-split-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
            {splitFile ? (
              <div className="w-full text-left">
                <p className="text-xs font-semibold text-emerald-400 mb-3">Selected file</p>
                <div className="bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2.5 border border-white/5">
                  <i className="fa-solid fa-file-pdf text-emerald-400 text-sm flex-shrink-0"></i>
                  <span className="text-xs font-medium text-slate-300 truncate">{splitFile.name}</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-emerald-400"></i>
                </div>
                <p className="text-slate-300 text-sm font-medium">Drop a PDF here or tap to browse</p>
                <p className="text-slate-500 text-xs mt-1">Split it into single-page files</p>
              </div>
            )}
            <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
              ${splitFile ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-emerald-600 text-white hover:bg-emerald-500'}
            `}>
              {splitFile ? 'Change file' : 'Browse file'}
            </div>
          </label>
        </div>

        {isProcessing ? (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-2">
                <i className="fa-solid fa-gear text-emerald-400 animate-spin"></i> Slicing pages
              </span>
              <span className="font-semibold text-white tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
            </div>
          </div>
        ) : (
          <button onClick={handleSplit} disabled={!splitFile} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-emerald-500/40 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_8px_24px_-8px_rgba(16,185,129,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
            <i className="fa-solid fa-scissors text-xs text-emerald-400"></i> Split &amp; Download ZIP
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- COMPRESS MODAL (accent: blue) --- */}
{isCompressModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Compress PDF</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div
          className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isCompressDragActive ? 'border-blue-500/70 bg-blue-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsCompressDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsCompressDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsCompressDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault(); e.stopPropagation(); setIsCompressDragActive(false);
            if (e.dataTransfer.files?.length) setCompressFile(e.dataTransfer.files[0]);
          }}
        >
          <input type="file" accept=".pdf" id="pdf-compress-upload" className="hidden" onChange={(e) => { if (e.target.files?.length) setCompressFile(e.target.files[0]); }} disabled={isProcessing} />
          <label htmlFor="pdf-compress-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
            {compressFile ? (
              <div className="w-full text-left">
                <p className="text-xs font-semibold text-blue-400 mb-3">Selected file</p>
                <div className="bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2.5 border border-white/5">
                  <i className="fa-solid fa-file-pdf text-blue-400 text-sm flex-shrink-0"></i>
                  <span className="text-xs font-medium text-slate-300 truncate">{compressFile.name}</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-compress text-xl text-blue-400"></i>
                </div>
                <p className="text-slate-300 text-sm font-medium">Drop a heavy PDF here or tap to browse</p>
                <p className="text-slate-500 text-xs mt-1">We'll shrink the file size for you</p>
              </div>
            )}
            <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
              ${compressFile ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-blue-600 text-white hover:bg-blue-500'}
            `}>
              {compressFile ? 'Change file' : 'Browse file'}
            </div>
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-semibold text-slate-300">Compression ratio</label>
            <span className="text-xs font-bold text-white bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg">{compressQuality}%</span>
          </div>
          <input type="range" min="1" max="100" value={compressQuality} onChange={(e) => setCompressQuality(e.target.value)} disabled={isProcessing}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10" style={{ accentColor: '#3b82f6' }} />
        </div>

        {isProcessing ? (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-bolt text-blue-400 animate-pulse"></i> Optimizing size</span>
              <span className="font-semibold text-white tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
            </div>
          </div>
        ) : (
          <button onClick={handleCompress} disabled={!compressFile} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-blue-500/40 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_8px_24px_-8px_rgba(59,130,246,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
            <i className="fa-solid fa-minimize text-xs text-blue-400"></i> Compress &amp; Download
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- IMAGE TO PDF MODAL (accent: purple) --- */}
{isImageModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-purple-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Image to PDF</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div
          className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isImageDragActive ? 'border-purple-500/70 bg-purple-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsImageDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsImageDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsImageDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault(); e.stopPropagation(); setIsImageDragActive(false);
            if (e.dataTransfer.files?.length) setImageFiles(Array.from(e.dataTransfer.files));
          }}
        >
          <input type="file" accept="image/*" id="image-to-pdf-upload" className="hidden" onChange={(e) => { if (e.target.files?.length) setImageFiles(Array.from(e.target.files)); }} disabled={isProcessing} />
          <label htmlFor="image-to-pdf-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
            {imageFiles.length > 0 ? (
              <div className="w-full text-left">
                <p className="text-xs font-semibold text-purple-400 mb-3">{imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} selected</p>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {imageFiles.map((f, i) => (
                    <div key={i} className="bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2.5 border border-white/5">
                      <i className="fa-solid fa-image text-purple-400 text-sm flex-shrink-0"></i>
                      <span className="text-xs font-medium text-slate-300 truncate">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-purple-400"></i>
                </div>
                <p className="text-slate-300 text-sm font-medium">Drop images here or tap to browse</p>
                <p className="text-slate-500 text-xs mt-1">Convert JPG, PNG, or WEBP into a PDF</p>
              </div>
            )}
            <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
              ${imageFiles.length > 0 ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-purple-600 text-white hover:bg-purple-500'}
            `}>
              {imageFiles.length > 0 ? 'Change images' : 'Browse images'}
            </div>
          </label>
        </div>

        {isProcessing ? (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-layer-group text-purple-400 animate-pulse"></i> Converting to PDF</span>
              <span className="font-semibold text-white tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
            </div>
          </div>
        ) : (
          <button onClick={handleImageToPdf} disabled={imageFiles.length === 0} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-purple-500/40 hover:shadow-[0_0_0_1px_rgba(168,85,247,0.2),0_8px_24px_-8px_rgba(168,85,247,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
            <i className="fa-solid fa-file-pdf text-xs text-purple-400"></i> Convert to PDF &amp; Download
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- PDF TO IMAGE MODAL (accent: blue) --- */}
{isPdfToImgModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">PDF to Image</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div
          className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isPdfToImgDragActive ? 'border-blue-500/70 bg-blue-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsPdfToImgDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsPdfToImgDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsPdfToImgDragActive(false); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsPdfToImgDragActive(false); if (e.dataTransfer.files) setPdfToImgFiles(Array.from(e.dataTransfer.files)); }}
        >
          <input type="file" accept=".pdf" id="pdf-to-img-upload" className="hidden" onChange={(e) => { if (e.target.files) setPdfToImgFiles(Array.from(e.target.files)); }} disabled={isProcessing} />
          <label htmlFor="pdf-to-img-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
            {pdfToImgFiles.length > 0 ? (
              <div className="w-full text-left">
                <p className="text-xs font-semibold text-blue-400 mb-3">Selected file{pdfToImgFiles.length > 1 ? 's' : ''}</p>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {pdfToImgFiles.map((f, i) => (
                    <div key={i} className="bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2.5 border border-white/5">
                      <i className="fa-solid fa-file-pdf text-blue-400 text-sm flex-shrink-0"></i>
                      <span className="text-xs font-medium text-slate-300 truncate">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-blue-400"></i>
                </div>
                <p className="text-slate-300 text-sm font-medium">Drop a PDF here or tap to browse</p>
                <p className="text-slate-500 text-xs mt-1">Convert its pages into image files</p>
              </div>
            )}
            <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
              ${pdfToImgFiles.length > 0 ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-blue-600 text-white hover:bg-blue-500'}
            `}>
              {pdfToImgFiles.length > 0 ? 'Change file' : 'Browse file'}
            </div>
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300">Output format</label>
          <select value={imageFormat} onChange={(e) => setImageFormat(e.target.value)} disabled={isProcessing}
            className="w-full h-11 rounded-xl px-4 bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-blue-500/50 cursor-pointer">
            <option className="bg-slate-900" value="png">PNG</option>
            <option className="bg-slate-900" value="jpeg">JPG</option>
          </select>
        </div>

        {isProcessing ? (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-circle-notch fa-spin text-blue-400"></i> Converting to image</span>
              <span className="font-semibold text-white tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
            </div>
          </div>
        ) : (
          <button onClick={handlePdfToImagesSubmit} disabled={pdfToImgFiles.length === 0} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-blue-500/40 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_8px_24px_-8px_rgba(59,130,246,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
            <i className="fa-solid fa-bolt text-xs text-blue-400"></i> Convert to Image &amp; Download
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- PAGE MANAGER / REMOVE PAGES MODAL (accent: amber) --- */}
{isRemovePagesModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full sm:max-w-5xl h-[100dvh] sm:h-[90vh] bg-slate-900 rounded-none sm:rounded-[1.75rem] p-5 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden flex flex-col transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-600 rounded-full blur-[110px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-4 shrink-0"></div>

      <div className="relative z-10 flex justify-between items-center mb-5 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Page Manager</h2>
        </div>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-6 relative z-10">
        <div
          className={`relative rounded-2xl border transition-all duration-300 p-7 sm:p-10 text-center
            ${(isProcessing || isLoadingPreviews) ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isRemovePagesDragActive ? 'border-amber-500/70 bg-amber-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsRemovePagesDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsRemovePagesDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsRemovePagesDragActive(false); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsRemovePagesDragActive(false); if (e.dataTransfer.files?.length) handleRemovePagesFileChange({ target: { files: e.dataTransfer.files } }); }}
        >
          <input type="file" accept=".pdf" id="remove-pages-upload" className="hidden" onChange={handleRemovePagesFileChange} disabled={isProcessing || isLoadingPreviews} />
          <label htmlFor="remove-pages-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
            <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <i className="fa-solid fa-file-pdf text-xl text-amber-400"></i>
            </div>
            <p className="text-slate-300 text-sm font-medium">Extract, delete, or reorder specific pages visually</p>
            <div className="mt-5 px-5 py-2 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-colors duration-200">
              Browse file
            </div>
          </label>
        </div>

        {isLoadingPreviews && (
          <div className="py-14 flex flex-col items-center justify-center gap-3">
            <i className="fa-solid fa-circle-notch fa-spin text-2xl text-amber-400"></i>
            <p className="text-sm font-semibold text-slate-200">Rendering page thumbnails…</p>
          </div>
        )}

        {previewData.length > 0 && !isLoadingPreviews && (
          <div className="space-y-5 animate-in fade-in duration-500">
            {previewData.map((fileObj, fileIndex) => (
              <div key={fileIndex} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-6">
                <h4 className="font-semibold text-slate-100 text-sm mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-amber-400 flex items-center justify-center">
                    <i className="fa-regular fa-file-pdf text-xs"></i>
                  </span>
                  {fileObj.filename}
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {fileObj.pages.map((page) => {
                    const isKept = activeKeptPages[fileIndex]?.includes(page.page_index);
                    return (
                      <div key={page.page_index} className={`group relative rounded-xl overflow-hidden p-1.5 border transition-all duration-200 ${isKept ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/5 opacity-50 grayscale'}`}>
                        <div className="aspect-[3/4] bg-slate-800 overflow-hidden relative rounded-lg">
                          <img src={page.thumbnail} alt={`Page ${page.page_index + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-slate-950/40 transition-opacity flex items-center justify-center gap-2">
                            <button onClick={() => setFullScreenPreviewUrl(page.thumbnail)} className="w-8 h-8 bg-white/90 text-slate-800 rounded-full flex items-center justify-center hover:scale-110 transition-all">
                              <i className="fa-solid fa-expand text-[11px]"></i>
                            </button>
                            <button onClick={() => togglePageSelection(fileIndex, page.page_index)} className={`w-8 h-8 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all ${isKept ? 'bg-red-500' : 'bg-blue-500'}`}>
                              <i className={`fa-solid ${isKept ? 'fa-trash-can' : 'fa-arrow-rotate-left'} text-[11px]`}></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2 px-0.5">
                          <p className="text-[9px] font-semibold text-slate-400">Page {page.page_index + 1}</p>
                          <div className={`w-1.5 h-1.5 rounded-full ${isKept ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <p className="font-semibold text-slate-100 text-sm flex items-center gap-2"><i className="fa-solid fa-layer-group text-amber-400"></i> Output format</p>
                <p className="text-xs text-slate-500 mt-0.5">Choose how the result is packaged</p>
              </div>
              <div className="flex bg-white/5 p-1 rounded-xl w-full sm:w-auto border border-white/10">
                {['single', 'multiple'].map((mode) => (
                  <button key={mode} onClick={() => setDownloadMode(mode)}
                    className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${downloadMode === mode ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                    {mode === 'single' ? 'Single PDF' : 'ZIP archive'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 pt-4 border-t border-white/10 mt-3 relative z-10">
        {isProcessing ? (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-circle-notch fa-spin text-amber-400"></i> Restructuring document</span>
              <span className="font-semibold text-white tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
            </div>
          </div>
        ) : (
          <button onClick={handleRemovePagesSubmit} disabled={previewData.length === 0 || activeKeptPages.every(arr => arr.length === 0)} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-amber-500/40 hover:shadow-[0_0_0_1px_rgba(245,158,11,0.2),0_8px_24px_-8px_rgba(245,158,11,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
            Apply Changes <i className="fa-solid fa-arrow-right text-xs text-amber-400"></i>
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- IMAGE COMPRESSOR MODAL (accent: amber) --- */}
{isImgCompressModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-amber-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Compress Images</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div
          className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isImgDragActive ? 'border-amber-500/70 bg-amber-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsImgDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsImgDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsImgDragActive(false); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsImgDragActive(false); if (e.dataTransfer.files?.length) setImgCompressFiles(Array.from(e.dataTransfer.files)); }}
        >
          <input type="file" accept="image/*" id="img-compress-upload" className="hidden" onChange={(e) => { if (e.target.files?.length) setImgCompressFiles(Array.from(e.target.files)); }} disabled={isProcessing} />
          <label htmlFor="img-compress-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
            {imgCompressFiles.length > 0 ? (
              <div className="w-full text-left">
                <p className="text-xs font-semibold text-amber-400 mb-3">{imgCompressFiles.length} file{imgCompressFiles.length > 1 ? 's' : ''} selected</p>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {imgCompressFiles.map((f, i) => (
                    <div key={i} className="bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2.5 border border-white/5">
                      <i className="fa-solid fa-image text-amber-400 text-sm flex-shrink-0"></i>
                      <span className="text-xs font-medium text-slate-300 truncate">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-amber-400"></i>
                </div>
                <p className="text-slate-300 text-sm font-medium">Drop images here or tap to browse</p>
                <p className="text-slate-500 text-xs mt-1">JPG, PNG, or WEBP supported</p>
              </div>
            )}
            <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
              ${imgCompressFiles.length > 0 ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-amber-500 text-white hover:bg-amber-400'}
            `}>
              {imgCompressFiles.length > 0 ? 'Change files' : 'Browse files'}
            </div>
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-semibold text-slate-300">Compression quality</label>
            <span className="text-xs font-bold text-white bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg">{imgCompressQuality}%</span>
          </div>
          <input type="range" min="10" max="100" value={imgCompressQuality} onChange={(e) => setImgCompressQuality(parseInt(e.target.value))} disabled={isProcessing}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10" style={{ accentColor: '#f59e0b' }} />
        </div>

        {isProcessing ? (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-compress text-amber-400 animate-pulse"></i> Shrinking assets</span>
              <span className="font-semibold text-white tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
            </div>
          </div>
        ) : (
          <button onClick={handleCompressImages} disabled={imgCompressFiles.length === 0} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-amber-500/40 hover:shadow-[0_0_0_1px_rgba(245,158,11,0.2),0_8px_24px_-8px_rgba(245,158,11,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
            <i className="fa-solid fa-wand-magic-sparkles text-xs text-amber-400"></i> Optimize &amp; Download
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- PDF TO WORD MODAL (accent: indigo) --- */}
{isPdfToWordModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-indigo-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">PDF to Word</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div
          className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isWordDragActive ? 'border-indigo-500/70 bg-indigo-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsWordDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsWordDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsWordDragActive(false); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsWordDragActive(false); if (e.dataTransfer.files?.length) setPdfToWordFiles(Array.from(e.dataTransfer.files)); }}
        >
          <input type="file" accept=".pdf" id="pdf-to-word-upload" className="hidden" onChange={(e) => { if (e.target.files?.length) setPdfToWordFiles(Array.from(e.target.files)); }} disabled={isProcessing} />
          <label htmlFor="pdf-to-word-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
            {pdfToWordFiles.length > 0 ? (
              <div className="w-full text-left">
                <p className="text-xs font-semibold text-indigo-400 mb-3">Selected file{pdfToWordFiles.length > 1 ? 's' : ''}</p>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {pdfToWordFiles.map((f, i) => (
                    <div key={i} className="bg-white/5 px-3 py-2 rounded-lg flex items-center justify-between border border-white/5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <i className="fa-solid fa-file-pdf text-indigo-400 text-sm flex-shrink-0"></i>
                        <span className="text-xs font-medium text-slate-300 truncate">{f.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 flex-shrink-0">{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-indigo-400"></i>
                </div>
                <p className="text-slate-300 text-sm font-medium">Drop a PDF here or tap to browse</p>
                <p className="text-slate-500 text-xs mt-1">Get an editable Word document</p>
              </div>
            )}
            <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
              ${pdfToWordFiles.length > 0 ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-indigo-600 text-white hover:bg-indigo-500'}
            `}>
              {pdfToWordFiles.length > 0 ? 'Change file' : 'Browse file'}
            </div>
          </label>
        </div>

        {isProcessing ? (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-gears text-indigo-400 animate-spin"></i> Reconstructing document</span>
              <span className="font-semibold text-white tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 to-blue-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
            </div>
            <p className="text-[10px] text-slate-500">Assembling editable layouts and tables…</p>
          </div>
        ) : (
          <button onClick={handlePdfToWord} disabled={pdfToWordFiles.length === 0} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-indigo-500/40 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.2),0_8px_24px_-8px_rgba(99,102,241,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
            <i className="fa-solid fa-cube text-xs text-indigo-400"></i> Convert &amp; Download
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- PDF TO EXCEL MODAL (accent: teal) --- */}
{isPdfToExcelModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-teal-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">PDF to Excel</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div
          className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isExcelDragActive ? 'border-teal-500/70 bg-teal-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsExcelDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsExcelDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsExcelDragActive(false); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsExcelDragActive(false); if (e.dataTransfer.files) setPdfToExcelFiles(Array.from(e.dataTransfer.files)); }}
        >
          <input type="file" accept=".pdf" id="pdf-to-excel-upload" className="hidden" onChange={(e) => { if (e.target.files) setPdfToExcelFiles(Array.from(e.target.files)); }} disabled={isProcessing} />
          <label htmlFor="pdf-to-excel-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
            {pdfToExcelFiles.length > 0 ? (
              <div className="w-full text-left">
                <p className="text-xs font-semibold text-teal-400 mb-3">Selected file{pdfToExcelFiles.length > 1 ? 's' : ''}</p>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {pdfToExcelFiles.map((f, i) => (
                    <div key={i} className="bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2.5 border border-white/5">
                      <i className="fa-solid fa-file-pdf text-teal-400 text-sm flex-shrink-0"></i>
                      <span className="text-xs font-medium text-slate-300 truncate">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-teal-400"></i>
                </div>
                <p className="text-slate-300 text-sm font-medium">Drop a PDF here or tap to browse</p>
                <p className="text-slate-500 text-xs mt-1">Tables and lists become an Excel file</p>
              </div>
            )}
            <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
              ${pdfToExcelFiles.length > 0 ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-teal-600 text-white hover:bg-teal-500'}
            `}>
              {pdfToExcelFiles.length > 0 ? 'Change file' : 'Browse file'}
            </div>
          </label>
        </div>

        {isProcessing ? (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-table-cells text-teal-400 animate-pulse"></i> Parsing data tables</span>
              <span className="font-semibold text-white tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
            </div>
          </div>
        ) : (
          <button onClick={handlePdfToExcel} disabled={pdfToExcelFiles.length === 0} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-teal-500/40 hover:shadow-[0_0_0_1px_rgba(20,184,166,0.2),0_8px_24px_-8px_rgba(20,184,166,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
            <i className="fa-solid fa-file-excel text-xs text-teal-400"></i> Extract to Excel &amp; Download
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- WORD TO PDF MODAL (accent: blue) --- */}
{isWordToPdfModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Word to PDF</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div
          className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isWordToPdfDragActive ? 'border-blue-500/70 bg-blue-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsWordToPdfDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsWordToPdfDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsWordToPdfDragActive(false); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsWordToPdfDragActive(false); if (e.dataTransfer.files?.length) setWordToPdfFiles(Array.from(e.dataTransfer.files)); }}
        >
          <input type="file" accept=".doc,.docx" id="word-to-pdf-upload" className="hidden" onChange={(e) => { if (e.target.files?.length) setWordToPdfFiles(Array.from(e.target.files)); }} disabled={isProcessing} />
          <label htmlFor="word-to-pdf-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
            {wordToPdfFiles.length > 0 ? (
              <div className="w-full text-left">
                <p className="text-xs font-semibold text-blue-400 mb-3">Selected file{wordToPdfFiles.length > 1 ? 's' : ''}</p>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {wordToPdfFiles.map((f, i) => (
                    <div key={i} className="bg-white/5 px-3 py-2 rounded-lg flex items-center justify-between border border-white/5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <i className="fa-solid fa-file-word text-blue-400 text-sm flex-shrink-0"></i>
                        <span className="text-xs font-medium text-slate-300 truncate">{f.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 flex-shrink-0">{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-blue-400"></i>
                </div>
                <p className="text-slate-300 text-sm font-medium">Drop a Word file here or tap to browse</p>
                <p className="text-slate-500 text-xs mt-1">Accepts .doc and .docx files</p>
              </div>
            )}
            <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
              ${wordToPdfFiles.length > 0 ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-blue-600 text-white hover:bg-blue-500'}
            `}>
              {wordToPdfFiles.length > 0 ? 'Change file' : 'Browse file'}
            </div>
          </label>
        </div>

        {isProcessing ? (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-gears text-blue-400 animate-spin"></i> Rendering document</span>
              <span className="font-semibold text-white tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
            </div>
            <p className="text-[10px] text-slate-500">Preserving fonts and layout…</p>
          </div>
        ) : (
          <button onClick={handleWordToPdf} disabled={wordToPdfFiles.length === 0} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-blue-500/40 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_8px_24px_-8px_rgba(59,130,246,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
            <i className="fa-solid fa-file-pdf text-xs text-blue-400"></i> Convert &amp; Download
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- EXCEL TO PDF MODAL (accent: green) --- */}
{isExcelToPdfModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-green-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Excel to PDF</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div
          className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isExcelToPdfDragActive ? 'border-green-500/70 bg-green-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsExcelToPdfDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsExcelToPdfDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsExcelToPdfDragActive(false); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsExcelToPdfDragActive(false); if (e.dataTransfer.files?.length) setExcelToPdfFiles(Array.from(e.dataTransfer.files)); }}
        >
          <input type="file" accept=".xls,.xlsx" id="excel-to-pdf-upload" className="hidden" onChange={(e) => { if (e.target.files?.length) setExcelToPdfFiles(Array.from(e.target.files)); }} disabled={isProcessing} />
          <label htmlFor="excel-to-pdf-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
            {excelToPdfFiles.length > 0 ? (
              <div className="w-full text-left">
                <p className="text-xs font-semibold text-green-400 mb-3">Selected file{excelToPdfFiles.length > 1 ? 's' : ''}</p>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {excelToPdfFiles.map((f, i) => (
                    <div key={i} className="bg-white/5 px-3 py-2 rounded-lg flex items-center justify-between border border-white/5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <i className="fa-solid fa-file-excel text-green-400 text-sm flex-shrink-0"></i>
                        <span className="text-xs font-medium text-slate-300 truncate">{f.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 flex-shrink-0">{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-green-400"></i>
                </div>
                <p className="text-slate-300 text-sm font-medium">Drop an Excel file here or tap to browse</p>
                <p className="text-slate-500 text-xs mt-1">Accepts .xls and .xlsx files</p>
              </div>
            )}
            <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
              ${excelToPdfFiles.length > 0 ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-green-600 text-white hover:bg-green-500'}
            `}>
              {excelToPdfFiles.length > 0 ? 'Change file' : 'Browse file'}
            </div>
          </label>
        </div>

        {isProcessing ? (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-table-cells text-green-400 animate-pulse"></i> Laying out sheets</span>
              <span className="font-semibold text-white tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
            </div>
          </div>
        ) : (
          <button onClick={handleExcelToPdf} disabled={excelToPdfFiles.length === 0} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-green-500/40 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.2),0_8px_24px_-8px_rgba(34,197,94,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
            <i className="fa-solid fa-file-pdf text-xs text-green-400"></i> Convert &amp; Download
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- PROTECT PDF MODAL (accent: violet) --- */}
{isProtectModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-violet-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Protect PDF</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div
          className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isProtectDragActive ? 'border-violet-500/70 bg-violet-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsProtectDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsProtectDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsProtectDragActive(false); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsProtectDragActive(false); if (e.dataTransfer.files?.[0]) setProtectFile(e.dataTransfer.files[0]); }}
        >
          <input type="file" accept=".pdf" id="pdf-protect-upload" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setProtectFile(e.target.files[0]); }} disabled={isProcessing} />
          <label htmlFor="pdf-protect-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
            {protectFile ? (
              <div className="w-full text-left">
                <p className="text-xs font-semibold text-violet-400 mb-3">Selected file</p>
                <div className="bg-white/5 px-3 py-2.5 rounded-lg flex items-center gap-3 border border-white/5">
                  <i className="fa-solid fa-file-pdf text-violet-400 text-base flex-shrink-0"></i>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-300 truncate">{protectFile.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{(protectFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-violet-400"></i>
                </div>
                <p className="text-slate-300 text-sm font-medium">Drop a PDF here or tap to browse</p>
                <p className="text-slate-500 text-xs mt-1">Select a document to encrypt</p>
              </div>
            )}
            <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
              ${protectFile ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-violet-600 text-white hover:bg-violet-500'}
            `}>
              {protectFile ? 'Change file' : 'Browse file'}
            </div>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300">Set encryption password</label>
          <div className="relative flex items-center bg-white/[0.03] rounded-xl border border-white/10 focus-within:border-violet-500/50 transition-colors">
            <i className="fa-solid fa-key absolute left-4 text-slate-500 text-xs"></i>
            <input type={showPassword ? 'text' : 'password'} placeholder="Enter strong password…" value={pdfPassword} onChange={(e) => setPdfPassword(e.target.value)} disabled={isProcessing}
              className="w-full h-12 pl-10 pr-11 text-sm bg-transparent outline-none font-medium text-white placeholder-slate-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors text-xs">
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {isProcessing ? (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-lock text-violet-400 animate-pulse"></i> Encrypting document</span>
              <span className="font-semibold text-white tabular-nums">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
            </div>
          </div>
        ) : (
          <button onClick={handleProtectPdf} disabled={!protectFile || !pdfPassword} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-violet-500/40 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_8px_24px_-8px_rgba(139,92,246,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
            <i className="fa-solid fa-lock text-xs text-violet-400"></i> Encrypt &amp; Download
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- UNLOCK PDF MODAL (accent: cyan) --- */}
{isUnlockModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-cyan-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Unlock PDF</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        {!unlockPreviewUrl && (
          <div
            className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
              ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
              ${isUnlockDragActive ? 'border-cyan-500/70 bg-cyan-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
            `}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsUnlockDragActive(true); }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsUnlockDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsUnlockDragActive(false); }}
            onDrop={(e) => {
              e.preventDefault(); e.stopPropagation(); setIsUnlockDragActive(false);
              if (e.dataTransfer.files?.[0]) { setUnlockFile(e.dataTransfer.files[0]); setUnlockPreviewUrl(null); setIsPasswordError(false); }
            }}
          >
            <input type="file" accept=".pdf" id="pdf-unlock-upload" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) { setUnlockFile(e.target.files[0]); setUnlockPreviewUrl(null); setIsPasswordError(false); } }}
              disabled={isProcessing} />
            <label htmlFor="pdf-unlock-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
              {unlockFile ? (
                <div className="w-full text-left">
                  <p className="text-xs font-semibold text-cyan-400 mb-3">Selected file</p>
                  <div className="bg-white/5 px-3 py-2.5 rounded-lg flex items-center gap-3 border border-white/5">
                    <i className="fa-solid fa-file-shield text-cyan-400 text-base flex-shrink-0"></i>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-300 truncate">{unlockFile.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{(unlockFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <i className="fa-solid fa-cloud-arrow-up text-xl text-cyan-400"></i>
                  </div>
                  <p className="text-slate-300 text-sm font-medium">Drop a protected PDF here or tap to browse</p>
                </div>
              )}
              <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
                ${unlockFile ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-cyan-600 text-white hover:bg-cyan-500'}
              `}>
                {unlockFile ? 'Change file' : 'Browse file'}
              </div>
            </label>
          </div>
        )}

        {unlockFile && !unlockPreviewUrl && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="text-xs font-semibold text-slate-300">Enter current password</label>
            <div className={`relative flex items-center bg-white/[0.03] rounded-xl border transition-colors ${isPasswordError ? 'border-red-500/50' : 'border-white/10 focus-within:border-cyan-500/50'}`}>
              <i className={`fa-solid fa-key absolute left-4 text-xs ${isPasswordError ? 'text-red-400' : 'text-slate-500'}`}></i>
              <input type={showPassword ? 'text' : 'password'} placeholder="Current document password…" value={unlockPassword}
                onChange={(e) => { setUnlockPassword(e.target.value); setIsPasswordError(false); }} disabled={isProcessing}
                className={`w-full h-12 pl-10 pr-11 text-sm bg-transparent outline-none font-medium placeholder-slate-500 ${isPasswordError ? 'text-red-300' : 'text-white'}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-4 transition-colors text-xs ${isPasswordError ? 'text-red-400' : 'text-slate-500 hover:text-slate-300'}`}>
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {isPasswordError && <p className="text-xs font-semibold text-red-400"><i className="fa-solid fa-triangle-exclamation mr-1"></i> Incorrect password. Try again.</p>}

            <button onClick={handleVerifyPassword} disabled={!unlockPassword || isProcessing} className="mt-2 w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-cyan-500/40 hover:shadow-[0_0_0_1px_rgba(6,182,212,0.2),0_8px_24px_-8px_rgba(6,182,212,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
              {isProcessing ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Verifying…</> : 'Unlock & Preview'}
            </button>
          </div>
        )}

        {unlockPreviewUrl && (
          <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center text-base flex-shrink-0">
                <i className="fa-solid fa-check"></i>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Access granted</p>
                <p className="text-xs text-slate-400 mt-0.5">Document decrypted successfully</p>
              </div>
            </div>

            {unlockPreviewUrl !== 'NOT_ENCRYPTED' && (
              <div className="aspect-[3/4] w-full max-w-[140px] mx-auto bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <img src={unlockPreviewUrl} alt="PDF Preview" className="w-full h-full object-cover" />
              </div>
            )}

            {isProcessing ? (
              <div className="flex flex-col gap-3 py-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-unlock-keyhole text-cyan-400 animate-pulse"></i> Removing security</span>
                  <span className="font-semibold text-white tabular-nums">{progress}%</span>
                </div>
                <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                  <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
                </div>
              </div>
            ) : (
              <button onClick={handleRemovePassword} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-cyan-500/40 hover:shadow-[0_0_0_1px_rgba(6,182,212,0.2),0_8px_24px_-8px_rgba(6,182,212,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
                <i className="fa-solid fa-download text-xs text-cyan-400"></i> Remove Password &amp; Download
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)}

{/* --- CHANGE PASSWORD MODAL (accent: rose) --- */}
{isChangePwdModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-rose-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Change Password</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        {!changePreviewUrl && (
          <div
            className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
              ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
              ${isChangeDragActive ? 'border-rose-500/70 bg-rose-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
            `}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsChangeDragActive(true); }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsChangeDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsChangeDragActive(false); }}
            onDrop={(e) => {
              e.preventDefault(); e.stopPropagation(); setIsChangeDragActive(false);
              if (e.dataTransfer.files?.[0]) { setChangeFile(e.dataTransfer.files[0]); setChangePreviewUrl(null); setIsChangeError(false); }
            }}
          >
            <input type="file" accept=".pdf" id="pdf-change-upload" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) { setChangeFile(e.target.files[0]); setChangePreviewUrl(null); setIsChangeError(false); } }}
              disabled={isProcessing} />
            <label htmlFor="pdf-change-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
              {changeFile ? (
                <div className="w-full text-left">
                  <p className="text-xs font-semibold text-rose-400 mb-3">Selected file</p>
                  <div className="bg-white/5 px-3 py-2.5 rounded-lg flex items-center gap-3 border border-white/5">
                    <i className="fa-solid fa-file-pdf text-rose-400 text-base flex-shrink-0"></i>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-300 truncate">{changeFile.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{(changeFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <i className="fa-solid fa-cloud-arrow-up text-xl text-rose-400"></i>
                  </div>
                  <p className="text-slate-300 text-sm font-medium">Drop the encrypted PDF here or tap to browse</p>
                </div>
              )}
              <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
                ${changeFile ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-rose-600 text-white hover:bg-rose-500'}
              `}>
                {changeFile ? 'Change file' : 'Browse file'}
              </div>
            </label>
          </div>
        )}

        {changeFile && !changePreviewUrl && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="text-xs font-semibold text-slate-300">Enter current password</label>
            <div className={`relative flex items-center bg-white/[0.03] rounded-xl border transition-colors ${isChangeError ? 'border-red-500/50' : 'border-white/10 focus-within:border-rose-500/50'}`}>
              <i className={`fa-solid fa-lock absolute left-4 text-xs ${isChangeError ? 'text-red-400' : 'text-slate-500'}`}></i>
              <input type={showOldPassword ? 'text' : 'password'} placeholder="Current document password…" value={oldPassword}
                onChange={(e) => { setOldPassword(e.target.value); setIsChangeError(false); }} disabled={isProcessing}
                className={`w-full h-12 pl-10 pr-11 text-sm bg-transparent outline-none font-medium placeholder-slate-500 ${isChangeError ? 'text-red-300' : 'text-white'}`} />
              <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className={`absolute right-4 transition-colors text-xs ${isChangeError ? 'text-red-400' : 'text-slate-500 hover:text-slate-300'}`}>
                <i className={`fa-solid ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {isChangeError && <p className="text-xs font-semibold text-red-400"><i className="fa-solid fa-triangle-exclamation mr-1"></i> Incorrect password. Try again.</p>}

            <button onClick={handleChangeVerify} disabled={!oldPassword || isProcessing} className="mt-2 w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-rose-500/40 hover:shadow-[0_0_0_1px_rgba(244,63,94,0.2),0_8px_24px_-8px_rgba(244,63,94,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
              {isProcessing ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Verifying…</> : 'Verify Access'}
            </button>
          </div>
        )}

        {changePreviewUrl && (
          <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex gap-3 items-center bg-white/5 border border-white/10 rounded-xl p-3.5">
              {changePreviewUrl !== 'NOT_ENCRYPTED' && (
                <div className="w-11 h-14 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                  <img src={changePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <p className="font-semibold text-emerald-400 text-sm flex items-center gap-1.5"><i className="fa-solid fa-shield-check"></i> Access verified</p>
                <p className="text-xs text-slate-400 mt-0.5">Set a new password for this document</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300">Set new password</label>
              <div className="relative flex items-center bg-white/[0.03] rounded-xl border border-white/10 focus-within:border-rose-500/50 transition-colors">
                <i className="fa-solid fa-key absolute left-4 text-slate-500 text-xs"></i>
                <input type={showNewPassword ? 'text' : 'password'} placeholder="Enter robust new password…" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isProcessing}
                  className="w-full h-12 pl-10 pr-11 text-sm bg-transparent outline-none font-medium text-white placeholder-slate-500" />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors text-xs">
                  <i className={`fa-solid ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {isProcessing ? (
              <div className="flex flex-col gap-3 py-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-lock text-rose-400 animate-pulse"></i> Encrypting</span>
                  <span className="font-semibold text-white tabular-nums">{progress}%</span>
                </div>
                <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                  <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
                </div>
              </div>
            ) : (
              <button onClick={handleChangePasswordSubmit} disabled={!newPassword} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-rose-500/40 hover:shadow-[0_0_0_1px_rgba(244,63,94,0.2),0_8px_24px_-8px_rgba(244,63,94,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
                <i className="fa-solid fa-floppy-disk text-xs text-rose-400"></i> Update Security &amp; Download
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)}

{/* --- PDF TO PPTX MODAL (accent: orange) --- */}
{isPdfToPptModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={closeOverlay}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-orange-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">PDF to PPTX</h2>
        <button onClick={closeOverlay} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        {pptProtectedError ? (
          <div className="bg-white/5 border border-red-500/20 rounded-2xl p-7 text-center">
            <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center text-xl mx-auto mb-4">
              <i className="fa-solid fa-lock"></i>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Encrypted document</h3>
            <p className="text-xs text-slate-400 mb-6">Password needed for <span className="font-semibold text-red-400">{pptProtectedError}</span>.</p>
            <div className="flex flex-col gap-2.5">
              <button onClick={goToUnlockTool} className="w-full h-11 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors">Go to Unlock PDF</button>
              <button onClick={() => { setPptProtectedError(null); setPdfToPptFiles([]); }} className="text-xs font-semibold text-slate-400 hover:text-slate-200">Upload different file</button>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`relative rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center
                ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
                ${isPptDragActive ? 'border-orange-500/70 bg-orange-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'}
              `}
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsPptDragActive(true); }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsPptDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsPptDragActive(false); }}
              onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsPptDragActive(false); if (e.dataTransfer.files?.length) setPdfToPptFiles(Array.from(e.dataTransfer.files)); }}
            >
              <input type="file" accept=".pdf" id="pdf-to-ppt-upload" className="hidden" onChange={(e) => { if (e.target.files?.length) setPdfToPptFiles(Array.from(e.target.files)); }} disabled={isProcessing} />
              <label htmlFor="pdf-to-ppt-upload" className="cursor-pointer flex flex-col items-center justify-center w-full">
                {pdfToPptFiles.length > 0 ? (
                  <div className="w-full text-left">
                    <p className="text-xs font-semibold text-orange-400 mb-3">{pdfToPptFiles.length} file{pdfToPptFiles.length > 1 ? 's' : ''} mapped</p>
                    <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                      {pdfToPptFiles.map((f, i) => (
                        <div key={i} className="bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2.5 border border-white/5">
                          <i className="fa-solid fa-file-powerpoint text-orange-400 text-sm flex-shrink-0"></i>
                          <span className="text-xs font-medium text-slate-300 truncate">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                      <i className="fa-solid fa-cloud-arrow-up text-xl text-orange-400"></i>
                    </div>
                    <p className="text-slate-300 text-sm font-medium">Drop a PDF here or tap to browse</p>
                    <p className="text-slate-500 text-xs mt-1">Convert it into an editable slide deck</p>
                  </div>
                )}
                <div className={`mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
                  ${pdfToPptFiles.length > 0 ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10' : 'bg-orange-600 text-white hover:bg-orange-500'}
                `}>
                  {pdfToPptFiles.length > 0 ? 'Change file' : 'Browse file'}
                </div>
              </label>
            </div>

            {isProcessing ? (
              <div className="flex flex-col gap-3 py-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300 flex items-center gap-2"><i className="fa-solid fa-layer-group text-orange-400 animate-pulse"></i> Rendering slides</span>
                  <span className="font-semibold text-white tabular-nums">{progress}%</span>
                </div>
                <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                  <div className="absolute inset-y-0 w-1/4 bg-white/25 blur-[2px]" style={{ animation: 'barSweep 1.1s linear infinite' }} />
                </div>
              </div>
            ) : (
              <button onClick={handlePdfToPpt} disabled={pdfToPptFiles.length === 0} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:border-orange-500/40 hover:shadow-[0_0_0_1px_rgba(249,115,22,0.2),0_8px_24px_-8px_rgba(249,115,22,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
                Convert &amp; Download PPTX
              </button>
            )}
          </>
        )}
      </div>
    </div>
  </div>
)}

{/* --- QR SCANNER MODAL (accent: teal) --- */}
{isQrScannerModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in" onClick={() => !isProcessing && closeOverlay()}>
    <div
      className="relative w-full h-full sm:h-auto sm:max-w-lg bg-slate-900 rounded-none sm:rounded-[1.75rem] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-teal-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

      <div className="relative z-10 flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">QR Scanner</h2>
        <button onClick={closeOverlay} disabled={isProcessing} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200 disabled:opacity-50">
          <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        {!qrResult ? (
          <div className="flex flex-col gap-4">
            <p className="text-slate-400 text-sm text-center px-4">Point your camera at a QR code — it scans automatically.</p>
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-black border border-white/10">
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline autoPlay />
              <canvas ref={canvasRef} className="hidden" />

              {isCameraStarting && !cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/80">
                  <i className="fa-solid fa-circle-notch fa-spin text-2xl text-teal-400"></i>
                  <span className="text-teal-200 font-semibold text-sm">Starting camera…</span>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90 px-6 text-center">
                  <i className="fa-solid fa-video-slash text-xl text-red-400"></i>
                  <span className="text-red-300 font-semibold text-sm">{cameraError}</span>
                  <button onClick={startQrCamera} className="mt-1 px-4 py-2 rounded-full bg-teal-600 text-white text-xs font-semibold hover:bg-teal-500 transition-colors">Try Again</button>
                </div>
              )}

              {!isCameraStarting && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 border-4 border-teal-400/80 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"></div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center text-2xl mb-4">
              <i className="fa-solid fa-check-circle"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Scan successful</h3>
            <p className="text-slate-400 text-xs mb-5">Your QR code has been decoded.</p>

            <div className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl text-left mb-5 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1 bg-teal-500"></div>
              <p className="text-slate-200 text-xs font-mono break-all select-all pl-2 line-clamp-3">{qrResult}</p>
            </div>

            <div className="grid grid-cols-4 gap-2 w-full mb-5">
              <button onClick={() => window.open(qrResult.startsWith('http') ? qrResult : `https://${qrResult}`, '_blank', 'noopener,noreferrer')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" title="Open Link">
                <i className="fa-brands fa-chrome text-teal-400"></i>
                <span className="text-[10px] font-semibold text-slate-300">Open</span>
              </button>
              <button onClick={() => { navigator.clipboard.writeText(qrResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" title="Copy to Clipboard">
                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} text-emerald-400`}></i>
                <span className="text-[10px] font-semibold text-slate-300">{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(qrResult)}`, '_blank')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" title="Share via WhatsApp">
                <i className="fa-brands fa-whatsapp text-emerald-400"></i>
                <span className="text-[10px] font-semibold text-slate-300">WhatsApp</span>
              </button>
              <button onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent('Scanned QR Link')}&body=${encodeURIComponent(qrResult)}`; }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" title="Share via Email">
                <i className="fa-solid fa-envelope text-sky-400"></i>
                <span className="text-[10px] font-semibold text-slate-300">Email</span>
              </button>
            </div>

            <button onClick={() => setQrResult('')} className="w-full h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold transition-all duration-200 hover:border-teal-500/40 hover:shadow-[0_0_0_1px_rgba(20,184,166,0.2),0_8px_24px_-8px_rgba(20,184,166,0.4)] active:scale-[0.98] flex items-center justify-center gap-2">
              <i className="fa-solid fa-rotate-right text-xs text-teal-400"></i> Scan Another Code
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}

{/* --- QR GENERATOR MODAL (unchanged component) --- */}
{isQrGeneratorModalOpen && (
  <QrGeneratorModal closeOverlay={closeOverlay} />
)}


{isSearchOpen && (
  <div
    className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-0 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
    onClick={() => setIsSearchOpen(false)}
  >
    <div
className="relative w-full h-full sm:h-auto sm:max-w-md bg-white rounded-none sm:rounded-[1.75rem] p-5 sm:p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-top-6 sm:zoom-in-95 ease-out max-h-full sm:max-h-[85vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools…"
            className="w-full bg-slate-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4B5C]/30"
          />
        </div>
        <button onClick={() => setIsSearchOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 active:scale-90 transition-transform">
          <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {filteredTools.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-8">No tools match "{searchQuery}"</p>
        ) : (
          filteredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { tool.action(); setIsSearchOpen(false); }}
              className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <img src={tool.image} alt="" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-sm font-semibold text-slate-800 flex-1">{tool.title}</span>
              <i className="fa-solid fa-chevron-right text-slate-300 text-xs"></i>
            </button>
          ))
        )}
      </div>
    </div>
  </div>
)}


{fullScreenPreviewUrl && (
  <div
    className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-10 bg-slate-950/90 backdrop-blur-md transition-all duration-300 animate-in fade-in"
    onClick={() => setFullScreenPreviewUrl(null)}
  >
    <button
      onClick={() => setFullScreenPreviewUrl(null)}
      className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors duration-200"
    >
      <i className="fa-solid fa-xmark text-white text-sm"></i>
    </button>
    <img
      src={fullScreenPreviewUrl}
      alt="Page preview"
      className="max-w-full max-h-full rounded-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] object-contain"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}


<footer className="fixed bottom-0 left-0 w-full h-[7px] z-50">
  {/* 7px 3D Strip */}
  <div className="w-full h-full bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-[0_-6px_15px_rgba(220,38,38,0.1),inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-2px_3px_rgba(105,20,20,0.1)] border-t border-orange-400/50">
  </div>
</footer>

    </div>
  );
}


