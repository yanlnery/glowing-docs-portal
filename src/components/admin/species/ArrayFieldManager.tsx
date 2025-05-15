
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from 'lucide-react';

interface ArrayFieldManagerProps {
  label: string;
  items: string[];
  placeholderPrefix: string;
  onItemChange: (index: number, value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  itemClassName?: string;
  buttonSize?: "sm" | "icon" | "default" | "lg" | null | undefined;
}

export function ArrayFieldManager({
  label,
  items,
  placeholderPrefix,
  onItemChange,
  onAddItem,
  onRemoveItem,
  itemClassName = "",
  buttonSize = "sm",
}: ArrayFieldManagerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-base font-medium">{label}</label>
        <Button type="button" variant="outline" size={buttonSize || "sm"} onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-1.5" /> Adicionar
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className={`flex items-center gap-2 ${itemClassName}`}>
          <Input
            value={item}
            placeholder={`${placeholderPrefix} ${index + 1}`}
            onChange={(e) => onItemChange(index, e.target.value)}
          />
          {items.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onRemoveItem(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
