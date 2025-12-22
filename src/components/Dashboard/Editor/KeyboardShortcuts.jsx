import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function KeyboardShortcuts() {
  const shortcuts = [
    { key: "Ctrl+B", action: "Bold" },
    { key: "Ctrl+I", action: "Italic" },
    { key: "Ctrl+U", action: "Underline" },
    { key: "Ctrl+Z", action: "Undo" },
    { key: "Ctrl+Y", action: "Redo" },
  ];

  return (
    <Card className="border-primary p-1">
      <CardContent className="p-2">
        <div className="text-sm font-medium text-primary mb-2">
          Keyboard Shortcuts
        </div>
        <div className="flex flex-wrap gap-2">
          {shortcuts.map((shortcut, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-primary text-primary text-xs"
            >
              {shortcut.key} - {shortcut.action}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default KeyboardShortcuts;
