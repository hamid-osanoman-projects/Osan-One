import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface PipWindowProps {
  title?: string;
  width?: number;
  height?: number;
  onClose?: () => void;
  children: React.ReactNode;
}

export function PipWindow({
  title = 'Osan HR Widget',
  width = 320,
  height = 420,
  onClose,
  children,
}: PipWindowProps) {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  const openPip = useCallback(async () => {
    // Check if the API is supported
    if (!('documentPictureInPicture' in window)) {
      alert('Picture-in-Picture is not supported in your browser.');
      return;
    }

    try {
      // @ts-ignore - Document Picture-in-Picture API types might not be in standard DOM yet
      const pip = await window.documentPictureInPicture.requestWindow({
        width,
        height,
      });

      // Copy styles from main document to PiP document
      const styleSheets = Array.from(document.styleSheets);
      styleSheets.forEach((styleSheet) => {
        try {
          if (styleSheet.href) {
            const link = pip.document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet.href;
            pip.document.head.appendChild(link);
          } else if (styleSheet.cssRules) {
            const style = pip.document.createElement('style');
            Array.from(styleSheet.cssRules).forEach((rule) => {
              style.appendChild(pip.document.createTextNode(rule.cssText));
            });
            pip.document.head.appendChild(style);
          }
        } catch (e) {
          console.warn('Failed to copy stylesheet to PiP window', e);
        }
      });

      // Handle PiP window close event
      pip.addEventListener('pagehide', () => {
        setPipWindow(null);
        if (onClose) onClose();
      });

      pip.document.title = title;
      
      // Setup base body styles for PiP
      pip.document.body.className = "bg-background text-white font-sans selection:bg-primary/30 antialiased overflow-hidden";
      pip.document.body.style.margin = "0";
      pip.document.body.style.height = "100vh";

      setPipWindow(pip);
    } catch (error) {
      console.error('Failed to open PiP window:', error);
    }
  }, [width, height, title, onClose]);

  useEffect(() => {
    openPip();
    return () => {
      if (pipWindow) {
        pipWindow.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  if (!pipWindow) return null;

  return createPortal(children, pipWindow.document.body);
}
