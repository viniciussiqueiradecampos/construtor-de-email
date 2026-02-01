import { 
  Undo2, 
  Redo2, 
  Eye, 
  Settings,
  Smartphone,
  Monitor,
  Menu,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';

export function TopBar() {
  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
          <ChevronLeft className="w-4 h-4" />
          Voltar para o Checkout
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1" />
        
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Menu className="w-4 h-4 text-gray-700" />
        </button>
        
        <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-700">
          sdrsoft
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-6">
        <button className="text-sm font-medium text-gray-900 border-b-2 border-gray-900 pb-3 pt-3">
          Construtor
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-900 pb-3 pt-3">
          Guia de estilo
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
          <Monitor className="w-4 h-4 text-gray-700" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
          <Smartphone className="w-4 h-4 text-gray-700" />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1" />
        
        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
          <Undo2 className="w-4 h-4 text-gray-700" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
          <Redo2 className="w-4 h-4 text-gray-700" />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1" />
        
        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
          <Settings className="w-4 h-4 text-gray-700" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
          <Eye className="w-4 h-4 text-gray-700" />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1" />
        
        <button className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
          Salvar
        </button>
        <button className="px-4 py-1.5 text-sm bg-[#c7ea46] text-gray-900 font-medium rounded hover:bg-[#d4f05c] transition-colors">
          Publicar
        </button>
      </div>
    </div>
  );
}