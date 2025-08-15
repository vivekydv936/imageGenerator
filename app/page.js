// FILE: frontend/app/page.js
// Your existing logic with the new stunning visual design applied

'use client';

import { useState, useEffect } from 'react';

// --- SVG Icon Components ---

const MagicWandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4V2" />
    <path d="M15 10V8" />
    <path d="M12.5 7H17.5" />
    <path d="M20 5.5V2.5" />
    <path d="M4 15l4.9-4.9" />
    <path d="M13 22l4.9-4.9" />
    <path d="M2 22l2.5-2.5" />
    <path d="M19.5 6.5L22 4" />
    <path d="M9.8 14.2l-2.5 2.5" />
    <path d="M14.2 9.8l2.5-2.5" />
    <path d="M7.3 2.3L5.5 4" />
    <path d="M4 5.5L2.3 7.3" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// --- Main Page Component ---

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Trigger animations on component mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'An unknown error occurred');
      }

      const data = await response.json();
      const newImageUrl = `data:${data.mime_type};base64,${data.image_b64}`;
      setImageUrl(newImageUrl);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    const fileName = prompt.substring(0, 30).replace(/\s+/g, '_') || 'generated_image';
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Custom Styles for the new design */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(20px) rotate(240deg); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientFlow 4s ease infinite;
        }
        
        .tagline-glow {
          background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease infinite;
          text-shadow: 0 0 30px rgba(78, 205, 196, 0.3);
        }
        
        .process-pill {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .process-pill:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.6s ease;
        }
        
        .process-pill:hover:before {
          left: 100%;
        }
        
        .process-pill:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .dream-pill {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15));
          border: 1px solid rgba(6, 182, 212, 0.3);
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.2);
        }
        
        .create-pill {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(168, 85, 247, 0.15));
          border: 1px solid rgba(236, 72, 153, 0.3);
          box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
        }
        
        .share-pill {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(101, 163, 13, 0.15));
          border: 1px solid rgba(34, 197, 94, 0.3);
          box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
        }
        
        .typing-animation {
          border-right: 2px solid #4ecdc4;
          animation: typing 4s steps(40) infinite, blink 1s infinite;
        }
        
        @keyframes typing {
          0%, 100% { width: 0; }
          50% { width: 100%; }
        }
        
        @keyframes blink {
          0%, 50% { border-color: transparent; }
          51%, 100% { border-color: #4ecdc4; }
        }
        
        .stagger-animation {
          animation: staggerFadeIn 0.8s ease-out forwards;
        }
        
        .stagger-1 { animation-delay: 0.2s; opacity: 0; }
        .stagger-2 { animation-delay: 0.4s; opacity: 0; }
        .stagger-3 { animation-delay: 0.6s; opacity: 0; }
        
        @keyframes staggerFadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
        
        .floating-shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float 20s infinite ease-in-out;
          pointer-events: none;
        }
        
        .shape-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          top: 10%;
          left: -10%;
          animation-delay: 0s;
        }
        
        .shape-2 {
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #a8e6cf, #ff8b94);
          top: 60%;
          right: -5%;
          animation-delay: -7s;
        }
        
        .shape-3 {
          width: 150px;
          height: 150px;
          background: linear-gradient(45deg, #ffd93d, #6bcf7f);
          bottom: 20%;
          left: 20%;
          animation-delay: -14s;
        }
        
        .glassmorphism {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        
        .glassmorphism-strong {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
        }
        
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(255, 107, 107, 0.4);
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .input-glow:focus {
          box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
          border-color: #4ecdc4;
        }
      `}</style>

      {/* Main container with deep gradient background */}
      <div className="min-h-screen w-full relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)'
      }}>
        {/* Animated floating shapes */}
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center p-4">
          <main className={`container mx-auto w-full max-w-4xl flex flex-col gap-8 transition-all duration-1000 ease-in-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Header with enhanced styling */}
            <header className="text-center mb-12">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8 relative">
                <span className="gradient-text drop-shadow-2xl">CreativeStudio</span>
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-pink-500/20 to-green-500/20 blur-xl rounded-full opacity-50 animate-pulse"></div>
              </h1>
              
              <div className="space-y-8">
                {/* Main tagline with gradient and glow */}
                <div className="relative">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tagline-glow mb-2">
                    Where Ideas Become Art
                  </h2>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-pink-400 to-green-400 blur-xl opacity-30 animate-pulse"></div>
                </div>
                
                {/* Enhanced process pills with individual styling */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-lg font-semibold mt-8">
                  <div className="process-pill dream-pill px-6 py-3 rounded-full cursor-pointer stagger-animation stagger-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💭</span>
                      <span className="text-cyan-200">Dream It</span>
                    </div>
                  </div>
                  
                  <div className="text-gray-400 text-3xl animate-pulse">→</div>
                  
                  <div className="process-pill create-pill px-6 py-3 rounded-full cursor-pointer stagger-animation stagger-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">✨</span>
                      <span className="text-pink-200">Create It</span>
                    </div>
                  </div>
                  
                  <div className="text-gray-400 text-3xl animate-pulse">→</div>
                  
                  <div className="process-pill share-pill px-6 py-3 rounded-full cursor-pointer stagger-animation stagger-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚀</span>
                      <span className="text-green-200">Share It</span>
                    </div>
                  </div>
                </div>
                
                {/* Additional inspiring text with typing effect */}
                <div className="mt-8 max-w-3xl mx-auto">
                  <p className="text-xl text-gray-300 italic opacity-80 font-light leading-relaxed">
                    
                  </p>
                </div>
              </div>
            </header>

            {/* Main form section with glassmorphism */}
            <div className="relative animate-fade-in-up">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur opacity-20 animate-pulse"></div>
              
              {/* Form container */}
              <div className="relative glassmorphism-strong p-8 rounded-3xl shadow-2xl">
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                  {/* Enhanced textarea */}
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., A cinematic photo of Rahul on a Goa beach at sunset with golden hour lighting and dramatic clouds..."
                      className="w-full p-6 glassmorphism rounded-2xl focus:outline-none input-glow transition-all duration-300 text-lg placeholder-gray-400 text-white resize-none"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        minHeight: '120px'
                      }}
                      rows="4"
                      required
                    />
                  </div>
                  
                  {/* Enhanced generate button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary flex items-center justify-center gap-3 text-white font-bold py-4 px-8 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating Magic...</span>
                      </>
                    ) : (
                      <>
                        <MagicWandIcon />
                        <span>Generate Stunning Image</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Results section */}
            <div className="w-full min-h-[400px] flex items-center justify-center transition-all duration-500">
              {error && (
                <div className="glassmorphism border-red-500/50 text-red-200 px-6 py-4 rounded-2xl text-center w-full max-w-2xl animate-fade-in-up" style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  <p className="text-lg"><strong>Error:</strong> {error}</p>
                </div>
              )}

              {isLoading && (
                <div className="w-full max-w-2xl text-center flex flex-col items-center gap-6 animate-fade-in-up">
                  <div className="w-full h-96 glassmorphism rounded-2xl animate-pulse border border-white/20 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-300 text-lg">Creating your masterpiece...</p>
                    </div>
                  </div>
                </div>
              )}

              {imageUrl && !isLoading && (
                <div className="w-full max-w-4xl flex flex-col gap-6 items-center animate-fade-in-up">
                  {/* Enhanced image container with proper framing */}
                  <div className="w-full glassmorphism-strong p-4 rounded-3xl shadow-2xl relative overflow-hidden">
                    {/* Decorative frame border */}
                    <div className="absolute inset-2 border-2 border-gradient-to-r from-cyan-400/30 via-pink-400/30 to-green-400/30 rounded-2xl pointer-events-none"></div>
                    
                    {/* Image wrapper with aspect ratio control */}
                    <div className="relative bg-black/20 rounded-2xl overflow-hidden" style={{ aspectRatio: 'auto' }}>
                      <img 
                        src={imageUrl} 
                        alt={prompt}
                        className="w-full h-auto object-contain rounded-2xl shadow-lg"
                        style={{ 
                          maxHeight: '70vh',
                          minHeight: '400px',
                          objectFit: 'contain',
                          objectPosition: 'center'
                        }}
                      />
                      
                      {/* Subtle overlay for enhancement */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
                    </div>
                    
                    {/* Image metadata */}
                    <div className="mt-4 p-3 glassmorphism rounded-xl">
                      <p className="text-sm text-gray-300 italic truncate">
                        "{prompt}"
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced download button */}
                  <button
                    onClick={handleDownload}
                    className="btn-secondary flex items-center justify-center gap-3 text-white font-semibold py-4 px-8 rounded-xl text-lg group"
                  >
                    <DownloadIcon />
                    <span>Download Masterpiece</span>
                    <div className="w-0 group-hover:w-6 transition-all duration-300 overflow-hidden">
                      <span className="text-cyan-400">↓</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}