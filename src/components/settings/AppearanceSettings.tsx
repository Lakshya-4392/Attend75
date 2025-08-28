import { Monitor, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light" | "system";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  const themes: Array<{
    name: string;
    value: Theme;
    icon: typeof Sun;
    description: string;
  }> = [
    {
      name: "Light",
      value: "light",
      icon: Sun,
      description: "Clean and bright interface"
    },
    {
      name: "Dark", 
      value: "dark",
      icon: Moon,
      description: "Easy on the eyes"
    },
    {
      name: "System",
      value: "system", 
      icon: Monitor,
      description: "Follows your system preference"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how the application looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">Theme</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {themes.map((themeOption) => (
              <Button
                key={themeOption.value}
                variant={theme === themeOption.value ? "default" : "outline"}
                className={cn(
                  "flex flex-col items-center justify-center h-auto p-4 space-y-2",
                  theme === themeOption.value && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => setTheme(themeOption.value)}
              >
                <themeOption.icon className="h-5 w-5" />
                <div className="text-center">
                  <div className="text-sm font-medium">{themeOption.name}</div>
                  <div className="text-xs opacity-70">{themeOption.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}