import { Button } from "./ui/button";
import { Save, X } from 'lucide-react';
import { useAppTheme } from "../hooks/useAppTheme";

interface EditableContentProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  renderEditor?: (content: string, onChange: (content: string) => void) => React.ReactNode;
}

export const EditableContent = ({
  content,
  onChange,
  onSave,
  onCancel,
  renderEditor
}: EditableContentProps) => {
  const { theme } = useAppTheme();

  return (
    <div className="space-y-4">
      {renderEditor ? (
        renderEditor(content, onChange)
      ) : (
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[200px] p-4 rounded-md border-input 
            bg-background text-foreground
            focus:outline-none focus:ring-2 focus:ring-primary"
        />
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={onSave}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Save
        </Button>
      </div>
    </div>
  );
}; 