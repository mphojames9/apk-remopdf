import React, { useEffect, useRef } from 'react';

export default function ModalAd() {
  const adContainerRef = useRef(null);

  useEffect(() => {
    // Check to ensure we don't inject the script multiple times (important for React StrictMode)
    if (adContainerRef.current && adContainerRef.current.children.length === 0) {
      
      // 1. Inject the configuration object
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        atOptions = {
          'key' : '20295a4659193cddc9243fd179563591',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      adContainerRef.current.appendChild(configScript);

      // 2. Inject the external invocation script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.async = true;
      invokeScript.src = "https://www.highperformanceformat.com/20295a4659193cddc9243fd179563591/invoke.js";
      adContainerRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    // We set explicit dimensions to prevent layout shifts while the ad loads
    <div 
      className="flex justify-center items-center w-full my-4" 
      style={{ minHeight: '50px' }}
    >
      <div ref={adContainerRef} id="container-20295a4659193cddc9243fd179563591"></div>
    </div>
  );
}