import { Home, BarChart3, Plus, FileText, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/subjects", label: "Subjects", icon: Plus },
  { href: "/duty-leave", label: "Duty Leave", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface NavigationProps {
  className?: string;
  isMobile?: boolean;
}

export function Navigation({ className, isMobile = false }: NavigationProps) {
  if (isMobile) {
    return (
      <nav className={cn("flex border-none bg-background/30 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 touch-pan-x", className)}>
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-2 py-3 text-xs transition-all duration-300 hover:transform hover:scale-105 select-none",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    );
  }

  return (
    <nav className={cn("hidden border-none lg:block bg-background/20 backdrop-blur-xl supports-[backdrop-filter]:bg-background/10", className)}>
      <div className="container">
        <div className="flex space-x-8">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-2 border-b-2 border-transparent px-1 py-4 text-sm font-medium transition-all duration-300 hover:text-foreground hover:transform hover:scale-105",
                  isActive
                    ? "border-primary text-primary"
                    : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}