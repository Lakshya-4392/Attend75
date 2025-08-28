import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className={cn(
        "container py-6 transition-all duration-300 ease-in-out",
        isMobile && "pb-24", // Add bottom padding for mobile nav + footer
        className
      )}>
        {children}
      </main>

      {!isMobile && <Footer />}

      {isMobile && (
        <>
          <Footer className="pb-20" />
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <Navigation isMobile />
          </div>
        </>
      )}
    </div>
  );
}