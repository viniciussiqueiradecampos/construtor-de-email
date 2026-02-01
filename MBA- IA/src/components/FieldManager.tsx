import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FormFieldItem } from './FormFieldItem';
import { FieldConfig } from './PageBuilder';
import { Plus } from 'lucide-react';

interface FieldManagerProps {
  fields: FieldConfig[];
  onReorder: (fields: FieldConfig[]) => void;
  onToggleVisibility: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (type: FieldConfig['type']) => void;
}

export function FieldManager({ fields, onReorder, onToggleVisibility, onRemove, onAdd }: FieldManagerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      const newFields = arrayMove(fields, oldIndex, newIndex).map((field, index) => ({
        ...field,
        order: index,
      }));
      onReorder(newFields);
    }
  };

  const availableFieldTypes: Array<{ type: FieldConfig['type']; label: string; icon: string }> = [
    { type: 'name', label: 'Nome', icon: '👤' },
    { type: 'email', label: 'E-mail', icon: '📧' },
    { type: 'phone', label: 'Telefone', icon: '📱' },
    { type: 'privacy', label: 'Privacidade', icon: '🔒' },
    { type: 'robot', label: 'Verificação', icon: '🤖' },
  ];

  const addedFieldTypes = new Set(fields.map(f => f.type));
  const availableToAdd = availableFieldTypes.filter(t => !addedFieldTypes.has(t.type));

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Campos do Formulário</h3>
          <span className="text-xs text-gray-500">{fields.filter(f => f.enabled).length} visíveis</span>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {fields.map((field) => (
                <FormFieldItem
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  isVisible={field.enabled}
                  onToggleVisibility={() => onToggleVisibility(field.id)}
                  onRemove={() => onRemove(field.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {availableToAdd.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">Adicionar Campo</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableToAdd.map((fieldType) => (
              <button
                key={fieldType.type}
                onClick={() => onAdd(fieldType.type)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all group"
              >
                <span className="text-lg">{fieldType.icon}</span>
                <div className="flex-1 text-left">
                  <div className="text-xs font-medium text-gray-700">{fieldType.label}</div>
                </div>
                <Plus className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
