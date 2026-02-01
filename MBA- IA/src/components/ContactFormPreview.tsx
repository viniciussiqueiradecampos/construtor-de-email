import { FormConfig } from './PageBuilder';
import { PrivacyModal } from './PrivacyModal';
import { useState } from 'react';

interface ContactFormPreviewProps {
  config: FormConfig;
}

export function ContactFormPreview({ config }: ContactFormPreviewProps) {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [currentPrivacyText, setCurrentPrivacyText] = useState('');

  const handleOpenPrivacy = (policyText: string) => {
    setCurrentPrivacyText(policyText);
    setIsPrivacyModalOpen(true);
  };

  // Sort fields by order
  const sortedFields = [...config.fields].sort((a, b) => a.order - b.order);

  const renderElement = (field: any) => {
    if (!field.enabled) return null;

    switch (field.type) {
      case 'heading':
        return (
          <div key={field.id} style={{ textAlign: field.textAlign || 'center' }}>
            <h2
              style={{
                fontSize: `${field.fontSize || 32}px`,
                color: field.color || '#111827',
                fontWeight: field.fontWeight || 'bold',
                margin: 0,
              }}
            >
              {field.content || 'Título'}
            </h2>
          </div>
        );

      case 'text':
        return (
          <div key={field.id} style={{ textAlign: field.textAlign || 'left' }}>
            <p
              style={{
                fontSize: `${field.fontSize || 16}px`,
                color: field.color || '#374151',
                fontWeight: field.fontWeight || 'normal',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {field.content || 'Texto'}
            </p>
          </div>
        );

      case 'divider':
        return (
          <div key={field.id}>
            <hr
              style={{
                border: 'none',
                borderTop: `${field.height || 1}px solid ${field.borderColor || '#e5e7eb'}`,
                margin: 0,
              }}
            />
          </div>
        );

      case 'spacer':
        return (
          <div
            key={field.id}
            style={{
              height: `${field.spacing || 24}px`,
            }}
          />
        );

      case 'image':
        return (
          <div key={field.id} style={{ textAlign: field.textAlign || 'center' }}>
            <img
              src={field.imageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'}
              alt="Imagem"
              style={{
                width: `${field.imageWidth || 100}%`,
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          </div>
        );

      case 'name':
        return (
          <div key={field.id} className="relative">
            <input
              type="text"
              placeholder=" "
              className="peer w-full outline-none transition-all"
              id={field.id}
              style={{
                padding: `${config.style.inputPadding}px`,
                borderWidth: `${config.style.inputBorderWidth}px`,
                borderColor: config.style.inputBorderColor,
                borderRadius: `${config.style.inputBorderRadius}px`,
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
            />
            <label
              htmlFor={field.id}
              className="absolute left-4 top-4 transition-all pointer-events-none
                peer-focus:top-[-10px] peer-focus:left-3 peer-focus:text-xs peer-focus:px-2
                peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:px-2"
              style={{
                color: '#6b7280',
                backgroundColor: '#ffffff',
              }}
            >
              {field.label}
            </label>
          </div>
        );

      case 'email':
        return (
          <div key={field.id} className="relative">
            <input
              type="email"
              placeholder=" "
              className="peer w-full outline-none transition-all"
              id={field.id}
              style={{
                padding: `${config.style.inputPadding}px`,
                borderWidth: `${config.style.inputBorderWidth}px`,
                borderColor: config.style.inputBorderColor,
                borderRadius: `${config.style.inputBorderRadius}px`,
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
            />
            <label
              htmlFor={field.id}
              className="absolute left-4 top-4 transition-all pointer-events-none
                peer-focus:top-[-10px] peer-focus:left-3 peer-focus:text-xs peer-focus:px-2
                peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:px-2"
              style={{
                color: '#6b7280',
                backgroundColor: '#ffffff',
              }}
            >
              {field.label}
            </label>
          </div>
        );

      case 'phone':
        return (
          <div key={field.id} className="flex gap-3">
            {config.countryFlag.enabled && (
              <select
                className="outline-none transition-all cursor-pointer"
                style={{
                  padding: `${config.style.inputPadding}px`,
                  borderWidth: `${config.style.inputBorderWidth}px`,
                  borderColor: config.style.inputBorderColor,
                  borderRadius: `${config.style.inputBorderRadius}px`,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                }}
              >
                <option>🇧🇷 +55</option>
                <option>🇵🇹 +351</option>
                <option>🇺🇸 +1</option>
              </select>
            )}
            <div className="relative flex-1">
              <input
                type="tel"
                placeholder=" "
                className="peer w-full outline-none transition-all"
                id={field.id}
                style={{
                  padding: `${config.style.inputPadding}px`,
                  borderWidth: `${config.style.inputBorderWidth}px`,
                  borderColor: config.style.inputBorderColor,
                  borderRadius: `${config.style.inputBorderRadius}px`,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                }}
              />
              <label
                htmlFor={field.id}
                className="absolute left-4 top-4 transition-all pointer-events-none
                  peer-focus:top-[-10px] peer-focus:left-3 peer-focus:text-xs peer-focus:px-2
                  peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:px-2"
                style={{
                  color: '#6b7280',
                  backgroundColor: '#ffffff',
                }}
              >
                {field.label}
              </label>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div key={field.id} className="flex items-center gap-3 pt-2">
            <div className="relative">
              <input
                type="checkbox"
                id={field.id}
                className="peer appearance-none w-5 h-5 border-2 rounded cursor-pointer transition-all"
                style={{
                  borderColor: config.style.inputBorderColor,
                  backgroundColor: '#ffffff',
                }}
              />
              <svg
                className="absolute top-0.5 left-0.5 w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100"
                viewBox="0 0 16 16"
                fill="none"
                stroke={config.button.backgroundColor}
                strokeWidth="2"
              >
                <path d="M3 8l3 3 7-7" />
              </svg>
            </div>
            <label
              htmlFor={field.id}
              className="text-sm cursor-pointer select-none"
              style={{ color: '#4b5563' }}
            >
              {field.text}{' '}
              {field.policyText && (
                <button
                  type="button"
                  onClick={() => handleOpenPrivacy(field.policyText || '')}
                  className="underline hover:no-underline font-medium transition-all"
                  style={{ color: config.button.backgroundColor }}
                >
                  (Ler política)
                </button>
              )}
            </label>
          </div>
        );

      case 'robot':
        return (
          <div key={field.id} className="flex items-center gap-3">
            <div className="relative">
              <input
                type="checkbox"
                id={field.id}
                className="peer appearance-none w-5 h-5 border-2 rounded cursor-pointer transition-all"
                style={{
                  borderColor: config.style.inputBorderColor,
                  backgroundColor: '#ffffff',
                }}
              />
              <svg
                className="absolute top-0.5 left-0.5 w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100"
                viewBox="0 0 16 16"
                fill="none"
                stroke={config.button.backgroundColor}
                strokeWidth="2"
              >
                <path d="M3 8l3 3 7-7" />
              </svg>
            </div>
            <label
              htmlFor={field.id}
              className="text-sm cursor-pointer select-none"
              style={{ color: '#4b5563' }}
            >
              {field.text}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {config.title.enabled && (
        <div className="text-center mb-6">
          <h1
            className="font-bold leading-tight"
            style={{
              fontSize: `${config.title.fontSize}px`,
              color: config.title.color,
            }}
          >
            {config.title.text}
          </h1>
        </div>
      )}

      {config.subtitle.enabled && (
        <div className="text-center mb-12">
          <p
            style={{
              fontSize: `${config.subtitle.fontSize}px`,
              color: config.subtitle.color,
            }}
          >
            {config.subtitle.text}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {sortedFields.map(renderElement)}

        <button
          className="w-full py-5 font-semibold hover:shadow-lg hover:scale-[1.02] transition-all text-lg"
          style={{
            borderRadius: `${config.style.inputBorderRadius}px`,
            ...(config.button.useGradient ? {
              background: `linear-gradient(to right, ${config.button.gradientFrom}, ${config.button.gradientTo})`,
            } : {
              backgroundColor: config.button.backgroundColor,
            }),
            color: config.button.textColor,
          }}
        >
          {config.button.text}
        </button>
      </div>

      {config.footer.enabled && (
        <div className="mt-8 pt-6" style={{ borderTop: `1px solid #e5e7eb` }}>
          <p
            className="text-center text-sm"
            style={{ color: '#6b7280' }}
          >
            {config.footer.text}
          </p>
        </div>
      )}

      {/* Privacy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        policyText={currentPrivacyText}
      />
    </div>
  );
}