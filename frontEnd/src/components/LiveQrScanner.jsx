import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import '../pages/Workspace.css'

export default function PremiumQrScanner({ onScanSuccess, onClose }) {
  const [isStarting, setIsStarting] = useState(true);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    // Instantiate the headless scanner
    const html5QrCode = new Html5Qrcode("premium-reader");

    const config = {
      fps: 15, // Higher FPS for a smoother premium feel
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    // Start the camera facing the environment (rear camera on mobile)
    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        // Pause/stop immediately on success to freeze the frame
        if (html5QrCode.isScanning) {
          html5QrCode.stop().then(() => {
            onScanSuccess(decodedText);
          }).catch(console.error);
        }
      },
      (errorMessage) => {
        // Silently ignore background scanning noise
      }
    ).then(() => {
      setIsStarting(false);
    }).catch((err) => {
      setCameraError(true);
      setIsStarting(false);
      console.error("Camera startup error:", err);
    });

    // Cleanup camera stream on modal close
    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-md overflow-hidden bg-gray-900 border border-gray-700 shadow-2xl rounded-3xl animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-lg font-medium tracking-wide text-white">
            Scan QR Code
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-800 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scanner Body */}
        <div className="relative w-full aspect-square bg-black flex items-center justify-center overflow-hidden">
          
          {isStarting && !cameraError && (
            <div className="absolute z-20 flex flex-col items-center justify-center text-blue-500">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-sm font-medium text-gray-300">Accessing Camera...</p>
            </div>
          )}

          {cameraError && (
            <div className="absolute z-20 px-6 text-center text-red-400">
              <p>Camera access denied or unavailable. Please check permissions.</p>
            </div>
          )}

          {/* Video Feed Container */}
          <div id="premium-reader" className="absolute inset-0 w-full h-full object-cover"></div>

          {/* Premium UI Overlay */}
          {!isStarting && !cameraError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              
              {/* Viewfinder Window using shadow trick for darkened surroundings */}
              <div className="relative w-[250px] h-[250px] rounded-2xl shadow-[0_0_0_4000px_rgba(0,0,0,0.5)]">
                
                {/* Glowing Corner Accents */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl shadow-[-4px_-4px_12px_rgba(59,130,246,0.3)]"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl shadow-[4px_-4px_12px_rgba(59,130,246,0.3)]"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl shadow-[-4px_4px_12px_rgba(59,130,246,0.3)]"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-2xl shadow-[4px_4px_12px_rgba(59,130,246,0.3)]"></div>

                {/* Animated Laser Beam */}
                <div className="absolute left-2 right-2 h-[2px] bg-blue-500 shadow-[0_0_12px_3px_rgba(59,130,246,0.6)] animate-scan-laser rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 text-center bg-gray-900">
          <p className="text-sm text-gray-400">
            Align the QR code within the frame.<br/>It will scan automatically.
          </p>
        </div>
      </div>
    </div>
  );
}