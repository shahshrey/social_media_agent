import { Button } from "./ui/button";
import { Save, X } from 'lucide-react';

interface EditableContentProps {
  content: string;
  onChange: (content: string) => void;
  onSave: (e: React.MouseEvent) => void;
  onCancel: (e: React.MouseEvent) => void;
}

export const EditableContent = ({
  content,
  onChange,
  onSave,
  onCancel
}: EditableContentProps) => (
  <div className="space-y-4">
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-64 p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none bg-white"
      onClick={(e) => e.stopPropagation()}
    />
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={onSave}
        className="bg-indigo-600 hover:bg-indigo-700"
      >
        <Save className="h-4 w-4" />
      </Button>
    </div>
  </div>
); 