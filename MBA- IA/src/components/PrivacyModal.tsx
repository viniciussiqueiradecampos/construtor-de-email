import { X } from 'lucide-react';
import { useEffect } from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyText: string;
}

export function PrivacyModal({ isOpen, onClose, policyText }: PrivacyModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="sticky top-0 z-10 px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between"
        >
          <h2 
            className="text-xl font-semibold text-gray-900"
          >
            Política de Privacidade
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-140px)] px-6 py-6">
          <div 
            className="whitespace-pre-wrap leading-relaxed text-sm text-gray-700"
          >
            {policyText}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="sticky bottom-0 px-6 py-4 bg-white border-t border-gray-200 flex justify-end gap-3"
        >
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium rounded-lg bg-[#4a7c9e] text-white hover:bg-[#3d6a88] transition-all hover:scale-105"
          >
            Entendi
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}