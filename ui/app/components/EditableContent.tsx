import { Button } from "./ui/button";
import { Save, X } from 'lucide-react';
import { useAppTheme } from "../hooks/useAppTheme";
import { cn } from "../lib/utils";

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
          className={cn(
            "w-full min-h-[200px] p-4 rounded-md",
            "transition-colors duration-200",
            theme.input.base,
            theme.input.focus,
            "text-[hsl(var(--foreground))]"
          )}
        />
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button 
          onClick={onSave}
          className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))/90]"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
}; 