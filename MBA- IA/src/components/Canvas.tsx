import { ContactFormPreview } from './ContactFormPreview';
import { FormConfig } from './PageBuilder';

interface CanvasProps {
  formConfig: FormConfig;
}

export function Canvas({ formConfig }: CanvasProps) {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div 
          className="bg-white rounded-lg shadow-xl min-h-[600px] p-8"
        >
          <ContactFormPreview config={formConfig} />
        </div>
      </div>
    </div>
  );
}