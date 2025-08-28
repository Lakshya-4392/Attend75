import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

// Lazy load pages for better performance
const Home = React.lazy(() => import("./pages/Home"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Subjects = React.lazy(() => import("./pages/Subjects"));
const DutyLeave = React.lazy(() => import("./pages/DutyLeave"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const Terms = React.lazy(() => import("./pages/Terms"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Configure React Query with optimized defaults for attendance app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

// Loading component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Card className="w-full max-w-md">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="loading-skeleton w-12 h-12 rounded-full mb-4"></div>
        <p className="text-muted-foreground">Loading Attend 75...</p>
      </CardContent>
    </Card>
  </div>
);

// Error boundary fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Card className="w-full max-w-md">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-2">
          <Button onClick={resetErrorBoundary} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={() => window.location.reload()}>
            Reload App
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const App = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error: Error, errorInfo: { componentStack: string }) => {
      // Log error for debugging (in production, send to error reporting service)
      console.error('Attendance App Error:', error, errorInfo);
    }}
  >
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="attendance-theme">
        <TooltipProvider delayDuration={300}>
          <Toaster />
          <Sonner 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
          <BrowserRouter>
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/subjects" element={<Subjects />} />
                  <Route path="/duty-leave" element={<DutyLeave />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
