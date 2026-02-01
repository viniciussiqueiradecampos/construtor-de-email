import { 
  Type, 
  Square, 
  Image, 
  ListChecks,
  MousePointer2,
  Palette,
  Layout,
  Heading1,
  Minus,
  Space
} from 'lucide-react';
import { useState } from 'react';

interface LeftPanelProps {
  onAddElement: (elementType: string) => void;
}

export function LeftPanel({ onAddElement }: LeftPanelProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const contentTools = [
    { icon: Heading1, label: 'Título', color: '#3b82f6', type: 'heading' },
    { icon: Type, label: 'Texto', color: '#8b5cf6', type: 'text' },
    { icon: Image, label: 'Imagem', color: '#14b8a6', type: 'image' },
    { icon: Minus, label: 'Divisor', color: '#6366f1', type: 'divider' },
    { icon: Space, label: 'Espaço', color: '#f59e0b', type: 'spacer' },
  ];

  const formTools = [
    { icon: Layout, label: 'Nome', color: '#ec4899', type: 'name' },
    { icon: Layout, label: 'E-mail', color: '#10b981', type: 'email' },
    { icon: Layout, label: 'Telefone', color: '#f97316', type: 'phone' },
  ];

  return (
    <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-2 overflow-y-auto">
      <div className="mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">F</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full px-2">
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
          Conteúdo
        </div>
        <div className="space-y-2">
          {contentTools.map((tool, index) => (
            <button
              key={index}
              onClick={() => onAddElement(tool.type)}
              onMouseEnter={() => setShowTooltip(tool.label)}
              onMouseLeave={() => setShowTooltip(null)}
              className="relative w-full h-12 flex flex-col items-center justify-center rounded-lg hover:bg-gray-50 transition-all cursor-pointer active:scale-95 group"
            >
              <div 
                className="w-7 h-7 rounded-md flex items-center justify-center transition-all group-hover:scale-110"
                style={{ backgroundColor: `${tool.color}15` }}
              >
                <tool.icon 
                  className="w-3.5 h-3.5 transition-all" 
                  style={{ color: tool.color }}
                />
              </div>
              <span className="text-[9px] text-gray-600 mt-0.5 font-medium">{tool.label}</span>
              
              {/* Tooltip */}
              {showTooltip === tool.label && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap animate-fadeIn pointer-events-none" style={{ zIndex: 9999 }}>
                  Adicionar {tool.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="w-12 h-px bg-gray-200 my-2" />

      {/* Form Fields Section */}
      <div className="w-full px-2">
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
          Campos
        </div>
        <div className="space-y-2">
          {formTools.map((tool, index) => (
            <button
              key={index}
              onClick={() => onAddElement(tool.type)}
              onMouseEnter={() => setShowTooltip(tool.label)}
              onMouseLeave={() => setShowTooltip(null)}
              className="relative w-full h-12 flex flex-col items-center justify-center rounded-lg hover:bg-gray-50 transition-all cursor-pointer active:scale-95 group"
            >
              <div 
                className="w-7 h-7 rounded-md flex items-center justify-center transition-all group-hover:scale-110"
                style={{ backgroundColor: `${tool.color}15` }}
              >
                <tool.icon 
                  className="w-3.5 h-3.5 transition-all" 
                  style={{ color: tool.color }}
                />
              </div>
              <span className="text-[9px] text-gray-600 mt-0.5 font-medium">{tool.label}</span>
              
              {/* Tooltip */}
              {showTooltip === tool.label && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap animate-fadeIn pointer-events-none" style={{ zIndex: 9999 }}>
                  Adicionar campo {tool.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-5px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}