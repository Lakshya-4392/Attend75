import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ColorCustomizerProps {
  onClose: () => void;
}

const colorPresets = [
  { name: "Teal", value: "175 75% 45%", class: "bg-teal-500" },
  { name: "Orange", value: "25 95% 53%", class: "bg-orange-500" },
  { name: "Blue", value: "217 91% 60%", class: "bg-blue-500" },
  { name: "Red", value: "0 84% 60%", class: "bg-red-500" },
  { name: "Green", value: "142 71% 45%", class: "bg-green-500" },
  { name: "Purple", value: "262 83% 58%", class: "bg-purple-500" },
  { name: "Black", value: "0 0% 9%", class: "bg-black" },
];

export function ColorCustomizer({ onClose }: ColorCustomizerProps) {
  const setAccentColor = (colorValue: string) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colorValue);
    root.style.setProperty('--ring', colorValue);
    
    // Save to localStorage with error handling
    try {
      localStorage.setItem('accent-color', colorValue);
    } catch (error) {
      console.warn('Failed to save color preference:', error);
    }
  };

  // Load saved color on mount with error handling
  try {
    const savedColor = localStorage.getItem('accent-color');
    if (savedColor) {
      const root = document.documentElement;
      root.style.setProperty('--primary', savedColor);
      root.style.setProperty('--ring', savedColor);
    }
  } catch (error) {
    console.warn('Failed to load saved color preference:', error);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-4 top-20 w-80">
        <Card className="bg-background/95 backdrop-blur-xl border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Customize Colors</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Choose your accent color:</p>
              <div className="grid grid-cols-2 gap-3">
                {colorPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    className="flex items-center justify-start gap-3 h-12"
                    onClick={() => setAccentColor(preset.value)}
                  >
                    <div className={cn("w-4 h-4 rounded-full", preset.class)} />
                    <span>{preset.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}