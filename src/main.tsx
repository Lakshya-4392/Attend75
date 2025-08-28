import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './App.css';

// Error handling for missing root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Make sure you have a div with id='root' in your HTML.");
}

// Create root with error handling
const root = createRoot(rootElement);

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // In production, you might want to send this to an error reporting service
});

// Global error handler for JavaScript errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // In production, you might want to send this to an error reporting service
});

// Render the app with StrictMode for better development experience
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Performance monitoring (optional - can be removed in production)
if (import.meta.env.DEV) {
  // Log performance metrics in development
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log('App Performance Metrics:', {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
      totalLoadTime: perfData.loadEventEnd - perfData.fetchStart,
    });
  });
}
