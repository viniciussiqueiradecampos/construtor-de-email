import { FormConfig } from './PageBuilder';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  currentTemplate: string;
  onSelectTemplate: (template: 'modern' | 'minimal' | 'bold' | 'elegant' | 'tech') => void;
}

const templates = [
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Design clean e contemporâneo',
    preview: {
      primaryColor: '#4a7c9e',
      secondaryColor: '#6b1945',
      borderRadius: '12px',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Simplicidade e elegância',
    preview: {
      primaryColor: '#000000',
      secondaryColor: '#6b7280',
      borderRadius: '4px',
      gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
    },
  },
  {
    id: 'bold',
    name: 'Vibrante',
    description: 'Cores fortes e impactantes',
    preview: {
      primaryColor: '#f59e0b',
      secondaryColor: '#ef4444',
      borderRadius: '16px',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    },
  },
  {
    id: 'elegant',
    name: 'Elegante',
    description: 'Sofisticado e refinado',
    preview: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      borderRadius: '8px',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Futurista e inovador',
    preview: {
      primaryColor: '#06b6d4',
      secondaryColor: '#3b82f6',
      borderRadius: '20px',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    },
  },
];

export function TemplateSelector({ currentTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Template</h3>
        <span className="text-xs text-gray-500">Escolha um estilo</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id as any)}
            className={`relative group text-left transition-all rounded-lg border-2 overflow-hidden ${
              currentTemplate === template.id
                ? 'border-[#4a7c9e] shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Preview */}
            <div 
              className="h-20 relative"
              style={{ background: template.preview.gradient }}
            >
              <div className="absolute inset-0 bg-black/10" />
              
              {/* Mini form preview */}
              <div className="absolute inset-0 p-2 flex flex-col justify-center items-center gap-1">
                <div 
                  className="w-full h-1.5 bg-white/90"
                  style={{ borderRadius: template.preview.borderRadius }}
                />
                <div 
                  className="w-full h-1.5 bg-white/90"
                  style={{ borderRadius: template.preview.borderRadius }}
                />
                <div 
                  className="w-3/4 h-2 bg-white/90 mt-1"
                  style={{ borderRadius: template.preview.borderRadius }}
                />
              </div>

              {/* Check indicator */}
              {currentTemplate === template.id && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3 text-[#4a7c9e]" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-2 bg-white">
              <div className="font-medium text-xs text-gray-900">{template.name}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{template.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function getTemplateConfig(template: 'modern' | 'minimal' | 'bold' | 'elegant' | 'tech'): Partial<FormConfig> {
  const configs = {
    modern: {
      title: {
        fontSize: 48,
        color: '#6b1945',
      },
      button: {
        useGradient: true,
        gradientFrom: '#6b1945',
        gradientTo: '#8b1f5a',
        backgroundColor: '#6b1945',
        textColor: '#ffffff',
      },
      style: {
        inputBorderColor: '#e5e7eb',
        inputBorderWidth: 2,
        inputBorderRadius: 12,
        inputPadding: 16,
        inputFocusColor: '#6b1945',
        backgroundColor: '#ffffff',
        shadow: 2,
      },
    },
    minimal: {
      title: {
        fontSize: 42,
        color: '#000000',
      },
      button: {
        useGradient: false,
        gradientFrom: '#000000',
        gradientTo: '#434343',
        backgroundColor: '#000000',
        textColor: '#ffffff',
      },
      style: {
        inputBorderColor: '#d1d5db',
        inputBorderWidth: 1,
        inputBorderRadius: 4,
        inputPadding: 12,
        inputFocusColor: '#000000',
        backgroundColor: '#ffffff',
        shadow: 0,
      },
    },
    bold: {
      title: {
        fontSize: 52,
        color: '#ef4444',
      },
      button: {
        useGradient: true,
        gradientFrom: '#f59e0b',
        gradientTo: '#ef4444',
        backgroundColor: '#f59e0b',
        textColor: '#ffffff',
      },
      style: {
        inputBorderColor: '#fbbf24',
        inputBorderWidth: 3,
        inputBorderRadius: 16,
        inputPadding: 18,
        inputFocusColor: '#ef4444',
        backgroundColor: '#ffffff',
        shadow: 4,
      },
    },
    elegant: {
      title: {
        fontSize: 44,
        color: '#6366f1',
      },
      button: {
        useGradient: true,
        gradientFrom: '#6366f1',
        gradientTo: '#8b5cf6',
        backgroundColor: '#6366f1',
        textColor: '#ffffff',
      },
      style: {
        inputBorderColor: '#c7d2fe',
        inputBorderWidth: 2,
        inputBorderRadius: 8,
        inputPadding: 14,
        inputFocusColor: '#6366f1',
        backgroundColor: '#ffffff',
        shadow: 3,
      },
    },
    tech: {
      title: {
        fontSize: 46,
        color: '#06b6d4',
      },
      button: {
        useGradient: true,
        gradientFrom: '#06b6d4',
        gradientTo: '#3b82f6',
        backgroundColor: '#06b6d4',
        textColor: '#ffffff',
      },
      style: {
        inputBorderColor: '#67e8f9',
        inputBorderWidth: 2,
        inputBorderRadius: 20,
        inputPadding: 16,
        inputFocusColor: '#06b6d4',
        backgroundColor: '#ffffff',
        shadow: 5,
      },
    },
  };

  return configs[template];
}
