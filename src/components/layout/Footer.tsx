import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(
      "w-full border-t border-border/50 bg-background/50 backdrop-blur-sm py-6 mt-12",
      className
    )}>
      <div className="container">
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Designed & Developed by{" "}
            <a 
              href="https://bento.me/lakshyaashwini" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Lakshya Ashwini
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}