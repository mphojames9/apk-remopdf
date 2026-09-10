import { useState } from 'react';
import { toast } from '../components/PremiumToast';

function QrGeneratorModal({ closeOverlay }) {
  
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'whatsapp' | 'email' | 'social'
  
  // Input fields
  const [urlInput, setUrlInput] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  // Social media inputs
  const [socialPlatform, setSocialPlatform] = useState('facebook'); // 'facebook' | 'twitter' | 'linkedin' | 'custom'
  const [socialUsername, setSocialUsername] = useState('');
  const [socialUrl, setSocialUrl] = useState('');

  // Share Modal Popup state
  const [showShareModal, setShowShareModal] = useState(false);

  // Helper to reset share state when inputs change
  const handleInputChange = (setter, value) => {
    setter(value);
    setShowShareModal(false);
  };
  
  // Constructed link target
  const getQrTargetUrl = () => {
    switch (activeTab) {
      case 'whatsapp': {
        const cleanedPhone = waPhone.replace(/[^0-9]/g, '');
        if (!cleanedPhone) return '';
        const encodedMsg = encodeURIComponent(waMessage);
        return `https://wa.me/${cleanedPhone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
      }
      case 'email': {
        if (!emailAddress) return '';
        const params = [];
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);
        return `mailto:${emailAddress}${params.length ? `?${params.join('&')}` : ''}`;
      }
      case 'social': {
        // Handle custom URL choice
        if (socialPlatform === 'custom') {
          if (!socialUrl.trim()) return '';
          return socialUrl.startsWith('http://') || socialUrl.startsWith('https://') 
            ? socialUrl.trim() 
            : `https://${socialUrl.trim()}`;
        }
        
        // Handle Platform usernames
        if (!socialUsername.trim()) return '';
        const user = socialUsername.trim();
        
        switch (socialPlatform) {
          case 'facebook': return `https://facebook.com/${user}`;
          case 'twitter': return `https://twitter.com/${user}`;
          case 'linkedin': return `https://linkedin.com/in/${user}`;
          default: return '';
        }
      }
      case 'url':
      default: {
        if (!urlInput.trim()) return '';
        return urlInput.startsWith('http://') || urlInput.startsWith('https://') 
          ? urlInput.trim() 
          : `https://${urlInput.trim()}`;
      }
    }
  };

  const qrDataUrl = getQrTargetUrl();
  const qrCodeApiUrl = qrDataUrl 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrDataUrl)}` 
    : '';

  const handleDownload = async () => {
    if (!qrCodeApiUrl) return;

    let blob;
    try {
      const response = await fetch(qrCodeApiUrl);
      blob = await response.blob();
    } catch (err) {
      // Couldn't fetch the image data (e.g. network/CORS hiccup) — open it directly
      // so the user can still long-press to save it.
      window.open(qrCodeApiUrl, '_blank');
      toast.error('Could not fetch the QR code — opened it in a new tab instead.');
      return;
    }

    const fileName = `qrcode-${activeTab}-${Date.now()}.png`;
    const file = new File([blob], fileName, { type: blob.type || 'image/png' });

    // Android (and many mobile browsers / in-app webviews) silently ignore the
    // <a download> attribute for blob URLs, so nothing appears to happen when
    // tapped. The native share sheet is the reliable way to let the user save
    // the image to their gallery/files there, so try that first on devices
    // that support it.
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'QR Code' });
        toast.success('QR Code shared successfully!');
        setShowShareModal(true);
        return;
      } catch (shareErr) {
        if (shareErr?.name === 'AbortError') return; // user cancelled the share sheet
        // otherwise fall through to the classic download approach below
      }
    }

    try {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      toast.success('QR Code downloaded successfully!');
      setShowShareModal(true); // Open the share modal after download
    } catch (err) {
      // Last resort — open the raw image so the user can long-press "Save image".
      window.open(qrCodeApiUrl, '_blank');
      toast.error('Could not auto-download — opened the QR code, long-press to save it.');
    }
  };

  const handleShare = (platform) => {
    if (!qrDataUrl) return;
    
    const message = `Check out my QR Code link: ${qrDataUrl}`;
    const encodedMsg = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(qrDataUrl);

    let shareLink = '';

    switch (platform) {
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${encodedMsg}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent('Shared QR Code Target')}&body=${encodedMsg}`;
        break;
      case 'mms':
        shareLink = `sms:?body=${encodedMsg}`;
        break;
      default:
        return;
    }

    window.open(shareLink, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-10 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={closeOverlay}
    >
      <div 
        className="relative w-full h-full sm:h-auto sm:max-w-xl bg-slate-900 p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out rounded-none sm:rounded-[1.75rem] max-h-full sm:max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-indigo-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        {/* Drag handle for mobile sheet feel */}
        <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center mb-7">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <i className="fa-solid fa-qrcode text-indigo-400"></i>
            QR Code Generator
          </h2>
          <button 
            onClick={closeOverlay} 
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200"
          >
            <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
          </button>
        </div>

        {/* Type Selector Tabs */}
        <div className="relative z-10 flex bg-white/5 border border-white/10 p-1.5 rounded-2xl mb-6 gap-1 overflow-x-auto">
          {[
            { id: 'url', label: 'Website', icon: 'fa-globe' },
            { id: 'whatsapp', label: 'WhatsApp', icon: 'fa-brands fa-whatsapp' },
            { id: 'email', label: 'Email', icon: 'fa-envelope' },
            { id: 'social', label: 'Social Media', icon: 'fa-share-nodes' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowShareModal(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-2px_rgba(99,102,241,0.5)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Inputs */}
        <div className="relative z-10 space-y-4 mb-6">
          {activeTab === 'url' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">Website URL</label>
              <input 
                type="url" 
                placeholder="https://example.com" 
                value={urlInput}
                onChange={(e) => handleInputChange(setUrlInput, e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-colors"
              />
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">WhatsApp Number (with country code)</label>
                <input 
                  type="tel" 
                  placeholder="+1234567890" 
                  value={waPhone}
                  onChange={(e) => handleInputChange(setWaPhone, e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">Pre-filled Message (Optional)</label>
                <textarea 
                  rows="2"
                  placeholder="Hello, I would like to inquire about..." 
                  value={waMessage}
                  onChange={(e) => handleInputChange(setWaMessage, e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-colors"
                />
              </div>
            </>
          )}

          {activeTab === 'email' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">Email Address</label>
                <input 
                  type="email" 
                  placeholder="contact@example.com" 
                  value={emailAddress}
                  onChange={(e) => handleInputChange(setEmailAddress, e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">Subject (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Inquiry regarding services" 
                  value={emailSubject}
                  onChange={(e) => handleInputChange(setEmailSubject, e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-colors"
                />
              </div>
            </>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">Select Platform</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'facebook', label: 'Facebook', icon: 'fa-brands fa-facebook' },
                  { id: 'twitter', label: 'Twitter', icon: 'fa-brands fa-twitter' },
                  { id: 'linkedin', label: 'LinkedIn', icon: 'fa-brands fa-linkedin' },
                  { id: 'custom', label: 'Custom URL', icon: 'fa-solid fa-link' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSocialPlatform(p.id);
                      setSocialUsername('');
                      setSocialUrl('');
                      setShowShareModal(false);
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                      socialPlatform === p.id 
                        ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300' 
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <i className={`${p.icon} text-lg`}></i>
                    <span className="hidden sm:block">{p.label}</span>
                  </button>
                ))}
              </div>

              {socialPlatform === 'custom' ? (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">Custom Profile URL</label>
                  <input 
                    type="url" 
                    placeholder="https://instagram.com/yourprofile" 
                    value={socialUrl}
                    onChange={(e) => handleInputChange(setSocialUrl, e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-colors"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">
                    {socialPlatform.charAt(0).toUpperCase() + socialPlatform.slice(1)} Username
                  </label>
                  <div className="flex items-center rounded-xl border border-white/10 overflow-hidden focus-within:border-indigo-500/50 transition-colors bg-white/5">
                    <span className="bg-white/5 text-slate-500 text-sm px-3 py-3 border-r border-white/10 font-mono select-none">
                      {socialPlatform === 'linkedin' ? 'linkedin.com/in/' : `${socialPlatform}.com/`}
                    </span>
                    <input 
                      type="text" 
                      placeholder="username" 
                      value={socialUsername}
                      onChange={(e) => handleInputChange(setSocialUsername, e.target.value)}
                      className="w-full px-3 py-3 text-sm bg-transparent text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* QR Code Preview & Action Area */}
        <div className="relative z-10 flex flex-col items-center justify-center bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          {qrCodeApiUrl ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="p-3 bg-white rounded-2xl shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5)]">
                <img src={qrCodeApiUrl} alt="Generated QR Code" className="w-44 h-44 object-contain" />
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                {qrDataUrl}
              </p>
              
              {/* Download Button */}
              <button 
                onClick={handleDownload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 text-white text-sm font-semibold transition-all duration-200 hover:border-indigo-500/40 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.2),0_8px_24px_-8px_rgba(99,102,241,0.4)] active:scale-[0.98] cursor-pointer"
              >
                <i className="fa-solid fa-download text-xs text-indigo-400"></i>
                <span>Download QR Code (PNG)</span>
              </button>

              {/* Trigger button for share modal if closed */}
              <button
                onClick={() => setShowShareModal(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer mt-1"
              >
                <i className="fa-solid fa-share-nodes text-xs"></i>
                <span>Share QR Code target via...</span>
              </button>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500">
              <i className="fa-solid fa-qrcode text-4xl mb-2 opacity-40 text-indigo-400"></i>
              <p className="text-xs font-medium">Enter details above to generate a QR code</p>
            </div>
          )}
        </div>
      </div>

      {/* Share Target Modal Overlay */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 border border-white/10 p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] text-white transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 ease-out rounded-none sm:rounded-3xl max-h-full sm:max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5"></div>

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-share-nodes text-indigo-400"></i>
                Share your target via:
              </h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200"
              >
                <i className="fa-solid fa-xmark text-slate-400 text-sm"></i>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Select a platform to share your generated QR code link target with others:
            </p>

            {/* Platform Buttons Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 rounded-2xl transition-colors duration-200 text-xs font-semibold cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <i className="fa-brands fa-whatsapp text-lg text-emerald-400"></i>
                </div>
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-blue-400 rounded-2xl transition-colors duration-200 text-xs font-semibold cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <i className="fa-brands fa-facebook text-lg text-blue-400"></i>
                </div>
                <span>Facebook</span>
              </button>

              <button
                onClick={() => handleShare('email')}
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 rounded-2xl transition-colors duration-200 text-xs font-semibold cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <i className="fa-solid fa-envelope text-lg text-amber-400"></i>
                </div>
                <span>Email</span>
              </button>

              <button
                onClick={() => handleShare('mms')}
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-rose-400 rounded-2xl transition-colors duration-200 text-xs font-semibold cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                  <i className="fa-solid fa-comment-sms text-lg text-rose-400"></i>
                </div>
                <span>MMS / SMS</span>
              </button>
            </div>

            {/* Modal Close Action */}
            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QrGeneratorModal;
