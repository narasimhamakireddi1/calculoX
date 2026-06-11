'use client';

import { useState } from 'react';
import { Eye, Share2, Clipboard, Check, MessageCircle, Briefcase, Users } from 'lucide-react';

interface InputField {
  label: string;
  value: string;
}

interface ShareButtonsProps {
  inputs: InputField[];
  outputs: InputField[];
  calculatorName: string;
}

export function ShareButtons({ inputs, outputs, calculatorName }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const formatShareMessage = (): string => {
    let message = `✅ ${calculatorName}\n\n`;
    message += '📥 INPUTS (Assumptions):\n';
    inputs.forEach((input) => {
      message += `  • ${input.label}: ${input.value}\n`;
    });
    message += '\n📤 RESULTS (Outputs):\n';
    outputs.forEach((output) => {
      message += `  • ${output.label}: ${output.value}\n`;
    });
    message += `\n🔗 Calculated using CalculoX\n${currentUrl}`;
    return message;
  };

  const shareMessage = formatShareMessage();
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
    <div className="space-y-3">
      {/* Preview Box */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
          Preview of Share Message
        </p>
        <div className="bg-white dark:bg-gray-900 rounded p-3 text-xs font-mono text-gray-700 dark:text-gray-300 space-y-1 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700">
          {shareMessage.split('\n').map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap break-words">
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Share Buttons */}
      <div>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
          Share Your Results
        </p>
        <div className="flex flex-wrap gap-2">
          {/* WhatsApp */}
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex-1 sm:flex-initial px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
            title="Share on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Twitter/X */}
          <button
            onClick={() => handleShare('twitter')}
            className="flex-1 sm:flex-initial px-3 py-2 bg-black hover:bg-gray-900 text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
            title="Share on X (Twitter)"
            aria-label="Share on X (Twitter)"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
            </svg>
            <span className="hidden sm:inline">X</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => handleShare('linkedin')}
            className="flex-1 sm:flex-initial px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
            title="Share on LinkedIn"
            aria-label="Share on LinkedIn"
          >
            <Briefcase className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
            <span className="hidden sm:inline">LinkedIn</span>
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleShare('facebook')}
            className="flex-1 sm:flex-initial px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
            title="Share on Facebook"
            aria-label="Share on Facebook"
          >
            <Users className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
            <span className="hidden sm:inline">Facebook</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopyToClipboard}
            className={`flex-1 sm:flex-initial px-3 py-2 font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            title="Copy to clipboard"
            aria-label="Copy to clipboard"
          >
            {copied
              ? <Check className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
              : <Clipboard className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
            }
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
