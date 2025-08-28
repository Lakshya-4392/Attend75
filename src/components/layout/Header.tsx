import { Palette, LogIn, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColorCustomizer } from "./ColorCustomizer";
import { useState, useEffect } from "react";
import AuthModal from "@/components/auth/AuthModal";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [showColorCustomizer, setShowColorCustomizer] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem("attend75_auth_token");
      const userDataStr = localStorage.getItem("attend75_user");

      if (authToken && userDataStr) {
        setIsAuthenticated(true);
        setUserData(JSON.parse(userDataStr));
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleAuthSuccess = () => {
    const authToken = localStorage.getItem("attend75_auth_token");
    const userDataStr = localStorage.getItem("attend75_user");

    if (authToken && userDataStr) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(userDataStr));
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("attend75_auth_token");
    localStorage.removeItem("attend75_user");
    setIsAuthenticated(false);
    setUserData(null);
    navigate("/");
  };

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full border-none bg-background/20 backdrop-blur-xl supports-[backdrop-filter]:bg-background/10",
        className
      )}>
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">Attend 75</span>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Authentication */}
            {isAuthenticated && userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{userData.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAuthModalTab("login");
                    setShowAuthModal(true);
                  }}
                  className="h-9 px-3 gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAuthModalTab("signup");
                    setShowAuthModal(true);
                  }}
                  className="h-9 px-3 gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Button>
              </div>
            )}

            {/* Color Customizer */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowColorCustomizer(!showColorCustomizer)}
              className="h-9 w-9"
            >
              <Palette className="h-4 w-4" />
              <span className="sr-only">Customize colors</span>
            </Button>

            {showColorCustomizer && (
              <ColorCustomizer onClose={() => setShowColorCustomizer(false)} />
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        initialTab={authModalTab}
      />
    </>
  );
}