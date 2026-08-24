import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mergePdfs, splitPdf, compressPdf, imagesToPdf, pdfToImages, getPdfPreviews, removePdfPages, compressImages, pdfToWord, pdfToExcel, addPasswordToPdf, verifyPdfPassword, removePdfPassword, changePdfPassword, pdfToPpt } from '../api/client';
import './Home.css';
import { Html5QrcodeScanner } from 'html5-qrcode';
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


export default function Home() {
  const navigate = useNavigate();
  
  // Premium Pricing States
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
const [isQrScannerModalOpen, setIsQrScannerModalOpen] = useState(false);
const [qrResult, setQrResult] = useState('');
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
  const [imageFiles, setImageFiles] = useState([]);

    // Word to PDF States
  const [isWordToPdfModalOpen, setIsWordToPdfModalOpen] = useState(false);
  const [wordToPdfFiles, setWordToPdfFiles] = useState([]);
  const [isWordToPdfDragActive, setIsWordToPdfDragActive] = useState(false);

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

  // Listen for tool clicks from the Navbar
  useEffect(() => {
    const handleOpenModal = (e) => {
      const toolId = e.detail;
      if (toolId === 'merge') setIsMergeModalOpen(true);
      else if (toolId === 'split') setIsSplitModalOpen(true);
      else if (toolId === 'compress') setIsCompressModalOpen(true);
      else if (toolId === 'pdfToWord') setIsPdfToWordModalOpen(true);
      // Note: isWordToPdfModalOpen & isSignModalOpen are missing from your Home states, 
      // add them to your Home states if you need them to function.
      else if (toolId === 'protect') setIsProtectModalOpen(true);
      else if (toolId === 'unlock') setIsUnlockModalOpen(true);
      else if (toolId === 'changePwd') setIsChangePwdModalOpen(true);
      else if (toolId === 'pdfToExcel') setIsPdfToExcelModalOpen(true);
      else if (toolId === 'pdfToImg') setIsPdfToImgModalOpen(true);
      else if (toolId === 'imageToPdf') setIsImageModalOpen(true);
      else if (toolId === 'pdfToPpt') setIsPdfToPptModalOpen(true);
      else if (toolId === 'pricing') setIsPricingModalOpen(true);
    };

    window.addEventListener('openToolModal', handleOpenModal);
    return () => window.removeEventListener('openToolModal', handleOpenModal);
  }, []);

useEffect(() => {
  if (isQrScannerModalOpen) {
    const scanner = new Html5QrcodeScanner("qr-reader", { 
      qrbox: { width: 250, height: 250 }, 
      fps: 10,
      // Prefer facing mode 'environment' (back camera) on Android devices
      videoConstraints: { facingMode: { exact: "environment" } } 
    });
    
scanner.render(
  (decodedText) => {
    setQrResult(decodedText);
    toast.success("QR Code scanned successfully!");
    // Removed scanner.clear() so the camera stays active
  },
  (error) => {
    // Handle background scanning errors
  }
);

    return () => {
      scanner.clear().catch(console.error);
    };
  }
}, [isQrScannerModalOpen]);

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
    
  };

  // 1. Combine all modal states to check if ANY overlay is active
  const isAnyModalOpen = isMergeModalOpen || isSplitModalOpen || isCompressModalOpen || 
    isImageModalOpen || isPdfToImgModalOpen || isRemovePagesModalOpen || 
    isImgCompressModalOpen || isPdfToWordModalOpen || isPdfToExcelModalOpen || 
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
    
    <div className="app-container">

< Navbar />
        <div className="tools-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          
          {/* Merge PDF */}
          <article 
            className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(239,68,68,0.25)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
            onClick={() => setIsMergeModalOpen(true)}
          >
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-red-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-15 transition-opacity duration-500"></div>
            <div className="relative z-10 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 text-red-500 flex items-center justify-center text-2xl mb-6 shadow-inner border border-red-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <img src={image1} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">Merge PDF</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Combine multiple PDFs into a single document exactly the way you want.</p>
            </div>
            <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
              <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(239,68,68,0.3)] hover:bg-red-600 transition-all duration-300">
                Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
              </div>
            </div>
          </article>

          {/* Split PDF */}
          <article 
            className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(34,197,94,0.25)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
            onClick={() => setIsSplitModalOpen(true)}
          >
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-green-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-15 transition-opacity duration-500"></div>
            <div className="relative z-10 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 text-green-500 flex items-center justify-center text-2xl mb-6 shadow-inner border border-green-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <img src={image2} alt="" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">Split PDF</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Extract or separate pages into individual, high-quality files.</p>
            </div>
            <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
              <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:bg-green-600 transition-all duration-300">
                Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
              </div>
            </div>
          </article>

          {/* Compress PDF */}
          <article 
            className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.25)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
            onClick={() => setIsCompressModalOpen(true)}
          >
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-15 transition-opacity duration-500"></div>
            <div className="relative z-10 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-500 flex items-center justify-center text-2xl mb-6 shadow-inner border border-blue-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <img src={image3} alt="" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">Compress PDF</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Reduce heavy file sizes instantly while preserving perfect quality.</p>
            </div>
            <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
              <div className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:bg-blue-600 transition-all duration-300">
                Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
              </div>
            </div>
          </article>

          {/* Image to PDF */}
          <article 
            className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(168,85,247,0.25)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
            onClick={() => setIsImageModalOpen(true)}
          >
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-15 transition-opacity duration-500"></div>
            <div className="relative z-10 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 text-purple-500 flex items-center justify-center text-2xl mb-6 shadow-inner border border-purple-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <img src={image4} alt="" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">Image to PDF</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Convert PNG, JPG, or WEBP images into a perfectly structured PDF.</p>
            </div>
            <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
              <div className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(168,85,247,0.3)] hover:bg-purple-600 transition-all duration-300">
                Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
              </div>
            </div>
          </article>

          {/* PDF to Image */}
          <article 
            className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(14,165,233,0.25)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
            onClick={() => setIsPdfToImgModalOpen(true)}
          >
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-sky-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-15 transition-opacity duration-500"></div>
            <div className="relative z-10 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100/50 text-sky-500 flex items-center justify-center text-2xl mb-6 shadow-inner border border-sky-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <img src={image5} alt="" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors duration-300">PDF to Image</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Extract all pages from multiple PDF files into crisp PNG or JPEG images.</p>
            </div>
            <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
              <div className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(14,165,233,0.3)] hover:bg-sky-600 transition-all duration-300">
                Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
              </div>
            </div>
          </article>

          {/* Page Manager */}
          <article 
            className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.25)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
            onClick={() => setIsRemovePagesModalOpen(true)}
          >
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-15 transition-opacity duration-500"></div>
            <div className="relative z-10 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-500 flex items-center justify-center text-2xl mb-6 shadow-inner border border-amber-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <img src={image6} alt="" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">Page Manager</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Remove pages across multiple files instantly with real-time visual controls.</p>
            </div>
            <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
              <div className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:bg-amber-600 transition-all duration-300">
                Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
              </div>
            </div>
          </article>

          {/* Image Compressor */}
          <article 
            className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.25)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
            onClick={() => setIsImgCompressModalOpen(true)}
          >
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-15 transition-opacity duration-500"></div>
            <div className="relative z-10 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 flex items-center justify-center text-2xl mb-6 shadow-inner border border-amber-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <img src={image7} alt="" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">Image Compressor</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Decompress and optimize batch images using ultra-efficient slider encoding.</p>
            </div>
            <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
              <div className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:bg-amber-600 transition-all duration-300">
                Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
              </div>
            </div>
          </article>

{/* PDF to Word (Premium - Gold Theme) */}
<article 
  className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
  onClick={() => setIsPdfToWordModalOpen(true)}
>

  {/* Goldish Ambient Glow */}
  <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
  
  <div className="relative z-10 flex-1">
    {/* Icon Container */}
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/60 text-amber-600 flex items-center justify-center text-2xl mb-6 shadow-inner border border-amber-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
      <img src={image8} alt="" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">PDF to Word</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-6">Convert PDFs to editable Word documents (.docx) keeping fonts and layouts intact.</p>
  </div>
  
  {/* Action Button */}
  <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(245,158,11,0.4)] hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
      Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
    </div>
  </div>
</article>

{/* PDF to Excel (Premium - Gold Theme) */}
<article 
  className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
  onClick={() => setIsPdfToExcelModalOpen(true)}
>
  {/* Goldish Ambient Glow */}
  <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
  
  <div className="relative z-10 flex-1">
    {/* Icon Container */}
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/60 text-amber-600 flex items-center justify-center text-2xl mb-6 shadow-inner border border-amber-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
      <img src={image9} alt="" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">PDF to Excel</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-6">Extract tables and financial data into clean, formatted Excel (.xlsx) spreadsheets.</p>
  </div>
  
  {/* Action Button */}
  <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(245,158,11,0.4)] hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
      Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
    </div>
  </div>
</article>

            {/* Protect PDF (Premium - Gold Theme) */}
<article 
  className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
  onClick={() => setIsProtectModalOpen(true)}
>
  {/* Goldish Ambient Glow */}
  <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
  
  <div className="relative z-10 flex-1">
    {/* Icon Container */}
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/60 text-amber-600 flex items-center justify-center text-2xl mb-6 shadow-inner border border-amber-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
      <img src={image10} alt="" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">Protect PDF</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-6">Encrypt your document with high-security AES-256 passwords to prevent unauthorized access.</p>
  </div>
  
  {/* Action Button */}
  <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(245,158,11,0.4)] hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
      Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
    </div>
  </div>
</article>

{/* Unlock PDF (Premium - Gold Theme) */}
<article 
  className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
  onClick={() => setIsUnlockModalOpen(true)}
>
  
  {/* Goldish Ambient Glow */}
  <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
  
  <div className="relative z-10 flex-1">
    {/* Icon Container */}
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/60 text-amber-600 flex items-center justify-center text-2xl mb-6 shadow-inner border border-amber-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
      <img src={image11} alt="" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">Unlock PDF</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-6">Remove security passwords from protected PDFs permanently for easy access.</p>
  </div>
  
  {/* Action Button */}
  <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(245,158,11,0.4)] hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
      Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
    </div>
  </div>
</article>

{/* Change Password (Premium - Gold Theme) */}
<article 
  className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
  onClick={() => setIsChangePwdModalOpen(true)}
>
  
  {/* Goldish Ambient Glow */}
  <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
  
  <div className="relative z-10 flex-1">
    {/* Icon Container */}
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/60 text-amber-600 flex items-center justify-center text-2xl mb-6 shadow-inner border border-amber-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
      <img src={image12} alt="" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">Change Password</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-6">Update or swap the security password of an encrypted PDF instantly.</p>
  </div>
  
  {/* Action Button */}
  <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(245,158,11,0.4)] hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
      Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
    </div>
  </div>
</article>

{/* PDF to PowerPoint */}
<article 
  className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
  onClick={() => setIsPdfToPptModalOpen(true)}
>

  {/* Goldish Ambient Glow */}
  <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
  
  <div className="relative z-10 flex-1">
    {/* Icon Container */}
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/60 text-amber-600 flex items-center justify-center text-2xl mb-6 shadow-inner border border-amber-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
      <img src={image13} alt="" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">PDF to PPTX</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-6">Turn your PDF documents into high-quality, presentation-ready PowerPoint slides.</p>
  </div>
  
  {/* Action Button */}
  <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(245,158,11,0.4)] hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
      Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
    </div>
  </div>
</article>

<article
onClick={() => navigate('/ResumeBuilder')} 
  className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-default flex flex-col min-h-[280px]"
>
  {/* Premium Ambient Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

  {/* Header Section: Icon & Badges */}
  <div className="flex justify-between items-start mb-6 relative z-10">
    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 shadow-[0_4px_20px_rgba(245,158,11,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
      <img src={image14} alt="" />
    </div>
    
  </div>

  {/* Content Section */}
  <div className="relative z-10 mt-auto pt-4">
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">
      ResumeBuilder
    </h3>
    <p className="text-gray-500 text-sm leading-relaxed">
      Take full control of your documents. Add text, modify existing content, insert images, and sign PDFs directly in your browser.
    </p>
  </div>

  {/* Subtle "Not Active Yet" Overlay Pattern */}
  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(245,158,11,0.02)_10px,rgba(245,158,11,0.02)_20px)] pointer-events-none opacity-50 z-20"></div>
</article>

<article 
  className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(20,184,166,0.25)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col min-h-[280px]"
  onClick={() => { setIsQrScannerModalOpen(true); setQrResult(''); }}
>
  <div className="absolute -right-16 -top-16 w-48 h-48 bg-teal-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-0 group-hover:opacity-15 transition-opacity duration-500"></div>
  <div className="relative z-10 flex-1">
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 text-teal-500 flex items-center justify-center text-2xl mb-6 shadow-inner border border-teal-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
      <i className="fa-solid fa-qrcode"></i>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors duration-300">QR Scanner</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-6">Scan QR codes instantly using your device camera or upload an image.</p>
  </div>
  <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
    <div className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_15px_rgba(20,184,166,0.3)] hover:bg-teal-600 transition-all duration-300">
      Open Tool <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
    </div>
  </div>
</article>

<article 
      onClick={() => navigate('/Workspace')}
      className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 cursor-pointer transition-all duration-300 w-full max-w-sm"
    >
      {/* Subtle background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Card Content */}
      <div className="relative z-10 flex flex-col h-full gap-6">
        
        {/* Icon Container */}
        <div className="w-16 h-16 bg-slate-50 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-inner">
          <svg 
            className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        
        {/* Text */}
        <div>
          <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-blue-900 transition-colors">
            Open Workspace
          </h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Access your central dashboard to start building, editing, and managing your documents.
          </p>
        </div>

        {/* Call to Action Arrow */}
        <div className="mt-4 flex items-center text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
          Enter Workspace 
          <svg 
            className="w-4 h-4 ml-2 transform group-hover:translate-x-1.5 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
        
      </div>
    </article>

        </div>

      {/* --- MERGE MODAL --- */}
      {isMergeModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 md:p-10 bg-slate-950/60 backdrop-blur-xl transition-all duration-500 animate-in fade-in"
          onClick={closeOverlay}
        >
          <style dangerouslySetInnerHTML={{__html: `body { overflow: hidden !important; }` }} />

          <div 
            className="relative w-full max-w-lg bg-gradient-to-b from-white via-white/95 to-slate-50/90 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_50px_100px_-20px_rgba(239,68,68,0.25),inset_0_1px_1px_rgba(255,255,255,0.8),0_0_1px_1px_rgba(239,68,68,0.1)] border border-white/80 overflow-hidden transform transition-all duration-500 animate-in fade-in zoom-in-[0.95] slide-in-from-bottom-8 ease-[cubic-bezier(0.34,1.56,0.64,1)] mobile-fullscreen-modal select-none" 
            style={{ perspective: '1000px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 3D Ambient Holographic Glows */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-red-400 to-rose-500 rounded-full mix-blend-multiply filter blur-[90px] opacity-25 pointer-events-none animate-pulse"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-orange-400 to-red-400 rounded-full mix-blend-multiply filter blur-[90px] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-center mb-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight font-sans">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-red-900">Merge PDFs</span>
              </h2>
              
              <button onClick={closeOverlay} className="group w-11 h-11 cursor-pointer rounded-full bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 flex items-center justify-center">
                <i className="fa-solid fa-xmark text-slate-400 group-hover:text-rose-500 group-hover:rotate-90 transition-all duration-300 text-sm"></i>
              </button>
            </div>
            
            <div className="relative z-10 flex flex-col gap-6">
              <div 
                className={`group relative overflow-hidden  rounded-[1.25rem] border-2   transition-all duration-500 p-6 sm:p-8 text-center transform hover:scale-[1.01] active:scale-[0.99]
                  ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
                  ${isMergeDragActive 
                    ? 'border-red-500 bg-red-50/60 shadow-[0_25px_50px_-12px_rgba(239,68,68,0.2),inset_0_2px_8px_rgba(239,68,68,0.05)] scale-[1.02]' 
                    : 'border-slate-200 hover:border-red-400/80 bg-gradient-to-b from-white via-slate-50/40 to-slate-100/20 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_45px_-15px_rgba(239,68,68,0.12)]'
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
                <label htmlFor="pdf-merge-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  
                  {selectedFiles.length > 0 ? (
                    <div className="w-full text-left bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] border border-slate-100 transform transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-black text-xs text-red-600 tracking-widest flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"> </span>  {selectedFiles.length} Selected
                        </p>
                      </div>
                      <div className="max-h-36 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {selectedFiles.map((f, i) => (
                          <div key={i} className="bg-slate-50/80 hover:bg-slate-50 p-0 rounded-xl flex items-center justify-between border border-slate-100 shadow-sm transition-all duration-200">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                <i className="fa-solid fa-file-pdf text-red-600 text-sm"></i>
                              </div>
                              <span className="text-xs font-bold text-slate-700 truncate max-w-[220px]">{f.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={`transform transition-all duration-500 ${isMergeDragActive ? '-translate-y-2' : 'group-hover:-translate-y-2'}`}>
                      <div className={`w-20 h-20 mx-auto rounded-2.5xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center mb-5 border relative transition-all duration-500 overflow-hidden
                        ${isMergeDragActive ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white border-red-400 scale-110 shadow-[0_20px_40px_-10px_rgba(239,68,68,0.4)]' : 'bg-white text-red-500 border-slate-100'}
                      `}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <i className={`fa-solid fa-cloud-arrow-up text-3xl relative z-10 transition-all duration-500 ${isMergeDragActive ? 'text-white scale-110' : 'group-hover:text-white group-hover:scale-110'}`}></i>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
                      </h3>
                      <p className="text-slate-400 text-xs mt-1.5 font-medium px-4">Upload two or more files to stitch them together</p>
                    </div>
                  )}

                  <div className={`mt-6 px-6 py-1 rounded-xl border font-bold text-xs shadow-sm transition-all duration-300 transform group-hover:scale-[1.03] active:scale-95
                    ${selectedFiles.length > 0 ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50' : 'bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-red-500/10'}
                  `}>
                    {selectedFiles.length > 0 ? <span><i className="fa-solid fa-folder-open mr-1.5"></i>Change File</span> : <span><i className="fa-solid fa-folder-open mr-1.5"></i>Browse File</span>}
                  </div>
                </label>
              </div>

              {isProcessing ? (
                <div className="relative overflow-hidden bg-white rounded-3xl p-2 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative flex items-center justify-center w-24 h-24 mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="7" fill="transparent" />
                      <circle cx="50" cy="50" r="40" stroke="url(#redCircleGlow)" strokeWidth="7" fill="transparent" strokeDasharray="251.32" strokeDashoffset={251.32 - (251.32 * progress) / 100} strokeLinecap="round" className="transition-all style-none duration-300 ease-out" />
                      <defs>
                        <linearGradient id="redCircleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{progress}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-800 flex items-center justify-center gap-2 tracking-wider">
                      <i className="fa-solid fa-gears text-red-500 animate-spin text-xs"></i> Compiling PDF Matrix...
                    </p>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleMerge} 
                  disabled={selectedFiles.length < 2} 
                  className="group relative w-full cursor-pointer h-10 rounded-2.5xl bg-slate-900 text-white text-sm font-bold disabled:opacity-30  rounded-[1.25rem] disabled:cursor-not-allowed transition-all duration-500 overflow-hidden shadow-[0_15px_30px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2.5 tracking-wide text-sm font-extrabold h-full ">
                    <i className="fa-solid fa-wand-magic-sparkles text-xs opacity-70 group-hover:rotate-12 transition-transform duration-300"></i> Merge & Download
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SPLIT MODAL --- */}
      {isSplitModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 md:p-10 bg-slate-950/60 backdrop-blur-xl transition-all duration-500 animate-in fade-in"
          onClick={closeOverlay}
        >
          <div 
            className="relative w-full max-w-lg bg-gradient-to-b from-white via-white/95 to-slate-50/90 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_50px_100px_-20px_rgba(34,197,94,0.25),inset_0_1px_1px_rgba(255,255,255,0.8),0_0_1px_1px_rgba(34,197,94,0.1)] border border-white/80 overflow-hidden transform transition-all duration-500 animate-in fade-in zoom-in-[0.95] slide-in-from-bottom-8 ease-[cubic-bezier(0.34,1.56,0.64,1)] mobile-fullscreen-modal select-none" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-[90px] opacity-25 pointer-events-none animate-pulse"></div>
            
            <div className="relative z-10 flex justify-between items-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tight drop-shadow-sm font-sans">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-green-900">Split PDF</span>
              </h2>
              <button onClick={closeOverlay} className="group w-11 h-11 rounded-full cursor-pointer bg-white hover:bg-green-50 border border-slate-200/80 hover:border-green-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center">
                <i className="fa-solid fa-xmark text-slate-400 group-hover:text-green-500 group-hover:rotate-90 transition-all duration-300"></i>
              </button>
            </div>
            
            <div className="relative z-10 flex flex-col gap-6">
              <div 
                className={`group relative overflow-hidden  rounded-[1.25rem] border-2   transition-all duration-500 p-6 sm:p-8 text-center transform hover:scale-[1.01] active:scale-[0.99]
                  ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
                  ${isSplitDragActive ? 'border-green-500 bg-green-50/60 shadow-[0_25px_50px_-12px_rgba(34,197,94,0.2)] scale-[1.02]' : 'border-slate-200 hover:border-green-400/80 bg-gradient-to-b from-white via-slate-50/40 to-slate-100/20 hover:shadow-[0_25px_45px_-15px_rgba(34,197,94,0.12)]'}
                `}
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsSplitDragActive(true); }}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsSplitDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsSplitDragActive(false); }}
                onDrop={(e) => {
                  e.preventDefault(); e.stopPropagation(); setIsSplitDragActive(false);
                  if (e.dataTransfer.files?.length) setSplitFile(e.dataTransfer.files[0]);
                }}
              >
                <input type="file" accept=".pdf" id="pdf-split-upload" className="hidden" onChange={(e) => { if (e.target.files?.length) setSplitFile(e.target.files[0]); }} disabled={isProcessing}/>
                <label htmlFor="pdf-split-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  {splitFile ? (
                    <div className="w-full text-left bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] border border-slate-100 transform transition-all">
                      <p className="font-black text-xs text-green-600 tracking-widest mb-3">Selected File</p>
                      <div className="bg-slate-50/80 p-0 rounded-xl flex items-center border border-slate-100 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 mr-3">
                          <i className="fa-solid fa-file-pdf text-green-600 text-sm"></i>
                        </div>
                        <p className="text-xs font-bold text-slate-700 truncate">{splitFile.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`transform transition-all duration-500 ${isSplitDragActive ? '-translate-y-2' : 'group-hover:-translate-y-2'}`}>
                      <div className={`w-20 h-20 mx-auto rounded-2.5xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center mb-5 border relative transition-all duration-500 overflow-hidden
                        ${isSplitDragActive ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-400 scale-110 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.4)]' : 'bg-white text-green-500 border-slate-100'}
                      `}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <i className={`fa-solid fa-cloud-arrow-up text-3xl relative z-10 transition-all duration-500 ${isSplitDragActive ? 'text-white scale-110' : 'group-hover:text-white group-hover:scale-110'}`}></i>
                      </div>
                      <p className="text-slate-400 text-xs mt-1.5 font-medium px-4">{isSplitDragActive ? 'Drop file' : 'Select PDF to Split into single pages'}</p>
                    </div>
                  )}
                  <div className={`mt-6 px-6 py-1 rounded-xl border font-bold text-xs shadow-sm transition-all duration-300 transform group-hover:scale-[1.03]
                    ${splitFile ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50' : 'bg-green-600 text-white border-green-600 hover:bg-green-700 shadow-green-500/10'}
                  `}>{splitFile ? <span><i className="fa-solid fa-folder-open mr-1.5"></i>Change File</span> : <span><i className="fa-solid fa-folder-open mr-1.5"></i>Browse File</span>}</div>
                </label>
              </div>
      
              {isProcessing ? (
                <div className="relative overflow-hidden bg-white rounded-3xl p-2 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative flex items-center justify-center w-24 h-24 mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="7" fill="transparent" />
                      <circle cx="50" cy="50" r="40" stroke="url(#greenGlow)" strokeWidth="7" fill="transparent" strokeDasharray="251.32" strokeDashoffset={251.32 - (251.32 * progress) / 100} strokeLinecap="round" className="transition-all style-none duration-300 ease-out" />
                      <defs><linearGradient id="greenGlow" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22c55e"/><stop offset="100%" stopColor="#10b981"/></linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{progress}%</span>
                    </div>
                  </div>
                  <p className="text-xs font-black text-slate-800 tracking-wider animate-pulse"><img src={image2} className='imageCenter' alt="" /> Slicing Pages...</p>
                </div>
              ) : (
                <button onClick={handleSplit} disabled={!splitFile} className="group relative cursor-pointer w-full h-10 rounded-[1.25rem] bg-slate-900 text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-500 overflow-hidden hover:shadow-[0_20px_40px_-10px_rgba(34,197,94,0.4)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2.5 h-full">Split & Download ZIP</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

{/* --- COMPRESS MODAL --- */}
{isCompressModalOpen && (
  <div 
    className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 md:p-10 bg-slate-950/60 backdrop-blur-xl transition-all duration-500 animate-in fade-in"
    onClick={closeOverlay}
  >
    <div 
      className="relative w-full max-w-lg bg-gradient-to-b from-white via-white/95 to-slate-50/90 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_50px_100px_-20px_rgba(59,130,246,0.25),inset_0_1px_1px_rgba(255,255,255,0.8),0_0_1px_1px_rgba(59,130,246,0.1)] border border-white/80 overflow-hidden transform transition-all duration-500 animate-in fade-in zoom-in-[0.95] mobile-fullscreen-modal " 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-[90px] opacity-25 animate-pulse pointer-events-none"></div>

      <div className="relative z-10 flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tight drop-shadow-sm font-sans">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900">Compress PDF</span>
        </h2>
        <button onClick={closeOverlay} className="group w-11 h-11 rounded-full bg-white cursor-pointer hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center">
          <i className="fa-solid fa-xmark text-slate-400 group-hover:text-blue-500 group-hover:rotate-90 transition-all duration-300"></i>
        </button>
      </div>
      
      <div className="relative z-10 flex flex-col gap-6">
        <div 
          className={`group relative overflow-hidden  rounded-[1.25rem] border-2   transition-all duration-500 p-6 sm:p-8 text-center transform hover:scale-[1.01] active:scale-[0.99]
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isCompressDragActive ? 'border-blue-500 bg-blue-50/60 shadow-[0_25px_50px_-12px_rgba(59,130,246,0.2)] scale-[1.02]' : 'border-slate-200 hover:border-blue-400/80 bg-gradient-to-b from-white via-slate-50/40 to-slate-100/20'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsCompressDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsCompressDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsCompressDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault(); e.stopPropagation(); setIsCompressDragActive(false);
            if (e.dataTransfer.files?.length) setCompressFile(e.dataTransfer.files[0]);
          }}
        >
          <input type="file" accept=".pdf" id="pdf-compress-upload" className="hidden" onChange={(e) => { if (e.target.files?.length) setCompressFile(e.target.files[0]); }} disabled={isProcessing}/>
          <label htmlFor="pdf-compress-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
            {compressFile ? (
              <div className="w-full text-left bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] border border-slate-100">
                <p className="font-black text-xs text-blue-600 tracking-widest mb-3">Selected File</p>
                <div className="bg-slate-50/80 p-0 rounded-xl flex items-center border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
                    <i className="fa-solid fa-file-pdf text-blue-600 text-sm"></i>
                  </div>
                  <p className="text-xs font-bold text-slate-700 truncate">{compressFile.name}</p>
                </div>
              </div>
            ) : (
              <div className={`transform transition-all duration-500 ${isCompressDragActive ? '-translate-y-2' : 'group-hover:-translate-y-2'}`}>
                <div className={`w-20 h-20 mx-auto rounded-2.5xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center mb-5 border relative transition-all duration-500 overflow-hidden
                  ${isCompressDragActive ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-blue-400 scale-110 shadow-[0_20px_40px_-10px_rgba(59,130,246,0.4)]' : 'bg-white text-blue-500 border-slate-100'}
                `}>
                  <i className={`fa-solid fa-minimize text-3xl relative z-10 transition-all duration-500 ${isCompressDragActive ? 'text-white' : 'group-hover:text-white group-hover:scale-110'}`}></i>
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <p className="text-slate-400 text-xs mt-1.5 font-medium px-4">{isCompressDragActive ? 'Drop heavy file' : 'Click here to Select Heavy PDF to compress'}</p>
              </div>
            )}
          </label>
        </div>

        {/* 3D Premium Slider Box */}
        <div className="bg-white rounded-[0.5rem] p-3 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-black text-slate-800 tracking-tight">Compression Ratio</label>
            <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 rounded-[0.25rem] shadow-md">{compressQuality}%</span>
          </div>
          <input type="range" min="1" max="100" value={compressQuality} onChange={(e) => setCompressQuality(e.target.value)} disabled={isProcessing}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-cyan-500 transition-all focus:outline-none" 
          />
        </div>

        {isProcessing ? (
          <div className="relative overflow-hidden bg-white rounded-3xl p-1 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            <div className="relative flex items-center justify-center w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="7" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="url(#blueGlow)" strokeWidth="7" fill="transparent" strokeDasharray="251.32" strokeDashoffset={251.32 - (251.32 * progress) / 100} strokeLinecap="round" className="transition-all style-none duration-300 ease-out" />
                <defs><linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900 tracking-tighter">{progress}%</span>
              </div>
            </div>
            <p className="text-xs font-black text-slate-800 animate-pulse"><i className="fa-solid fa-bolt text-blue-500"></i> Optimizing Size...</p>
          </div>
        ) : (
          <button onClick={handleCompress} disabled={!compressFile} className="group relative cursor-pointer h-10 rounded-[1.25rem] bg-slate-900 text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-500 overflow-hidden hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
            <span className="relative z-10 flex items-center justify-center gap-2.5 h-full">Compress & Download</span>
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- PREMIUM IMAGE TO PDF MODAL --- */}
{isImageModalOpen && (
  <div 
    className="fixed inset-0 z-[100] flex items-center justify-center  sm:p-6 md:p-10 bg-slate-950/60 backdrop-blur-xl transition-all duration-500 animate-in fade-in"
    onClick={closeOverlay}
  >
    <style dangerouslySetInnerHTML={{__html: `body { overflow: hidden !important; }` }} />

    <div 
      className="relative w-full max-w-lg bg-gradient-to-b from-white via-white/95 to-slate-50/90 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_50px_100px_-20px_rgba(168,85,247,0.25),inset_0_1px_1px_rgba(255,255,255,0.8),0_0_1px_1px_rgba(168,85,247,0.1)] border border-white/80 overflow-hidden transform transition-all duration-500 animate-in fade-in zoom-in-[0.95] slide-in-from-bottom-8 ease-[cubic-bezier(0.34,1.56,0.64,1)] mobile-fullscreen-modal select-none" 
      style={{ perspective: '1000px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 3D Ambient Holographic Glows */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-full mix-blend-multiply filter blur-[90px] opacity-25 pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-violet-400 to-purple-500 rounded-full mix-blend-multiply filter blur-[90px] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tight drop-shadow-sm font-sans">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-purple-900">Image to PDF</span>
        </h2>
        
        <button onClick={closeOverlay} className="group w-11 h-11 cursor-pointer rounded-full bg-white hover:bg-purple-50 border border-slate-200/80 hover:border-purple-200 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 flex items-center justify-center">
          <i className="fa-solid fa-xmark text-slate-400 group-hover:text-purple-500 group-hover:rotate-90 transition-all duration-300 text-sm"></i>
        </button>
      </div>
      
      <div className="relative z-10 flex flex-col gap-6">
  
        <div 
          className={`group relative overflow-hidden  rounded-[1.25rem] border-2   transition-all duration-500 p-6 sm:p-8 text-center transform hover:scale-[1.01] active:scale-[0.99]
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isImageDragActive 
              ? 'border-purple-500 bg-purple-50/60 shadow-[0_25px_50px_-12px_rgba(168,85,247,0.2),inset_0_2px_8px_rgba(168,85,247,0.05)] scale-[1.02]' 
              : 'border-slate-200 hover:border-purple-400/80 bg-gradient-to-b from-white via-slate-50/40 to-slate-100/20 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_45px_-15px_rgba(168,85,247,0.12)]'
            }
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsImageDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsImageDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsImageDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault(); e.stopPropagation(); setIsImageDragActive(false);
            if (e.dataTransfer.files?.length) setImageFiles(Array.from(e.dataTransfer.files));
          }}
        >
          <input 
            type="file" accept="image/*" id="image-to-pdf-upload" className="hidden" 
            onChange={(e) => { if (e.target.files?.length) setImageFiles(Array.from(e.target.files)); }} 
            disabled={isProcessing}
          />
          <label htmlFor="image-to-pdf-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
            
            {imageFiles.length > 0 ? (
              <div className="w-full text-left bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] border border-slate-100 transform transition-all">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-black text-xs text-purple-600 tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span> Selected File
                  </p>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {imageFiles.map((f, i) => (
                    <div key={i} className="bg-slate-50/80 hover:bg-slate-50 p-0 rounded-xl flex items-center justify-between border border-slate-100 shadow-sm transition-all duration-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-image text-purple-600 text-sm"></i>
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[220px]">{f.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`transform transition-all duration-500 ${isImageDragActive ? '-translate-y-2' : 'group-hover:-translate-y-2'}`}>
                <div className={`w-20 h-20 mx-auto rounded-2.5xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center mb-5 border relative transition-all duration-500 overflow-hidden
                  ${isImageDragActive ? 'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white border-purple-400 scale-110 shadow-[0_20px_40px_-10px_rgba(168,85,247,0.4)]' : 'bg-white text-purple-500 border-slate-100'}
                `}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <i className={`fa-solid fa-cloud-arrow-up text-3xl relative z-10 transition-all duration-500 ${isImageDragActive ? 'text-white scale-110' : 'group-hover:text-white group-hover:scale-110'}`}></i>
                </div>
                <p className="text-slate-400 text-xs mt-1.5 font-medium px-4">Convert JPG, PNG, or WEBP into a PDF File.</p>
              </div>
            )}

            <div className={`mt-6 px-6 py-1 rounded-xl border font-bold text-xs shadow-sm transition-all duration-300 transform group-hover:scale-[1.03] active:scale-95
              ${imageFiles.length > 0 ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50' : 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 shadow-purple-500/10'}
            `}>
              {imageFiles.length > 0 ? <span><i className="fa-solid fa-folder-open mr-1.5"></i>Change Image</span> : <span><i className="fa-solid fa-folder-open mr-1.5"></i>Browse Images</span>}
            </div>
          </label>
        </div>

        {isProcessing ? (
          <div className="relative overflow-hidden bg-white rounded-3xl p-1 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            <div className="relative flex items-center justify-center w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="7" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="url(#purpleCircleGlow)" strokeWidth="7" fill="transparent" strokeDasharray="251.32" strokeDashoffset={251.32 - (251.32 * progress) / 100} strokeLinecap="round" className="transition-all style-none duration-300 ease-out" />
                <defs>
                  <linearGradient id="purpleCircleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900 tracking-tighter">{progress}%</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-slate-800 flex items-center justify-center gap-2 tracking-wider">
                <i className="fa-solid fa-layer-group text-purple-500 animate-pulse text-xs"></i> Converting to PDF...
              </p>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleImageToPdf} 
            disabled={imageFiles.length === 0} 
            className="group relative w-full h-10 h-10 rounded-[1.25rem] cursor-pointer rounded-2.5xl bg-slate-900 text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-500 overflow-hidden shadow-[0_15px_30px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
            <span className="relative z-10 flex items-center justify-center gap-2.5 tracking-wide text-sm font-extrabold h-full">
              <i className="fa-solid fa-file-pdf text-xs opacity-70 group-hover:rotate-12 transition-transform duration-300"></i> Convert to PDF & Download
            </span>
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- PREMIUM PDF TO IMAGE MODAL --- */}
      {isPdfToImgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-500" onClick={closeOverlay}>
          <div 
            className="relative max-w-md w-[95vw] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.2)] border border-white/60 overflow-hidden animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-500 ease-out mobile-fullscreen-modal" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 pointer-events-none animate-pulse"></div>

            {/* Header */}
            <div className="relative z-10 flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                PDF to Image
              </h2>
              <button onClick={closeOverlay} className="group cursor-pointer w-10 h-10 rounded-full bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all duration-300 flex items-center justify-center">
                <i className="fa-solid fa-xmark text-slate-400 group-hover:text-blue-500 group-hover:rotate-90 transition-all duration-300"></i>
              </button>
            </div>
            
            <div className="relative z-10 flex flex-col gap-6">
       
              <div 
                className={`group relative overflow-hidden rounded-[1.25rem] border-2   transition-all duration-500 p-8 text-center
                  ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
                  ${isPdfToImgDragActive ? 'border-blue-500 bg-blue-50/80 scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'border-blue-200/60 bg-gradient-to-b from-blue-50/30 to-transparent hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]'}
                `}
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsPdfToImgDragActive(true); }}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsPdfToImgDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsPdfToImgDragActive(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsPdfToImgDragActive(false);
                  if (e.dataTransfer.files) {
                    setPdfToImgFiles(Array.from(e.dataTransfer.files));
                  }
                }}
              >
                <input 
                  type="file" accept=".pdf" id="pdf-to-img-upload" className="hidden" 
                  onChange={(e) => {
                    if (e.target.files) {
                      setPdfToImgFiles(Array.from(e.target.files));
                    }
                  }} 
                  disabled={isProcessing}
                />
                <label htmlFor="pdf-to-img-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  {pdfToImgFiles.length > 0 ? (
                    <div className="w-full text-left bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white transform transition-all">
                      <p className="font-extrabold text-xs text-blue-900 tracking-wider mb-2">Selected File</p>
                      <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                        {pdfToImgFiles.map((f, i) => (
                          <div key={i} className="bg-slate-50 p-2 rounded-lg flex items-center gap-3 border border-slate-100">
                            <i className="fa-solid fa-file-pdf text-blue-500"></i>
                            <span className="text-xs font-semibold text-gray-700 truncate">{f.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={`transform transition-all duration-500 ${isPdfToImgDragActive ? '-translate-y-2' : 'group-hover:-translate-y-2'}`}>
                      <div className={`w-16 h-16 mx-auto rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.04)] flex items-center justify-center mb-4 border relative overflow-hidden transition-all duration-500
                        ${isPdfToImgDragActive ? 'bg-blue-100 text-blue-600 border-blue-200 scale-110' : 'bg-white text-blue-500 border-slate-100'}
                      `}>
                        <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <i className={`fa-solid fa-cloud-arrow-up text-2xl relative z-10 transition-transform duration-500 ${isPdfToImgDragActive ? 'animate-bounce' : 'group-hover:scale-110'}`}></i>
                      </div>
                      <p className="text-gray-400 text-xs mt-1 font-medium">Select PDF file to convert to Image </p>
                    </div>
                  )}
                  <div className="mt-6 px-6 py-1 rounded-xl bg-white border border-blue-100 text-blue-600 hover:bg-blue-50 hover:border-blue-200 font-bold text-xs shadow-sm transition-all duration-300 transform group-hover:scale-105">
                    {pdfToImgFiles.length > 0 ? <span><i className="fa-solid fa-folder-open mr-1.5"></i>Change File</span> : <span><i className="fa-solid fa-folder-open mr-1.5"></i>Browse File</span>}
                  </div>
                </label>
              </div>

              {/* Format Selector */}
              <div className="bg-white/50 border border-slate-100 rounded-[.5rem] p-3 flex flex-col gap-2">
                <label className="text-xs font-black text-gray-800 tracking-tight">Output Format</label>
                <select 
                  value={imageFormat} 
                  onChange={(e) => setImageFormat(e.target.value)}
                  className="w-full h-12 border border-slate-200 rounded-xl px-4 py-2 bg-white text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all appearance-none"
                  disabled={isProcessing}
                >
                  <option value="png">png</option>
                  <option value="jpeg">jpg</option>
                </select>
              </div>

              {/* Action Button */}
              {isProcessing ? (
                <div className="progress-container bg-slate-50 p-1 rounded-[1.25rem] border border-slate-100 animate-in fade-in zoom-in duration-300">
                  <div className="flex justify-between text-xs font-black text-blue-600 mb-2 tracking-wide">
                    <span className="flex items-center gap-2"><i className="fa-solid fa-circle-notch fa-spin"></i> Converting to Image...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 relative" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handlePdfToImagesSubmit} 
                  disabled={pdfToImgFiles.length === 0} 
                  className="group relative w-full h-10 cursor-pointer rounded-2xl bg-gray-900 text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)] transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <i className="fa-solid fa-bolt group-hover:text-yellow-300 transition-colors duration-300"></i> Convert to Image & Download
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

{/* --- PREMIUM REMOVE PAGES MODAL --- */}
{isRemovePagesModalOpen && (
  <div 
    className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 bg-slate-950/60 backdrop-blur-xl transition-all duration-500 animate-in fade-in" 
    onClick={closeOverlay}
  >
    <style dangerouslySetInnerHTML={{__html: `body { overflow: hidden !important; }` }} />

    <div 
      className="relative w-full max-w-5xl h-[92vh] bg-gradient-to-b from-white via-white/95 to-slate-50/90 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_50px_100px_-20px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/80 overflow-hidden flex flex-col transform transition-all duration-500 animate-in fade-in zoom-in-[0.95] ease-[cubic-bezier(0.34,1.56,0.64,1)] mobile-fullscreen-modal select-none" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* 3D Ambient Holographic Glows */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none animate-pulse"></div>

      {/* Fixed Header */}
      <div className="relative z-10 flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tight drop-shadow-sm font-sans">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-amber-900">Page Manager</span>
        </h2>
        
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-orange-50 text-amber-700 text-[10px] font-black px-3 py-1.5 rounded-full tracking-wider border border-amber-200 shadow-sm">
            <i className="fa-solid fa-crown text-[10px]"></i> Pro
          </span>
          <button onClick={closeOverlay} className="group cursor-pointer w-11 h-11 rounded-full bg-white hover:bg-amber-50 border border-slate-200/80 hover:border-amber-200 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 flex items-center justify-center">
            <i className="fa-solid fa-xmark text-slate-400 group-hover:text-amber-500 group-hover:rotate-90 transition-all duration-300 text-sm"></i>
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 sm:pr-4 custom-scrollbar space-y-8 relative z-10">

        {/* Advanced Upload Zone */}
        <div 
          className={`group relative overflow-hidden  rounded-[1.25rem] border-2   transition-all duration-500 p-8 sm:p-10 text-center transform hover:scale-[1.005] active:scale-[0.995]
            ${(isProcessing || isLoadingPreviews) ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isRemovePagesDragActive 
              ? 'border-amber-500 bg-amber-50/60 shadow-[0_25px_50px_-12px_rgba(245,158,11,0.2),inset_0_2px_8px_rgba(245,158,11,0.05)] scale-[1.01]' 
              : 'border-slate-200 hover:border-amber-400/80 bg-gradient-to-b from-white via-slate-50/40 to-slate-100/20 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_45px_-15px_rgba(245,158,11,0.12)]'
            }
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsRemovePagesDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsRemovePagesDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsRemovePagesDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault(); e.stopPropagation(); setIsRemovePagesDragActive(false);
            if (e.dataTransfer.files?.length) handleRemovePagesFileChange({ target: { files: e.dataTransfer.files } });
          }}
        >
          <input type="file" accept=".pdf" id="remove-pages-upload" className="hidden" onChange={handleRemovePagesFileChange} disabled={isProcessing || isLoadingPreviews}/>
          <label htmlFor="remove-pages-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
            <div className={`transform transition-all duration-500 ${isRemovePagesDragActive ? '-translate-y-2' : 'group-hover:-translate-y-2'}`}>
              <div className={`w-20 h-20 mx-auto rounded-2.5xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center mb-5 border relative transition-all duration-500 overflow-hidden
                ${isRemovePagesDragActive ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-400 scale-110 shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)]' : 'bg-white text-amber-500 border-slate-100'}
              `}>
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <i className={`fa-solid fa-file-pdf text-3xl relative z-10 transition-all duration-500 ${isRemovePagesDragActive ? 'text-white scale-110' : 'group-hover:text-white group-hover:scale-110'}`}></i>
              </div>
              <p className="text-slate-400 text-xs mt-1.5 font-medium">Extract, Delete, or Merge specific pages visually</p>
            </div>
            
            <div className={`mt-6 px-6 py-1 rounded-xl border font-bold text-xs shadow-sm transition-all duration-300 transform group-hover:scale-[1.03] active:scale-95 bg-white text-slate-700 border-slate-200 hover:bg-slate-50`}>
              <i className="fa-solid fa-folder-open mr-1.5"></i>Browse File
            </div>
          </label>
        </div>

        {/* Loading State Spinner */}
        {isLoadingPreviews && (
          <div className="py-16 flex flex-col items-center justify-center bg-white/50 rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
            <div className="relative flex items-center justify-center w-16 h-16 mb-4">
              <svg className="w-full h-full transform -rotate-90 animate-spin" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="8" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="8" fill="transparent" strokeDasharray="100 200" strokeLinecap="round" />
              </svg>
              <i className="fa-solid fa-shield text-amber-500 absolute"></i>
            </div>
            <p className="text-sm font-black text-slate-800 tracking-wider">Generating Secure Canvas...</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Rendering high-fidelity thumbnails</p>
          </div>
        )}

        {/* 3D Previews Grid */}
        {previewData.length > 0 && !isLoadingPreviews && (
          <div className="space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
            {previewData.map((fileObj, fileIndex) => (
              <div key={fileIndex} className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-[2rem] p-6 sm:p-8 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.05)]">
                <h4 className="font-black text-slate-900 text-sm mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-slate-100 text-amber-600 flex items-center justify-center shadow-inner border border-slate-200">
                    <i className="fa-regular fa-file-pdf"></i>
                  </span>
                  {fileObj.filename}
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-5">
                  {fileObj.pages.map((page) => {
                    const isKept = activeKeptPages[fileIndex]?.includes(page.page_index);
                    return (
                      <div key={page.page_index} className={`group relative rounded-2.5xl overflow-hidden p-2 transition-all duration-300 ${isKept ? 'bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-slate-200 hover:border-amber-300 transform hover:-translate-y-1' : 'bg-slate-50 opacity-60 grayscale border   border-slate-300 hover:opacity-80'}`}>
                        <div className="aspect-[3/4] bg-slate-100 overflow-hidden relative shadow-inner">
                          <img src={page.thumbnail} alt={`Page ${page.page_index + 1}`} className="w-full h-full object-cover" />
                          
                          {/* Hover Overlay Controls */}
                          <div className="absolute inset-0  opacity-50 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button onClick={() => setFullScreenPreviewUrl(page.thumbnail)} className="w-9 h-9 bg-white/90 cursor-pointer text-slate-700 rounded-full flex items-center justify-center hover:scale-110 hover:bg-white hover:text-slate-900 transition-all shadow-lg">
                              <i className="fa-solid fa-expand text-xs"></i>
                            </button>
                            <button onClick={() => togglePageSelection(fileIndex, page.page_index)} className={`w-9 h-9 text-white cursor-pointer rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg ${isKept ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                              <i className={`fa-solid ${isKept ? 'fa-trash-can' : 'fa-arrow-rotate-left'}`}></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3 px-1">
                          <p className="text-[10px] font-black text-slate-500 tracking-widest">Page {page.page_index + 1}</p>
                          <div className={`w-2 h-2 rounded-full ${isKept ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-red-400'}`}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Output Engine Configuration Box */}
            <div className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center justify-between shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]">
              <div>
                <p className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <i className="fa-solid fa-layer-group text-amber-500"></i> Packaging Protocol
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">Determine the structural output format</p>
              </div>
              <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-full sm:w-auto border border-slate-200 shadow-inner">
                {['single', 'multiple'].map((mode) => (
                  <button 
                    key={mode} onClick={() => setDownloadMode(mode)}
                    className={`flex-1 sm:flex-initial cursor-pointer px-6 py-3 text-xs font-black rounded-xl transition-all duration-300 ${downloadMode === mode ? 'bg-white text-slate-900 shadow-sm border border-slate-200 scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {mode === 'single' ? 'Bind as Single PDF' : 'Export as ZIP Archive'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Action Footer */}
      <div className="shrink-0 pt-3 border-t border-slate-100 mt-2 relative z-10">
        {isProcessing ? (
          <div className="w-full h-15 bg-slate-50 rounded-2.5xl flex items-center justify-between px-8 border border-slate-200">
            <span className="font-black text-sm text-slate-800 tracking-widest flex items-center gap-3">
              <i className="fa-solid fa-circle-notch fa-spin text-amber-500"></i> Restructuring ...
            </span>
            <span className="font-black text-amber-500 text-lg">{progress}%</span>
          </div>
        ) : (
          <button 
            onClick={handleRemovePagesSubmit} 
            disabled={previewData.length === 0 || activeKeptPages.every(arr => arr.length === 0)} 
            className="group w-full h-10 cursor-pointer rounded-[1.25rem] bg-slate-900 text-white font-black text-sm tracking-wide hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              Apply Structural Changes <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </span>
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- FULLSCREEN COMPONENT MODAL OVERLAY --- */}
{fullScreenPreviewUrl && (
  <div 
    className="fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300" 
    onClick={() => setFullScreenPreviewUrl(null)}
  >
    <div 
      className="relative max-w-4xl max-h-[92vh] bg-white/5 rounded-3xl overflow-hidden p-2 shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 flex items-center justify-center transform transition-all animate-in zoom-in-95 duration-500 select-none" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Premium Floating Close Button */}
      <button 
        onClick={() => setFullScreenPreviewUrl(null)} 
        className="absolute top-4 right-4 cursor-pointer sm:top-6 sm:right-6 z-20 w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md hover:bg-red-500 text-white transition-all duration-300 flex items-center justify-center border border-white/20 hover:border-red-400 shadow-xl group"
      >
        <i className="fa-solid fa-xmark text-sm group-hover:rotate-90 transition-transform duration-300"></i>
      </button>

      {/* The Image Wrapper */}
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
        <img 
          src={fullScreenPreviewUrl} 
          alt="High Resolution Preview" 
          className="max-w-full max-h-[88vh] object-contain select-none" 
        />
        
        {/* Subtle Bottom-Left Identifier Label */}
        <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-slate-900/80 backdrop-blur border border-white/10 rounded-lg shadow-lg pointer-events-none">
          <p className="text-[10px] font-black text-slate-300 tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Preview Mode
          </p>
        </div>
      </div>
    </div>
  </div>
)}

{/* --- PREMIUM IMAGE COMPRESS MODAL --- */}
{isImgCompressModalOpen && (
  <div 
    className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 md:p-10 bg-slate-950/60 backdrop-blur-xl transition-all duration-500 animate-in fade-in"
    onClick={closeOverlay}
  >
    <style dangerouslySetInnerHTML={{__html: `body { overflow: hidden !important; }` }} />

    <div 
      className="relative w-full max-w-lg bg-gradient-to-b from-white via-white/95 to-slate-50/90 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_50px_100px_-20px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.8),0_0_1px_1px_rgba(245,158,11,0.1)] border border-white/80 overflow-hidden transform transition-all duration-500 animate-in fade-in zoom-in-[0.95] slide-in-from-bottom-8 ease-[cubic-bezier(0.34,1.56,0.64,1)] mobile-fullscreen-modal select-none" 
      style={{ perspective: '1000px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 3D Ambient Holographic Glows */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mix-blend-multiply filter blur-[90px] opacity-25 pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-yellow-300 to-amber-500 rounded-full mix-blend-multiply filter blur-[90px] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 flex justify-between items-center mb-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight font-sans">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-amber-900">Compress Images</span>
        </h2>
        
        <button onClick={closeOverlay} className="group w-11 h-11 rounded-full cursor-pointer bg-white hover:bg-amber-50 border border-slate-200/80 hover:border-amber-200 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 flex items-center justify-center">
          <i className="fa-solid fa-xmark text-slate-400 group-hover:text-amber-500 group-hover:rotate-90 transition-all duration-300 text-sm"></i>
        </button>
      </div>
      
      <div className="relative z-10 flex flex-col gap-6">

        <div 
          className={`group relative overflow-hidden  rounded-[1.25rem] border-2   transition-all duration-500 p-6 sm:p-8 text-center transform hover:scale-[1.01] active:scale-[0.99]
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isImgDragActive 
              ? 'border-amber-500 bg-amber-50/60 shadow-[0_25px_50px_-12px_rgba(245,158,11,0.2),inset_0_2px_8px_rgba(245,158,11,0.05)] scale-[1.02]' 
              : 'border-slate-200 hover:border-amber-400/80 bg-gradient-to-b from-white via-slate-50/40 to-slate-100/20 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_45px_-15px_rgba(245,158,11,0.12)]'
            }
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsImgDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsImgDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsImgDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault(); e.stopPropagation(); setIsImgDragActive(false);
            if (e.dataTransfer.files?.length) setImgCompressFiles(Array.from(e.dataTransfer.files));
          }}
        >
          <input 
            type="file" accept="image/*" id="img-compress-upload" className="hidden" 
            onChange={(e) => { if (e.target.files?.length) setImgCompressFiles(Array.from(e.target.files)); }} 
            disabled={isProcessing}
          />
          <label htmlFor="img-compress-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
            
            {imgCompressFiles.length > 0 ? (
              <div className="w-full text-left bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] border border-slate-100 transform transition-all">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-black text-xs text-amber-600 tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span> Selected File
                  </p>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {imgCompressFiles.map((f, i) => (
                    <div key={i} className="bg-slate-50/80 hover:bg-slate-50 p-0 rounded-xl flex items-center justify-between border border-slate-100 shadow-sm transition-all duration-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-image text-amber-600 text-sm"></i>
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[220px]">{f.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`transform transition-all duration-500 ${isImgDragActive ? '-translate-y-2' : 'group-hover:-translate-y-2'}`}>
                <div className={`w-20 h-20 mx-auto rounded-2.5xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center mb-5 border relative transition-all duration-500 overflow-hidden
                  ${isImgDragActive ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-400 scale-110 shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)]' : 'bg-white text-amber-500 border-slate-100'}
                `}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <i className={`fa-solid fa-cloud-arrow-up text-3xl relative z-10 transition-all duration-500 ${isImgDragActive ? 'text-white scale-110' : 'group-hover:text-white group-hover:scale-110'}`}></i>
                </div>
                <p className="text-slate-400 text-xs mt-1.5 font-medium px-4">Select JPG, PNG, or WEBP file to compress</p>
              </div>
            )}

            <div className={`mt-6 px-6 py-1 rounded-xl border font-bold text-xs shadow-sm transition-all duration-300 transform group-hover:scale-[1.03] active:scale-95
              ${imgCompressFiles.length > 0 ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50' : 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-amber-500/10'}
            `}>
              {imgCompressFiles.length > 0 ? <span><i className="fa-solid fa-folder-open mr-1.5"></i>Change File</span> : <span><i className="fa-solid fa-folder-open mr-1.5"></i>Browse Files</span>}
            </div>
          </label>
        </div>

        {/* 3D Premium Quality Slider */}
        <div className="bg-white rounded-[0.5rem] p-3 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-5">
            <label className="text-xs font-black text-slate-800 tracking-tight">Compression Quality</label>
            <span className="text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 rounded-[0.1rem] shadow-md">{imgCompressQuality}%</span>
          </div>
          <input 
            type="range" min="10" max="100" value={imgCompressQuality} 
            onChange={(e) => setImgCompressQuality(parseInt(e.target.value))} 
            disabled={isProcessing}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-orange-500 transition-all focus:outline-none" 
          />
        </div>

        {isProcessing ? (
          <div className="relative overflow-hidden bg-white rounded-[0.5rem] p-1 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            <div className="relative flex items-center justify-center w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="7" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="url(#amberCircleGlow)" strokeWidth="7" fill="transparent" strokeDasharray="251.32" strokeDashoffset={251.32 - (251.32 * progress) / 100} strokeLinecap="round" className="transition-all style-none duration-300 ease-out" />
                <defs>
                  <linearGradient id="amberCircleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900 tracking-tighter">{progress}%</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-slate-800 flex items-center justify-center gap-2 tracking-wider">
                <i className="fa-solid fa-compress text-amber-500 animate-pulse text-xs"></i> Shrinking Assets...
              </p>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleCompressImages} 
            disabled={imgCompressFiles.length === 0} 
            className="group relative w-full h-10 cursor-pointer rounded-[1.25rem] bg-slate-900 text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-500 overflow-hidden shadow-[0_15px_30px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
            <span className="relative z-10 flex items-center justify-center gap-2.5 tracking-wide text-sm font-extrabold h-full">
              <i className="fa-solid fa-wand-magic-sparkles text-xs opacity-70 group-hover:rotate-12 transition-transform duration-300"></i> Optimize & Download
            </span>
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- PREMIUM 3D PDF TO WORD MODAL --- */}
{isPdfToWordModalOpen && (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center sm:p-6 md:p-10 bg-slate-950/60 backdrop-blur-xl transition-all duration-500 animate-in fade-in"
    onClick={closeOverlay}
  >
    {/* Background Scroll Lock Helper */}
    <style dangerouslySetInnerHTML={{__html: `body { overflow: hidden !important; }` }} />

    <div 
      className="relative w-full max-w-lg bg-gradient-to-b from-white via-white/95 to-slate-50/90 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_50px_100px_-20px_rgba(37,99,235,0.25),inset_0_1px_1px_rgba(255,255,255,0.8),0_0_1px_1px_rgba(37,99,235,0.1)] border border-white/80 overflow-hidden transform transition-all duration-500 animate-in fade-in zoom-in-[0.95] slide-in-from-bottom-8 ease-[cubic-bezier(0.34,1.56,0.64,1)] mobile-fullscreen-modal select-none" 
      style={{ perspective: '1000px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 3D Ambient Holographic Glows */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-[90px] opacity-25 pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-[90px] opacity-20 pointer-events-none"></div>

      {/* Top Header Row */}
      <div className="relative z-10 flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tight drop-shadow-sm font-sans">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900">PDF to Word</span>
        </h2>
        
        <button 
          onClick={closeOverlay} 
          className="group w-11 h-11 rounded-full cursor-pointer bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 flex items-center justify-center"
          aria-label="Close modal"
        >
          <i className="fa-solid fa-xmark text-slate-400 group-hover:text-rose-500 group-hover:rotate-90 transition-all duration-300 text-sm"></i>
        </button>
      </div>
      
      {/* Interactive Body Content */}
      <div className="relative z-10 flex flex-col gap-6">

        {/* Advanced 3D Upload Card */}
        <div 
          className={`group relative overflow-hidden  rounded-[1.25rem] border-2   transition-all duration-500 p-6 sm:p-8 text-center transform hover:scale-[1.01] active:scale-[0.99]
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isWordDragActive 
              ? 'border-blue-500 bg-blue-50/60 shadow-[0_25px_50px_-12px_rgba(37,99,235,0.2),inset_0_2px_8px_rgba(37,99,235,0.05)] scale-[1.02]' 
              : 'border-slate-200 hover:border-blue-400/80 bg-gradient-to-b from-white via-slate-50/40 to-slate-100/20 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_45px_-15px_rgba(37,99,235,0.12)]'
            }
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsWordDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsWordDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsWordDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault(); e.stopPropagation(); setIsWordDragActive(false);
            if (e.dataTransfer.files?.length) setPdfToWordFiles(Array.from(e.dataTransfer.files));
          }}
        >
          <input 
            type="file" accept=".pdf" id="pdf-to-word-upload" className="hidden" 
            onChange={(e) => { if (e.target.files?.length) setPdfToWordFiles(Array.from(e.target.files)); }} 
            disabled={isProcessing}
          />
          <label htmlFor="pdf-to-word-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
            
            {pdfToWordFiles.length > 0 ? (
              <div className="w-full text-left bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] border border-slate-100 transform transition-all">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-black text-xs text-blue-600 tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                    Selected File
                  </p>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {pdfToWordFiles.map((f, i) => (
                    <div key={i} className="bg-slate-50/80 hover:bg-slate-50 p-0 rounded-xl flex items-center justify-between border border-slate-100 shadow-sm transition-all duration-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-file-pdf text-blue-600 text-sm"></i>
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[220px] sm:max-w-[28px]">{f.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md flex-shrink-0">
                        {(f.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`transform transition-all duration-500 ${isWordDragActive ? '-translate-y-2' : 'group-hover:-translate-y-2'}`}>
                {/* Immersive Icon Vessel */}
                <div className={`w-20 h-20 mx-auto rounded-2.5xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center mb-5 border relative transition-all duration-500 overflow-hidden
                  ${isWordDragActive 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-400 scale-110 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)]' 
                    : 'bg-white text-blue-500 border-slate-100'
                  }
                `}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <i className={`fa-solid fa-cloud-arrow-up text-3xl relative z-10 transition-all duration-500 ${isWordDragActive ? 'text-white scale-110' : 'group-hover:text-white group-hover:scale-110'}`}></i>
                </div>
                <p className="text-slate-400 text-xs mt-1.5 font-medium px-4">
                  Upload PDF file to convert to Word
                </p>
              </div>
            )}

            {/* Dynamic Button Layer */}
            <div className={`mt-6 px-6 py-1 rounded-xl border font-bold text-xs shadow-sm transition-all duration-300 transform group-hover:scale-[1.03] active:scale-95
              ${pdfToWordFiles.length > 0 
                ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm' 
                : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 shadow-md shadow-blue-500/10'
              }
            `}>
              {pdfToWordFiles.length > 0 ? (
                <span><i className="fa-solid fa-folder-open mr-1.5"></i>Change File</span>
              ) : (
                <span><i className="fa-solid fa-folder-open mr-1.5"></i>Browse File</span>
              )}
            </div>
          </label>
        </div>

        {/* Action Button & Premium 3D Circular Loader Segment */}
        {isProcessing ? (
          <div className="relative overflow-hidden bg-white rounded-3xl p-1 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            {/* Elegant Premium Circular Loader Ring */}
            <div className="relative flex items-center justify-center w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Outer Ring Tracks */}
                <circle
                  cx="50" cy="50" r="40"
                  stroke="rgba(226, 232, 240, 0.6)"
                  strokeWidth="7" fill="transparent"
                />
                {/* Dynamic Micro Glow Ring Effect */}
                <circle
                  cx="50" cy="50" r="40"
                  stroke="url(#premiumCircleGlow)"
                  strokeWidth="7" fill="transparent"
                  strokeDasharray="251.32"
                  strokeDashoffset={251.32 - (251.32 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all style-none duration-300 ease-out"
                />
                {/* Define Premium Gradient Shaders */}
                <defs>
                  <linearGradient id="premiumCircleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="50%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Inner Metric Data Matrix */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900 tracking-tighter">{progress}%</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs font-black text-slate-800 flex items-center justify-center gap-2 tracking-wider">
                <i className="fa-solid fa-gears text-blue-500 animate-spin text-xs"></i> 
                Reconstructing Document Elements
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Assembling editable Word matrices, layouts, and tables...</p>
            </div>
          </div>
        ) : (
          <button 
            onClick={handlePdfToWord} 
            disabled={pdfToWordFiles.length === 0} 
            className="group relative w-full h-10 cursor-pointer rounded-[1.25rem] bg-slate-900 text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-500 overflow-hidden shadow-[0_15px_30px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            {/* Glowing 3D Base Fill Layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
            
            <span className="relative z-10 flex items-center justify-center gap-2.5 tracking-wide text-sm font-extrabold">
              <i className="fa-solid fa-cube text-xs opacity-70 group-hover:rotate-12 transition-transform duration-300"></i>
              Convert & Download
              <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-300"></i>
            </span>
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- PDF TO EXCEL MODAL --- */}
{isPdfToExcelModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all duration-500" onClick={closeOverlay}>
    <div 
      className="relative w-[92%] max-w-md bg-white/90 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-[0_24px_70px_-15px_rgba(16,185,129,0.25)] border border-white/80 overflow-hidden animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-500 ease-out mobile-fullscreen-modal" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Ambient Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 pointer-events-none animate-pulse"></div>

      <div className="relative z-10 flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight font-sans">
          PDF to Excel
        </h2>
        <button onClick={closeOverlay} className="group w-9 h-9 sm:w-10 sm:h-10 rounded-full cursor-pointer bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 transition-all duration-300 flex items-center justify-center">
          <i className="fa-solid fa-xmark text-slate-400 group-hover:text-emerald-500 group-hover:rotate-90 transition-all duration-300 text-sm"></i>
        </button>
      </div>
      
      <div className="relative z-10 flex flex-col gap-5 sm:gap-6">

        <div 
          className={`group relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border-2   transition-all duration-500 p-6 sm:p-8 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isExcelDragActive ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01] shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'border-slate-200 hover:border-emerald-400 bg-gradient-to-b from-slate-50/50 to-transparent hover:shadow-[0_12px_30px_rgba(16,185,129,0.05)]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsExcelDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsExcelDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsExcelDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExcelDragActive(false);
            if (e.dataTransfer.files) {
              setPdfToExcelFiles(Array.from(e.dataTransfer.files));
            }
          }}
        >
          <input 
            type="file" accept=".pdf" id="pdf-to-excel-upload" className="hidden" 
            onChange={(e) => {
              if (e.target.files) {
                setPdfToExcelFiles(Array.from(e.target.files));
              }
            }} 
            disabled={isProcessing}
          />
          <label htmlFor="pdf-to-excel-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
            {pdfToExcelFiles.length > 0 ? (
              <div className="w-full text-left bg-white p-4 rounded-xl shadow-sm border border-slate-100 transform transition-all">
                <p className="font-bold text-[10px] sm:text-xs text-emerald-800 tracking-wider mb-2">Selected Files </p>
                <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 segment-scrollbar">
                  {pdfToExcelFiles.map((f, i) => (
                    <div key={i} className="bg-slate-50 p-2 rounded-lg flex items-center gap-2.5 border border-slate-100/70">
                      <i className="fa-solid fa-file-pdf text-emerald-500 text-sm flex-shrink-0"></i>
                      <span className="text-xs font-medium text-slate-700 truncate">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`transform transition-all duration-500 ${isExcelDragActive ? '-translate-y-1' : 'group-hover:-translate-y-1'}`}>
                <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl shadow-sm flex items-center justify-center mb-3.5 border relative overflow-hidden transition-all duration-500
                  ${isExcelDragActive ? 'bg-emerald-100 text-emerald-600 border-emerald-200 scale-105' : 'bg-white text-slate-400 border-slate-200 group-hover:border-emerald-200 group-hover:text-emerald-500'}
                `}>
                  <i className={`fa-solid fa-cloud-arrow-up text-xl sm:text-2xl relative z-10 transition-transform duration-500 ${isExcelDragActive ? 'animate-bounce' : 'group-hover:scale-105'}`}></i>
                </div>
                <p className="text-slate-400 text-xs mt-1.5 font-medium px-4">Select PDF file containing tables or lists to convert to Exel</p>
              </div>
            )}
            <div className="mt-5 px-5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 group-hover:text-emerald-600 group-hover:border-emerald-200 font-semibold text-xs shadow-sm transition-all duration-300 transform group-hover:scale-[1.02]">
              {pdfToExcelFiles.length > 0 ? <span><i className="fa-solid fa-folder-open mr-1.5"></i>Change File</span> : <span><i className="fa-solid fa-folder-open mr-1.5"></i>Browse File</span>}
            </div>
          </label>
        </div>

        {/* Action / Processing Block */}
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-2xl border border-slate-100/80 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  className="stroke-emerald-500 transition-all duration-300 ease-out" 
                  strokeWidth="6" 
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base sm:text-lg font-black text-slate-800 font-mono tracking-tighter">{progress}%</span>
              </div>
            </div>
            <p className="text-[11px] font-bold text-emerald-600 mt-3.5 tracking-wider flex items-center gap-1.5 animate-pulse">
              <i className="fa-solid fa-table-cells text-xs"></i> Parsing Data Tables...
            </p>
          </div>
        ) : (
          <button 
            onClick={handlePdfToExcel} 
            disabled={pdfToExcelFiles.length === 0} 
            className="group relative w-full cursor-pointer h-10 sm:h-14 rounded-[1.25rem] sm:rounded-2xl bg-slate-950 text-white text-xs sm:text-sm font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_12px_40px_-10px_rgba(16,185,129,0.4)] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              <i className="fa-solid fa-file-excel group-hover:-translate-y-0.5 transition-transform duration-300"></i> Extract to Excel & Download
            </span>
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- PROTECT PDF MODAL --- */}
{isProtectModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all duration-500" onClick={closeOverlay}>
    <div 
      className="relative w-[92%] max-w-md bg-white/90 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-[0_24px_70px_-15px_rgba(79,70,229,0.25)] border border-white/80 overflow-hidden animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-500 ease-out mobile-fullscreen-modal" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Ambient Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 pointer-events-none animate-pulse"></div>

      <div className="relative z-10 flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight font-sans">
          Protect PDF
        </h2>
        <button onClick={closeOverlay} className="group w-9 h-9 cursor-pointer sm:w-10 sm:h-10 rounded-full bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition-all duration-300 flex items-center justify-center">
          <i className="fa-solid fa-xmark text-slate-400 group-hover:text-indigo-600 group-hover:rotate-90 transition-all duration-300 text-sm"></i>
        </button>
      </div>
      
      <div className="relative z-10 flex flex-col gap-5 sm:gap-6">

        <div 
          className={`group relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border-2   transition-all duration-500 p-6 sm:p-8 text-center
            ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
            ${isProtectDragActive ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01] shadow-[0_0_30px_rgba(79,70,229,0.15)]' : 'border-slate-200 hover:border-indigo-400 bg-gradient-to-b from-slate-50/50 to-transparent hover:shadow-[0_12px_30px_rgba(79,70,229,0.05)]'}
          `}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsProtectDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsProtectDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsProtectDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsProtectDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setProtectFile(e.dataTransfer.files[0]);
            }
          }}
        >
          <input 
            type="file" accept=".pdf" id="pdf-protect-upload" className="hidden" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setProtectFile(e.target.files[0]);
              }
            }} 
            disabled={isProcessing}
          />
          <label htmlFor="pdf-protect-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
            {protectFile ? (
              <div className="w-full text-left bg-white p-4 rounded-xl shadow-sm border border-slate-100 transform transition-all">
                <p className="font-bold text-[10px] sm:text-xs text-indigo-800 tracking-wider mb-2">Selected File</p>
                <div className="bg-slate-50 p-0 rounded-lg flex items-center gap-3 border border-slate-100/70">
                  <i className="fa-solid fa-file-pdf text-indigo-500 text-xl flex-shrink-0"></i>
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-semibold text-slate-700 truncate">{protectFile.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{(protectFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`transform transition-all duration-500 ${isProtectDragActive ? '-translate-y-1' : 'group-hover:-translate-y-1'}`}>
                <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl shadow-sm flex items-center justify-center mb-3.5 border relative overflow-hidden transition-all duration-500
                  ${isProtectDragActive ? 'bg-indigo-100 text-indigo-600 border-indigo-200 scale-105' : 'bg-white text-slate-400 border-slate-200 group-hover:border-indigo-200 group-hover:text-indigo-500'}
                `}>
                  <i className={`fa-solid fa-cloud-arrow-up text-xl sm:text-2xl relative z-10 transition-transform duration-500 ${isProtectDragActive ? 'animate-bounce' : 'group-hover:scale-105'}`}></i>
                </div>
                <p className="text-slate-400 text-[11px] sm:text-xs mt-1 font-normal max-w-[240px] mx-auto leading-normal">Select a single document to encrypt</p>
              </div>
            )}
            <div className="mt-5 px-5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 group-hover:text-indigo-600 group-hover:border-indigo-200 font-semibold text-xs shadow-sm transition-all duration-300 transform group-hover:scale-[1.02]">
              {protectFile ? <span><i className="fa-solid fa-folder-open mr-1.5"></i>Change File</span> : <span><i className="fa-solid fa-folder-open mr-1.5"></i>Browse File</span>}
            </div>
          </label>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <label className="text-[10px] sm:text-xs font-bold text-slate-700 tracking-wide">Set Encryption Password</label>
          <div className="relative flex items-center bg-slate-50/50 rounded-xl border border-slate-200/80 transition-all focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-sm">
            <span className="absolute left-4 text-slate-400 text-xs sm:text-sm">
              <i className="fa-solid fa-key"></i>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter strong password..."
              value={pdfPassword}
              onChange={(e) => setPdfPassword(e.target.value)}
              disabled={isProcessing}
              className="w-full h-11 sm:h-12 pl-10 pr-12 text-xs sm:text-sm bg-transparent outline-none font-medium text-slate-800 placeholder-slate-400"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute cursor-pointer right-4 text-slate-400 hover:text-indigo-600 transition-colors text-xs sm:text-sm">
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {/* Action / Processing Block */}
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-2xl border border-slate-100/80 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  className="stroke-indigo-500 transition-all duration-300 ease-out" 
                  strokeWidth="6" 
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base sm:text-lg font-black text-slate-800 font-mono tracking-tighter">{progress}%</span>
              </div>
            </div>
            <p className="text-[11px] font-bold text-indigo-600 mt-3.5 tracking-wider flex items-center gap-1.5 animate-pulse">
              <i className="fa-solid fa-lock text-xs"></i> Encrypting Document...
            </p>
          </div>
        ) : (
          <button 
            onClick={handleProtectPdf} 
            disabled={!protectFile || !pdfPassword} 
            className="group relative cursor-pointer w-full h-10 sm:h-14 rounded-[1.25rem] bg-slate-950 text-white text-xs sm:text-sm font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_12px_40px_-10px_rgba(79,70,229,0.4)] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              <i className="fa-solid fa-lock group-hover:-translate-y-0.5 transition-transform duration-300"></i> Encrypt & Download
            </span>
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* --- UNLOCK PDF MODAL --- */}
{isUnlockModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all duration-500" onClick={closeOverlay}>
    <div 
      className="relative w-[92%] max-w-md bg-white/90 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-[0_24px_70px_-15px_rgba(6,182,212,0.25)] border border-white/80 overflow-hidden animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-500 ease-out mobile-fullscreen-modal" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Ambient Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 pointer-events-none animate-pulse"></div>

      <div className="relative z-10 flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight font-sans">
          Unlock PDF
        </h2>
        <button onClick={closeOverlay} className="group w-9 h-9 sm:w-10 cursor-pointer sm:h-10 rounded-full bg-slate-50 hover:bg-cyan-50 border border-slate-200/80 hover:border-cyan-200 transition-all duration-300 flex items-center justify-center">
          <i className="fa-solid fa-xmark text-slate-400 group-hover:text-cyan-500 group-hover:rotate-90 transition-all duration-300 text-sm"></i>
        </button>
      </div>
      
      <div className="relative z-10 flex flex-col gap-5 sm:gap-6">

        {!unlockPreviewUrl && (
          <div 
            className={`group relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border-2   transition-all duration-500 p-6 sm:p-8 text-center
              ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
              ${isUnlockDragActive ? 'border-cyan-500 bg-cyan-50/80 scale-[1.01] shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-slate-200 hover:border-cyan-400 bg-gradient-to-b from-slate-50/50 to-transparent hover:shadow-[0_12px_30px_rgba(6,182,212,0.05)]'}
            `}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsUnlockDragActive(true); }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsUnlockDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsUnlockDragActive(false); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsUnlockDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setUnlockFile(e.dataTransfer.files[0]);
                setUnlockPreviewUrl(null); 
                setIsPasswordError(false);
              }
            }}
          >
            <input 
              type="file" accept=".pdf" id="pdf-unlock-upload" className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUnlockFile(e.target.files[0]);
                  setUnlockPreviewUrl(null); 
                  setIsPasswordError(false);
                }
              }} 
              disabled={isProcessing}
            />
            <label htmlFor="pdf-unlock-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
              {unlockFile ? (
                <div className="w-full text-left bg-white p-4 rounded-xl shadow-sm border border-slate-100 transform transition-all">
                  <p className="font-bold text-[10px] sm:text-xs text-cyan-800 uppercase tracking-wider mb-2">Selected File</p>
                  <div className="bg-slate-50 p-0 rounded-lg flex items-center gap-3 border border-slate-100/70">
                    <i className="fa-solid fa-file-shield text-cyan-500 text-xl flex-shrink-0"></i>
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-semibold text-slate-700 truncate">{unlockFile.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{(unlockFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`transform transition-all duration-500 ${isUnlockDragActive ? '-translate-y-1' : 'group-hover:-translate-y-1'}`}>
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl shadow-sm flex items-center justify-center mb-3.5 border relative overflow-hidden transition-all duration-500
                    ${isUnlockDragActive ? 'bg-cyan-100 text-cyan-600 border-cyan-200 scale-105' : 'bg-white text-slate-400 border-slate-200 group-hover:border-cyan-200 group-hover:text-cyan-500'}
                  `}>
                    <i className={`fa-solid fa-cloud-arrow-up text-xl sm:text-2xl relative z-10 transition-transform duration-500 ${isUnlockDragActive ? 'animate-bounce' : 'group-hover:scale-105'}`}></i>
                  </div>
                  <p className="text-slate-400 text-[11px] sm:text-xs mt-1 font-normal max-w-[240px] mx-auto leading-normal">Select a single protected document to unlock</p>
                </div>
              )}
              <div className="mt-5 px-5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 group-hover:text-cyan-600 group-hover:border-cyan-200 font-semibold text-xs shadow-sm transition-all duration-300 transform group-hover:scale-[1.02]">
                {unlockFile ? <span><i className="fa-solid fa-folder-open mr-1.5"></i>Change File</span> : <span><i className="fa-solid fa-folder-open mr-1.5"></i>Browse File</span>}
              </div>
            </label>
          </div>
        )}

        {/* Step 2: Password Input */}
        {unlockFile && !unlockPreviewUrl && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="text-[10px] sm:text-xs font-bold text-slate-700 tracking-wide">Enter Current Password</label>
            <div className={`relative flex items-center bg-slate-50/50 rounded-xl border transition-all focus-within:bg-white focus-within:shadow-sm ${isPasswordError ? 'border-red-400 focus-within:border-red-500' : 'border-slate-200/80 focus-within:border-cyan-400'}`}>
              <span className={`absolute left-4 text-xs sm:text-sm ${isPasswordError ? 'text-red-400' : 'text-slate-400'}`}>
                <i className="fa-solid fa-key"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Current document password..."
                value={unlockPassword}
                onChange={(e) => { setUnlockPassword(e.target.value); setIsPasswordError(false); }}
                disabled={isProcessing}
                className={`w-full h-11 sm:h-12 pl-10 pr-12 text-xs sm:text-sm bg-transparent outline-none font-medium ${isPasswordError ? 'text-red-900 placeholder-red-300' : 'text-slate-800 placeholder-slate-400'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-4 cursor-pointer transition-colors text-xs sm:text-sm ${isPasswordError ? 'text-red-400 hover:text-red-600' : 'text-slate-400 hover:text-cyan-600'}`}>
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {isPasswordError && <p className="text-[10px] sm:text-xs font-bold text-red-500 mt-0.5 animate-in slide-in-from-left-2"><i className="fa-solid fa-triangle-exclamation mr-1"></i> Incorrect password. Try again.</p>}

            <button 
              onClick={handleVerifyPassword} 
              disabled={!unlockPassword || isProcessing} 
              className="group relative w-full h-10 cursor-pointer sm:h-12 mt-3 sm:mt-4 rounded-[1.25rem] bg-slate-900 text-white text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_8px_30px_-8px_rgba(6,182,212,0.4)] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isProcessing ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Verifying...</> : 'Unlock & Preview'}
              </span>
            </button>
          </div>
        )}

        {/* Step 3: Success Preview & Download */}
        {unlockPreviewUrl && (
          <div className="flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-slate-50/80 border border-slate-100 rounded-[1.25rem] p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center text-lg sm:text-xl shadow-inner flex-shrink-0">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Access Granted</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">Document decrypted successfully</p>
                </div>
              </div>
            </div>

            {unlockPreviewUrl !== 'NOT_ENCRYPTED' && (
              <div className="border border-slate-100 bg-white rounded-[1.25rem] p-3 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-2 sm:mb-3 text-center">Document Preview</p>
                <div className="aspect-[3/4] w-full max-w-[140px] sm:max-w-[160px] mx-auto bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm group relative">
                  <img src={unlockPreviewUrl} alt="PDF Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            )}

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-2xl border border-slate-100/80 animate-in fade-in zoom-in-95 duration-300">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      className="stroke-cyan-500 transition-all duration-300 ease-out" 
                      strokeWidth="6" 
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * progress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-base sm:text-lg font-black text-slate-800 font-mono tracking-tighter">{progress}%</span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-cyan-600 mt-3.5 tracking-wider flex items-center gap-1.5 animate-pulse">
                  <i className="fa-solid fa-unlock-keyhole text-xs"></i> Removing Security...
                </p>
              </div>
            ) : (
              <button
                onClick={handleRemovePassword}
                className="group relative w-full cursor-pointer h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-950 text-white text-xs sm:text-sm font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_12px_40px_-10px_rgba(6,182,212,0.4)] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <i className="fa-solid fa-download group-hover:-translate-y-0.5 transition-transform duration-300"></i> Remove Password & Download
                </span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  </div>
)}

{/* --- CHANGE PASSWORD MODAL --- */}
{isChangePwdModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all duration-500" onClick={closeOverlay}>
    <div 
      className="relative w-[92%] max-w-md bg-white/90 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-[0_24px_70px_-15px_rgba(244,63,94,0.25)] border border-white/80 overflow-hidden animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-500 ease-out mobile-fullscreen-modal" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Ambient Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 pointer-events-none animate-pulse"></div>

      <div className="relative z-10 flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight font-sans">
          Change Password
        </h2>
        <button onClick={closeOverlay} className="group w-9 h-9 sm:w-10 cursor-pointer sm:h-10 rounded-full bg-slate-50 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-all duration-300 flex items-center justify-center">
          <i className="fa-solid fa-xmark text-slate-400 group-hover:text-rose-500 group-hover:rotate-90 transition-all duration-300 text-sm"></i>
        </button>
      </div>
      
      <div className="relative z-10 flex flex-col gap-5 sm:gap-6">

        {/* Step 1: Upload */}
        {!changePreviewUrl && (
          <div 
            className={`group relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border-2   transition-all duration-500 p-6 sm:p-8 text-center
              ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
              ${isChangeDragActive ? 'border-rose-500 bg-rose-50/80 scale-[1.01] shadow-[0_0_30px_rgba(244,63,94,0.15)]' : 'border-slate-200 hover:border-rose-400 bg-gradient-to-b from-slate-50/50 to-transparent hover:shadow-[0_12px_30px_rgba(244,63,94,0.05)]'}
            `}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsChangeDragActive(true); }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsChangeDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsChangeDragActive(false); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsChangeDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setChangeFile(e.dataTransfer.files[0]);
                setChangePreviewUrl(null); 
                setIsChangeError(false);
              }
            }}
          >
            <input 
              type="file" accept=".pdf" id="pdf-change-upload" className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setChangeFile(e.target.files[0]);
                  setChangePreviewUrl(null); 
                  setIsChangeError(false);
                }
              }} 
              disabled={isProcessing}
            />
            <label htmlFor="pdf-change-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
              {changeFile ? (
                <div className="w-full text-left bg-white p-4 rounded-xl shadow-sm border border-slate-100 transform transition-all">
                  <p className="font-bold text-[10px] sm:text-xs text-rose-800 tracking-wider mb-2">Selected File</p>
                  <div className="bg-slate-50 p-0 rounded-lg flex items-center gap-3 border border-slate-100/70">
                    <i className="fa-solid fa-file-pdf text-rose-500 text-xl flex-shrink-0"></i>
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-semibold text-slate-700 truncate">{changeFile.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{(changeFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`transform transition-all duration-500 ${isChangeDragActive ? '-translate-y-1' : 'group-hover:-translate-y-1'}`}>
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl shadow-sm flex items-center justify-center mb-3.5 border relative overflow-hidden transition-all duration-500
                    ${isChangeDragActive ? 'bg-rose-100 text-rose-600 border-rose-200 scale-105' : 'bg-white text-slate-400 border-slate-200 group-hover:border-rose-200 group-hover:text-rose-500'}
                  `}>
                    <div className="absolute inset-0 bg-rose-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <i className={`fa-solid fa-cloud-arrow-up text-xl sm:text-2xl relative z-10 transition-transform duration-500 ${isChangeDragActive ? 'animate-bounce' : 'group-hover:scale-105'}`}></i>
                  </div>
                  <p className="text-slate-400 text-[11px] sm:text-xs mt-1 font-normal max-w-[240px] mx-auto leading-normal">Select the encrypted file you want to update</p>
                </div>
              )}
              <div className="mt-5 px-5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 group-hover:text-rose-600 group-hover:border-rose-200 font-semibold text-xs shadow-sm transition-all duration-300 transform group-hover:scale-[1.02]">
                {changeFile ? <span><i className="fa-solid fa-folder-open mr-1.5"></i>Change File</span> : <span><i className="fa-solid fa-folder-open mr-1.5"></i>Browse File</span>}
              </div>
            </label>
          </div>
        )}

        {/* Step 2: Verify Old Password */}
        {changeFile && !changePreviewUrl && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="text-[10px] sm:text-xs font-bold text-slate-700 tracking-wide">Enter Current Password</label>
            <div className={`relative flex items-center bg-slate-50/50 rounded-xl border transition-all focus-within:bg-white focus-within:shadow-sm ${isChangeError ? 'border-red-400 focus-within:border-red-500' : 'border-slate-200/80 focus-within:border-rose-400'}`}>
              <span className={`absolute left-4 text-xs sm:text-sm ${isChangeError ? 'text-red-400' : 'text-slate-400'}`}>
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type={showOldPassword ? 'text' : 'password'}
                placeholder="Current document password..."
                value={oldPassword}
                onChange={(e) => { setOldPassword(e.target.value); setIsChangeError(false); }}
                disabled={isProcessing}
                className={`w-full h-11 sm:h-12 pl-10 pr-12 text-xs sm:text-sm bg-transparent outline-none font-medium ${isChangeError ? 'text-red-900 placeholder-red-300' : 'text-slate-800 placeholder-slate-400'}`}
              />
              <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className={`absolute right-4 cursor-pointer transition-colors text-xs sm:text-sm ${isChangeError ? 'text-red-400 hover:text-red-600' : 'text-slate-400 hover:text-rose-600'}`}>
                <i className={`fa-solid ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {isChangeError && <p className="text-[10px] sm:text-xs font-bold text-red-500 mt-0.5 animate-in slide-in-from-left-2"><i className="fa-solid fa-triangle-exclamation mr-1"></i> Incorrect password. Try again.</p>}

            <button 
              onClick={handleChangeVerify} 
              disabled={!oldPassword || isProcessing} 
              className="group relative w-full cursor-pointer h-10 sm:h-12 mt-3 sm:mt-4 rounded-[1.25rem] bg-slate-900 text-white text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_8px_30px_-8px_rgba(244,63,94,0.4)] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isProcessing ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Verifying...</> : 'Verify Access'}
              </span>
            </button>
          </div>
        )}

        {/* Step 3: Success Preview & New Password Generation */}
        {changePreviewUrl && (
          <div className="flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex gap-3 sm:gap-4 items-stretch bg-slate-50/80 border border-slate-100 p-3 sm:p-4 rounded-[1.25rem]">
              {/* Tiny Preview Box */}
              {changePreviewUrl !== 'NOT_ENCRYPTED' && (
                <div className="w-12 h-16 sm:w-14 sm:h-[4.5rem] rounded-lg overflow-hidden shadow-sm border border-slate-200 bg-white flex-shrink-0">
                  <img src={changePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              
              {/* Status Text */}
              <div className="flex-1 flex flex-col justify-center">
                <p className="font-bold text-emerald-600 text-xs sm:text-sm flex items-center gap-1.5"><i className="fa-solid fa-shield-check text-base"></i> Access Verified</p>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight mt-1">You may now apply a new high-security layer to this document.</p>
              </div>
            </div>

            {/* New Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] sm:text-xs font-bold text-slate-700 tracking-wide">Set New Password</label>
              <div className="relative flex items-center bg-slate-50/50 rounded-xl border border-slate-200/80 transition-all focus-within:border-rose-400 focus-within:bg-white focus-within:shadow-sm">
                <span className="absolute left-4 text-rose-400 text-xs sm:text-sm">
                  <i className="fa-solid fa-key"></i>
                </span>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter robust new password..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isProcessing}
                  className="w-full h-11 sm:h-12 pl-10 pr-12 text-xs sm:text-sm bg-transparent outline-none font-medium text-slate-800 placeholder-slate-400"
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 cursor-pointer text-slate-400 hover:text-rose-600 transition-colors text-xs sm:text-sm">
                  <i className={`fa-solid ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-2xl border border-slate-100/80 animate-in fade-in zoom-in-95 duration-300 mt-2">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      className="stroke-rose-500 transition-all duration-300 ease-out" 
                      strokeWidth="6" 
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * progress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-base sm:text-lg font-black text-slate-800 font-mono tracking-tighter">{progress}%</span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-rose-600 mt-3.5 tracking-wider flex items-center gap-1.5 animate-pulse">
                  <i className="fa-solid fa-lock text-xs"></i> Encrypting...
                </p>
              </div>
            ) : (
              <button
                onClick={handleChangePasswordSubmit}
                disabled={!newPassword}
                className="group relative w-full h-12 cursor-pointer sm:h-14 mt-2 rounded-xl sm:rounded-2xl bg-slate-950 text-white text-xs sm:text-sm font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_12px_40px_-10px_rgba(244,63,94,0.4)] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <i className="fa-solid fa-floppy-disk group-hover:-translate-y-0.5 transition-transform duration-300"></i> Update Security & Download
                </span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  </div>
)}

{/* --- PDF TO POWERPOINT MODAL --- */}
{isPdfToPptModalOpen && (
  <div 
    className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 md:p-10 bg-slate-950/60 backdrop-blur-xl transition-all duration-500 animate-in fade-in"
    onClick={closeOverlay}
  >
    <div 
      className="relative w-full max-w-lg bg-gradient-to-b from-white via-white/95 to-slate-50/90 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_50px_100px_-20px_rgba(249,115,22,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/80 overflow-hidden transform transition-all duration-500 animate-in fade-in zoom-in-[0.95] mobile-fullscreen-modal" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mix-blend-multiply filter blur-[90px] opacity-25 animate-pulse pointer-events-none"></div>

      <div className="relative z-10 flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tight drop-shadow-sm font-sans">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-orange-900">PDF to PPTX</span>
        </h2>
        <button onClick={closeOverlay} className="group w-11 h-11 rounded-full cursor-pointer bg-white hover:bg-orange-50 border border-slate-200/80 hover:border-orange-200 shadow-sm transition-all duration-300 flex items-center justify-center">
          <i className="fa-solid fa-xmark text-slate-400 group-hover:text-orange-500 group-hover:rotate-90 transition-all duration-300"></i>
        </button>
      </div>
      
      <div className="relative z-10 flex flex-col gap-6">

        {pptProtectedError ? (
          <div className="bg-white/80 backdrop-blur-md border border-red-200 rounded-3xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 border border-red-200">
              <i className="fa-solid fa-lock animate-pulse"></i>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Encrypted Document</h3>
            <p className="text-xs text-slate-500 font-medium mb-6">Password needed for <span className="font-bold text-red-500">{pptProtectedError}</span>.</p>
            <div className="flex flex-col gap-3">
              <button onClick={goToUnlockTool} className="w-full h-12 rounded-2xl cursor-pointer bg-slate-900 text-white text-sm font-bold hover:bg-orange-600 transition-colors">Go to Unlock PDF</button>
              <button onClick={() => { setPptProtectedError(null); setPdfToPptFiles([]); }} className="text-xs font-bold cursor-pointer text-slate-400 hover:text-slate-600">Upload Different File</button>
            </div>
          </div>
        ) : (
          <>
            <div 
              className={`group relative overflow-hidden  rounded-[1.25rem] border-2   transition-all duration-500 p-6 sm:p-8 text-center transform hover:scale-[1.01] active:scale-[0.99]
                ${isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
                ${isPptDragActive ? 'border-orange-500 bg-orange-50/60 shadow-[0_25px_50px_-12px_rgba(249,115,22,0.2)] scale-[1.02]' : 'border-slate-200 hover:border-orange-400/80 bg-gradient-to-b from-white to-slate-50/20'}
              `}
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsPptDragActive(true); }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsPptDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsPptDragActive(false); }}
              onDrop={(e) => {
                e.preventDefault(); e.stopPropagation(); setIsPptDragActive(false);
                if (e.dataTransfer.files?.length) setPdfToPptFiles(Array.from(e.dataTransfer.files));
              }}
            >
              <input type="file" accept=".pdf" id="pdf-to-ppt-upload" className="hidden" onChange={(e) => { if (e.target.files?.length) setPdfToPptFiles(Array.from(e.target.files)); }} disabled={isProcessing}/>
              <label htmlFor="pdf-to-ppt-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                {pdfToPptFiles.length > 0 ? (
                  <div className="w-full text-left bg-white/90 p-5 rounded-2xl shadow-sm border border-slate-100">
                    <p className="font-black text-xs text-orange-600 tracking-widest mb-3">Presentations mapped ({pdfToPptFiles.length})</p>
                    <div className="max-h-36 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {pdfToPptFiles.map((f, i) => (
                        <div key={i} className="bg-slate-50/80 p-0 rounded-xl flex items-center border border-slate-100 shadow-sm">
                          <i className="fa-solid fa-file-powerpoint text-orange-600 mr-3"></i>
                          <span className="text-xs font-bold text-slate-700 truncate">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`transform transition-all duration-500 ${isPptDragActive ? '-translate-y-2' : 'group-hover:-translate-y-2'}`}>
                    <div className={`w-20 h-20 mx-auto rounded-2.5xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center mb-5 border relative overflow-hidden transition-all duration-500
                      ${isPptDragActive ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white border-orange-400 scale-110' : 'bg-white text-orange-500 border-slate-100'}
                    `}>
                      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <i className={`fa-solid fa-cloud-arrow-up text-3xl relative z-10 transition-all duration-500 ${isPptDragActive ? 'text-white' : 'group-hover:text-white group-hover:scale-110'}`}></i>
                    </div>
                     <p className="text-slate-400 text-[11px] sm:text-xs mt-1 font-normal max-w-[240px] mx-auto leading-normal">Select the file you want to convert to Power-Point</p>
                  </div>
                )}
                <div className={`mt-6 px-6 py-1 rounded-xl border font-bold text-xs shadow-sm transition-all duration-300 transform group-hover:scale-[1.03]
                  ${pdfToPptFiles.length > 0 ? 'bg-white text-slate-700 border-slate-200' : 'bg-orange-500 text-white border-orange-500'}
                `}>{pdfToPptFiles.length > 0 ? <span><i className="fa-solid fa-folder-open mr-1.5"></i>Change File</span> : <span><i className="fa-solid fa-folder-open mr-1.5"></i>Browse File</span>}</div>
              </label>
            </div>

            {isProcessing ? (
              <div className="relative overflow-hidden bg-white rounded-3xl p-1 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                <div className="relative flex items-center justify-center w-24 h-24 mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="7" fill="transparent" />
                    <circle cx="50" cy="50" r="40" stroke="url(#orangeGlow)" strokeWidth="7" fill="transparent" strokeDasharray="251.32" strokeDashoffset={251.32 - (251.32 * progress) / 100} strokeLinecap="round" className="transition-all style-none duration-300 ease-out" />
                    <defs><linearGradient id="orangeGlow" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-900 tracking-tighter">{progress}%</span>
                  </div>
                </div>
                <p className="text-xs font-black text-slate-800 animate-pulse"><i className="fa-solid fa-layer-group text-orange-500"></i> Rendering PPTX Engine...</p>
              </div>
            ) : (
              <button onClick={handlePdfToPpt} disabled={pdfToPptFiles.length === 0} className="group relative w-full cursor-pointer h-10 h-10 rounded-[1.25rem] bg-slate-900 text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-500 overflow-hidden hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 disabled:hidden"></div>
                <span className="relative z-10 flex items-center justify-center gap-2.5 h-full">Convert & Download PPTX</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  </div>
)}

{isQrScannerModalOpen && (
  <div 
    className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 md:p-10 bg-slate-950/60 backdrop-blur-xl transition-all duration-500 animate-in fade-in"
    onClick={() => setIsQrScannerModalOpen(false)}
  >
    {/* Body Scroll Lock for iOS/Mobile */}
    <style dangerouslySetInnerHTML={{__html: `body { overflow: hidden !important; }` }} />

    <div 
      className="relative w-full max-w-lg bg-gradient-to-b from-white via-white/95 to-slate-50/90 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_50px_100px_-20px_rgba(20,184,166,0.25),inset_0_1px_1px_rgba(255,255,255,0.8),0_0_1px_1px_rgba(20,184,166,0.1)] border border-white/80 overflow-hidden transform transition-all duration-500 animate-in fade-in zoom-in-[0.95] slide-in-from-bottom-8 ease-[cubic-bezier(0.34,1.56,0.64,1)] mobile-fullscreen-modal select-none" 
      style={{ perspective: '1000px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 3D Ambient Holographic Glows */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-[90px] opacity-25 pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-cyan-400 to-teal-400 rounded-full mix-blend-multiply filter blur-[90px] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tight drop-shadow-sm font-sans">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900">QR Scanner</span>
        </h2>
        <button 
          onClick={() => setIsQrScannerModalOpen(false)} 
          className="group w-11 h-11 cursor-pointer rounded-full bg-white hover:bg-teal-50 border border-slate-200/80 hover:border-teal-200 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 flex items-center justify-center"
        >
          <i className="fa-solid fa-xmark text-slate-400 group-hover:text-teal-500 group-hover:rotate-90 transition-all duration-300"></i>
        </button>
      </div>
      
      {/* Modal Content */}
      <div className="relative z-10 flex flex-col gap-6">
        {!qrResult ? (
          // Active Scanner View
          <div className="flex flex-col gap-5">
            <div className="relative group overflow-hidden rounded-[1.5rem] bg-white border-2 border-teal-100 shadow-[0_15px_40px_-15px_rgba(20,184,166,0.15)] ring-4 ring-teal-50 transition-all duration-500 hover:border-teal-300 hover:shadow-[0_20px_50px_-15px_rgba(20,184,166,0.25)]">
              <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none z-0"></div>
              <div id="qr-reader" className="w-full relative z-10 [&>div]:!border-none [&>div]:!shadow-none"></div>
            </div>

            {/* Premium Image File Button */}
            <label className="group relative w-full cursor-pointer h-14 rounded-[1.25rem] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-700/50 text-white transition-all duration-500 overflow-hidden shadow-[0_10px_20px_-10px_rgba(15,23,42,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(20,184,166,0.3)] hover:-translate-y-0.5 active:translate-y-0 hover:border-teal-500/50 flex items-center justify-center">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex items-center justify-center gap-3 tracking-wide font-extrabold text-sm w-full">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/5 group-hover:bg-teal-500/20 group-hover:border-teal-400/30 transition-all duration-500">
                  <i className="fa-regular fa-image text-slate-300 group-hover:text-teal-300 transition-colors duration-300"></i>
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 group-hover:to-white transition-all duration-300">
                  Scan from Image File
                </span>
              </div>

              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log("Image selected for scanning:", file.name);
                  }
                }} 
              />
            </label>
          </div>
        ) : (
          // Success Result View with Options
          <div className="flex flex-col items-center text-center p-6 sm:p-8 rounded-[1.5rem] bg-gradient-to-b from-teal-50/80 to-white border border-teal-200/60 shadow-[0_20px_40px_-15px_rgba(20,184,166,0.12)] animate-in zoom-in-95 duration-500">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-600 flex items-center justify-center text-2xl sm:text-3xl mb-4 shadow-inner border border-teal-200/50">
              <i className="fa-solid fa-check-circle animate-bounce"></i>
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1">Scan Successful!</h3>
            <p className="text-slate-500 text-xs sm:text-sm mb-5 font-medium">Your QR code has been decoded successfully.</p>
            
            {/* Decoded Result Box */}
            <div className="w-full bg-slate-50/90 border border-slate-200/80 p-3.5 rounded-xl text-center mb-5 shadow-inner relative group transition-all duration-300 hover:bg-white">
              <div className="absolute inset-y-0 left-0 w-1.5 bg-teal-500 rounded-l-xl"></div>
              <p className="text-slate-800 text-xs sm:text-sm font-semibold break-all select-all px-2 font-mono">{qrResult}</p>
            </div>

            {/* ACTION OPTIONS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-5">
              {/* Open in Chrome / Browser */}
              <button 
                onClick={() => window.open(qrResult.startsWith('http') ? qrResult : `https://${qrResult}`, '_blank', 'noopener,noreferrer')}
                className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:border-teal-300 hover:bg-teal-50/50 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
                title="Open Link"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-100/60 text-teal-700 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                  <i className="fa-brands fa-chrome text-base"></i>
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-teal-900">Open Link</span>
              </button>

              {/* Copy Link */}
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(qrResult);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
                title="Copy to Clipboard"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100/60 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} text-base`}></i>
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-emerald-900">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>

              {/* Share via WhatsApp */}
              <button 
                onClick={() => {
                  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(qrResult)}`;
                  window.open(waUrl, '_blank');
                }}
                className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
                title="Share via WhatsApp"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <i className="fa-brands fa-whatsapp text-base"></i>
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-emerald-900">WhatsApp</span>
              </button>

              {/* Share via Email */}
              <button 
                onClick={() => {
                  const mailtoUrl = `mailto:?subject=${encodeURIComponent('Scanned QR Link')}&body=${encodeURIComponent(qrResult)}`;
                  window.location.href = mailtoUrl;
                }}
                className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 hover:bg-sky-50/50 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
                title="Share via Email"
              >
                <div className="w-9 h-9 rounded-lg bg-sky-100/80 text-sky-600 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                  <i className="fa-solid fa-envelope text-base"></i>
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-sky-900">Email</span>
              </button>
            </div>

            {/* Scan Another Button */}
            <button 
              onClick={() => { 
                setQrResult(''); 
                setIsQrScannerModalOpen(false); 
                setTimeout(() => setIsQrScannerModalOpen(true), 10); 
              }}
              className="group relative w-full cursor-pointer h-12 rounded-[1.25rem] bg-slate-900 text-white text-sm font-bold transition-all duration-500 overflow-hidden shadow-[0_15px_30px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(20,184,166,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center justify-center gap-2.5 tracking-wide font-extrabold h-full">
                <i className="fa-solid fa-rotate-right opacity-70 group-hover:-rotate-180 transition-transform duration-500"></i> Scan Another Code
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}
      {/* --- PREMIUM PRICING MODAL (LIGHT THEME) --- */}
{isPricingModalOpen && (
  <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-500 p-2 sm:p-4" onClick={closeOverlay}>
    <div 
      className="relative max-w-lg w-full max-h-full flex flex-col bg-white/60 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-1 sm:p-1.5 shadow-[0_30px_100px_-15px_rgba(245,158,11,0.25)] border border-white overflow-hidden animate-in fade-in zoom-in-[0.95] slide-in-from-bottom-8 duration-500 ease-out mobile-fullscreen-modal" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Animated Golden Border Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-300 via-orange-400 to-amber-300 opacity-30 animate-[spin_4s_linear_infinite]" style={{ margin: '-50%' }}></div>
      
      {/* Inner Light Container (Added overflow-y-auto for max-height handling) */}
      <div className="relative bg-white rounded-[1.8rem] sm:rounded-[2.2rem] w-full h-full p-4 sm:p-8 flex flex-col border border-white shadow-inner overflow-y-auto">
        
        {/* Close Button */}
        <button onClick={closeOverlay} className="absolute top-3 right-3 cursor-pointer sm:top-6 sm:right-6 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center z-20 border border-slate-200 hover:border-red-200">
          <i className="fa-solid fa-xmark text-sm sm:text-base"></i>
        </button>

        {/* Header */}
        <div className="text-center mt-1 sm:mt-2 mb-4 sm:mb-5 z-10">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 shadow-inner mb-2 sm:mb-4 border border-amber-200/50 text-amber-500">
            <i className="fa-solid fa-crown text-lg sm:text-2xl drop-shadow-sm"></i>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight mb-1 sm:mb-2">RemoPDF <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Premium</span></h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Unlock the ultimate document & career arsenal.</p>
        </div>

        {/* Promotional Free Banner */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 relative overflow-hidden shadow-sm z-10">
          <div className="absolute -right-4 -top-4 w-12 h-12 sm:w-16 sm:h-16 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="flex items-start gap-2 sm:gap-3 relative z-10">
            <div className="mt-0.5 text-emerald-500"><i className="fa-solid fa-gift text-base sm:text-lg drop-shadow-sm"></i></div>
            <div>
              <p className="text-xs sm:text-sm font-black text-emerald-900 tracking-tight">Everything is Free Right Now!</p>
              <p className="text-[10px] sm:text-xs font-semibold text-emerald-700/80 mt-1 leading-relaxed">Enjoy full access to all premium features at absolutely zero cost. Paid subscriptions will officially launch on <strong className="text-emerald-800">September 1, 2026</strong>.</p>
            </div>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="relative flex items-center bg-slate-100 rounded-full p-1 mx-auto mb-4 sm:mb-6 w-fit border border-slate-200 z-10 shadow-inner">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full transition-all duration-300 shadow-sm border border-slate-200 ${isAnnual ? 'left-[50%]' : 'left-1'}`}
          ></div>
          <button 
            onClick={() => setIsAnnual(false)}
            className={`relative z-10 px-4 sm:px-6 py-1.5 cursor-pointer sm:py-2 text-[10px] sm:text-xs font-bold rounded-full transition-colors duration-300 ${!isAnnual ? 'text-gray-900' : 'text-slate-500 hover:text-gray-700'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`relative z-10 px-4 sm:px-6 py-1.5 sm:py-2 cursor-pointer text-[10px] sm:text-xs font-bold rounded-full transition-colors duration-300 ${isAnnual ? 'text-gray-900' : 'text-slate-500 hover:text-gray-700'}`}
          >
            Annually <span className="absolute -top-2 sm:-top-3 -right-1 sm:-right-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded-full shadow-lg border border-red-400">-40%</span>
          </button>
        </div>

        {/* Price Display */}
        <div className="text-center mb-4 sm:mb-6 z-10">
          <div className="flex items-start justify-center gap-1 opacity-40 relative inline-block">
            {/* Strikethrough line for the free promo */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 sm:h-1 bg-red-500 -rotate-6 transform -translate-y-1/2 rounded-full"></div>
            <span className="text-slate-400 font-bold mt-1 sm:mt-2 text-sm sm:text-lg">R</span>
            <span className="text-4xl sm:text-5xl font-black text-gray-400 tracking-tighter">
              {isAnnual ? '425' : '59'}
            </span>
          </div>
          <p className="text-emerald-600 text-[9px] sm:text-xs font-black mt-1 uppercase tracking-widest bg-emerald-50 py-0.5 sm:py-1 px-2 sm:px-3 rounded-full inline-block border border-emerald-100">
            R0.00 Due Today
          </p>
        </div>

        {/* Feature List */}
        <div className="bg-slate-50/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 mb-4 sm:mb-6 z-10">
          <p className="text-[9px] sm:text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3 sm:mb-4">Future Premium Access Includes:</p>
          <ul className="space-y-2.5 sm:space-y-3.5">
            <li className="flex items-start gap-2 sm:gap-3">
              <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5 text-xs sm:text-sm"></i>
              <span className="text-xs sm:text-sm font-medium text-slate-600">Completely <span className="text-gray-900 font-bold">Ad-Free Experience</span></span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5 text-xs sm:text-sm"></i>
              <span className="text-xs sm:text-sm font-medium text-slate-600">Convert PDF to <span className="text-gray-900 font-bold">Word, Excel, & PPT</span></span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5 text-xs sm:text-sm"></i>
              <span className="text-xs sm:text-sm font-medium text-slate-600">Secure <span className="text-gray-900 font-bold">Cloud Data Storage</span></span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5 text-xs sm:text-sm"></i>
              <span className="text-xs sm:text-sm font-medium text-slate-600">Exclusive <span className="text-gray-900 font-bold">Premium Resume Templates</span></span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5 text-xs sm:text-sm"></i>
              <span className="text-xs sm:text-sm font-medium text-slate-600"><span className="text-gray-900 font-bold">Smart ATS Score Checker</span> & tracking</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5 text-xs sm:text-sm"></i>
              <span className="text-xs sm:text-sm font-medium text-slate-600">AI-Powered <span className="text-gray-900 font-bold">Advanced Career Suggestions</span></span>
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <button onClick={closeOverlay} className="relative w-full cursor-pointer h-11 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white text-xs sm:text-sm font-black shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.7)] transition-all duration-500 transform hover:-translate-y-1 z-10 overflow-hidden group bg-[length:200%_auto] hover:bg-right shrink-0">
          <span className="relative z-10 flex items-center justify-center gap-2">
            Continue for Free <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </span>
        </button>
        
      </div>
    </div>
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