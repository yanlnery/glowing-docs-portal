import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Monitor, Smartphone } from 'lucide-react';

export type ImageFocusPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ImageFocusSelectorProps {
  focusDesktop: string;
  focusMobile: string;
  onFocusDesktopChange: (value: string) => void;
  onFocusMobileChange: (value: string) => void;
  disabled?: boolean;
  showPreview?: boolean;
  imageUrl?: string;
}

const FOCUS_OPTIONS: { value: ImageFocusPosition; label: string }[] = [
  { value: 'center', label: 'Centro' },
  { value: 'top', label: 'Topo' },
  { value: 'bottom', label: 'Base' },
  { value: 'left', label: 'Esquerda' },
  { value: 'right', label: 'Direita' },
  { value: 'top-left', label: 'Topo Esquerda' },
  { value: 'top-right', label: 'Topo Direita' },
  { value: 'bottom-left', label: 'Base Esquerda' },
  { value: 'bottom-right', label: 'Base Direita' },
];

export function getObjectPosition(focus: string | null | undefined): string {
  const positions: Record<string, string> = {
    'center': 'center',
    'top': 'top',
    'bottom': 'bottom',
    'left': 'left',
    'right': 'right',
    'top-left': 'top left',
    'top-right': 'top right',
    'bottom-left': 'bottom left',
    'bottom-right': 'bottom right',
  };
  return positions[focus || 'center'] || 'center';
}

export function ImageFocusSelector({
  focusDesktop,
  focusMobile,
  onFocusDesktopChange,
  onFocusMobileChange,
  disabled = false,
  showPreview = false,
  imageUrl,
}: ImageFocusSelectorProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Enquadramento da Imagem</Label>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Desktop Focus */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Monitor className="h-4 w-4" />
            <span>Desktop</span>
          </div>
          <Select
            value={focusDesktop || 'center'}
            onValueChange={onFocusDesktopChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Centro" />
            </SelectTrigger>
            <SelectContent>
              {FOCUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Focus */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="h-4 w-4" />
            <span>Mobile</span>
          </div>
          <Select
            value={focusMobile || 'center'}
            onValueChange={onFocusMobileChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Centro" />
            </SelectTrigger>
            <SelectContent>
              {FOCUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview */}
      {showPreview && imageUrl && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Desktop Preview */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Preview Desktop</span>
            <div className="relative aspect-video bg-muted rounded-md overflow-hidden border">
              <img
                src={imageUrl}
                alt="Preview Desktop"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: getObjectPosition(focusDesktop) }}
              />
            </div>
          </div>
          
          {/* Mobile Preview */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Preview Mobile</span>
            <div className="relative aspect-[9/16] max-h-32 bg-muted rounded-md overflow-hidden border mx-auto">
              <img
                src={imageUrl}
                alt="Preview Mobile"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: getObjectPosition(focusMobile) }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageFocusSelector;
