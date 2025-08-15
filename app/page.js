// FILE: app/page.js
// This is the complete and corrected code for your frontend UI.
// Test change to force a commit

'use client';

import { useState, useEffect } from 'react'; // FIX: Added useEffect to the import statement

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

  // This hook is now correctly imported and will work
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
    <div className="min-h-screen w-full bg-gray-900 text-white flex justify-center items-center p-4">
      <main className="container mx-auto w-full max-w-2xl flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Creative Studio
          </h1>
          <p className="text-gray-400 mt-2">
            AI-Powered Image Generation
          </p>
        </header>

        <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-white/10">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A cinematic photo of Rahul on a Goa beach..."
              className="w-full p-4 bg-gray-800/50 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
              rows="3"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-all"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : <MagicWandIcon />}
              <span>{isLoading ? 'Generating...' : 'Generate Image'}</span>
            </button>
          </form>
        </div>

        <div className="w-full min-h-[300px] flex items-center justify-center">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-xl text-center w-full">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {isLoading && (
            <div className="w-full text-center">
              <p className="text-gray-400">Generating your masterpiece...</p>
            </div>
          )}

          {imageUrl && !isLoading && (
            <div className="w-full flex flex-col gap-4 items-center">
              <div className="w-full bg-black/30 p-4 rounded-2xl border border-white/10">
                <img 
                  src={imageUrl} 
                  alt={prompt}
                  className="rounded-xl w-full h-auto object-contain"
                />
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                <DownloadIcon />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
