'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface LedgerPageProps {
  initialHtml: string;
}

declare global {
  interface Window {
    __initLKB?: () => void;
  }
}

export default function LedgerPage({ initialHtml }: LedgerPageProps) {
  useEffect(() => {
    // Whenever Home mounts or user navigates back from /apply, re-run initialization and routing
    if (typeof window !== 'undefined' && typeof window.__initLKB === 'function') {
      window.__initLKB();
    }
  }, []);

  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: initialHtml }}
        style={{ width: '100%', minHeight: '100vh', margin: 0, padding: 0 }}
      />
      <Script
        src="/ledger.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined' && typeof window.__initLKB === 'function') {
            window.__initLKB();
          }
        }}
      />
    </>
  );
}
