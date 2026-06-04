'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  resultText: string;
  calculatorName: string;
}

export function ShareButtons({ resultText, calculatorName }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareMessage = `${resultText}\n\n📊 Calculated using CalculoX - ${calculatorName}\n${currentUrl}`;
  const encodedMessage = encodeURIComponent(shareMessage);
  const encodedUrl = encodeURIComponent(currentUrl);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedMessage}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'facebook' | 'linkedin') => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
          📤 Share Your Results
        </p>
        <div className="flex flex-wrap gap-2">
          {/* WhatsApp */}
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex-1 sm:flex-initial px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg"
            title="Share on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            <span>💬</span>
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Twitter */}
          <button
            onClick={() => handleShare('twitter')}
            className="flex-1 sm:flex-initial px-3 py-2 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg"
            title="Share on Twitter"
            aria-label="Share on Twitter"
          >
            <span>𝕏</span>
            <span className="hidden sm:inline">Twitter</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => handleShare('linkedin')}
            className="flex-1 sm:flex-initial px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg"
            title="Share on LinkedIn"
            aria-label="Share on LinkedIn"
          >
            <span>💼</span>
            <span className="hidden sm:inline">LinkedIn</span>
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleShare('facebook')}
            className="flex-1 sm:flex-initial px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg"
            title="Share on Facebook"
            aria-label="Share on Facebook"
          >
            <span>f</span>
            <span className="hidden sm:inline">Facebook</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopyToClipboard}
            className={`flex-1 sm:flex-initial px-3 py-2 font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            title="Copy to clipboard"
            aria-label="Copy to clipboard"
          >
            <span>{copied ? '✓' : '📋'}</span>
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
