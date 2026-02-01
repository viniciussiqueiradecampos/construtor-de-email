import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Trash2 } from 'lucide-react';

interface FormFieldItemProps {
  id: string;
  label: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onRemove: () => void;
}

export function FormFieldItem({ id, label, isVisible, onToggleVisibility, onRemove }: FormFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-3 py-2.5 bg-white border rounded-lg group hover:border-gray-300 transition-all ${
        !isVisible ? 'opacity-50' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <span className="flex-1 text-sm text-gray-700 font-medium">{label}</span>
      
      <button
        onClick={onToggleVisibility}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
      
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}