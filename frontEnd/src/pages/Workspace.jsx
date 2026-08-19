import React from 'react';

export default function Workspace() {
    return (
        // Adjusted padding for smaller screens
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 font-['Outfit',sans-serif] overflow-hidden relative">
            
            {/* Scaled down background blobs for mobile */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-orange-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-orange-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Scaled padding and border-radius for mobile */}
            <div className="relative max-w-2xl w-full p-6 sm:p-10 md:p-14 rounded-3xl md:rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_60px_-15px_rgba(249,115,22,0.15)] text-center transform transition-all duration-700 hover:scale-[1.01]">
                
                {/* Animated Maintenance Icon - slightly smaller on mobile */}
                <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8 rounded-full bg-orange-50 flex items-center justify-center shadow-inner relative group cursor-default">
                    <div className="absolute inset-0 rounded-full border-2 border-orange-200 border-dashed animate-[spin_10s_linear_infinite]"></div>
                    <svg 
                        className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 transform transition-transform duration-500 group-hover:scale-110" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="1.5" 
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="1.5" 
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </div>

                {/* Fixed Typography: Smoothly scales from text-3xl up to text-5xl */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 sm:mb-5 text-gray-900 leading-tight">
                    We're building something <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">better.</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-10 font-medium max-w-lg mx-auto leading-relaxed">
                    The RemoPDF Workspace is currently undergoing essential maintenance to bring you a premium editing experience.
                </p>

                {/* Interactive Date Card */}
                <div className="relative inline-block w-full max-w-sm mx-auto group mb-8 sm:mb-10 cursor-default">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative p-1 rounded-2xl bg-gradient-to-br from-orange-100 to-white border border-orange-100 transform transition-transform duration-300 group-hover:-translate-y-1 shadow-xl">
                        {/* Adjusted inner padding for mobile */}
                        <div className="px-6 py-5 sm:px-8 sm:py-6 rounded-xl bg-white">
                            <p className="text-xs sm:text-sm uppercase tracking-widest text-orange-500 mb-1 sm:mb-2 font-bold">
                                Editor Available On
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">
                                September 1, 2026
                            </p>
                        </div>
                    </div>
                </div>

                {/* Animated Button */}
                <div className="pt-6 sm:pt-8 border-t border-gray-100 flex justify-center">
                    <button 
                        onClick={() => window.history.back()}
                        // Made button span full width on tiny screens (w-full sm:w-auto)
                        className="w-full sm:w-auto group relative px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-gray-900 text-white font-bold tracking-wide overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] focus:outline-none focus:ring-4 focus:ring-orange-500/30"
                    >
                        <span className="relative z-10 group-hover:text-orange-400 transition-colors duration-300">Return to Homepage</span>
                        <div className="absolute inset-0 h-full w-full bg-gray-800 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
                    </button>
                </div>
            </div>
        </div>
    );
}