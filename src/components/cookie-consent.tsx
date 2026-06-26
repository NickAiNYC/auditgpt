'use client';

import { useEffect, useState } from 'react';

const COOKIE_CONSENT_KEY = 'auditgpt_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consented) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-50 flex flex-col sm:flex-row items-center gap-4 text-sm text-foreground/85 shadow-lg">
      <p className="flex-1 text-xs leading-relaxed">
        We use only essential cookies for authentication and a privacy-friendly analytics cookie to improve the Service. No advertising or tracking cookies. By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies.{' '}
        <a href="/legal" className="underline hover:text-foreground">
          Learn more
        </a>
      </p>
      <button
        onClick={accept}
        className="bg-black text-white px-5 py-2 rounded-sm text-xs font-mono uppercase tracking-wider whitespace-nowrap hover:bg-black/80 transition-colors"
      >
        Accept
      </button>
    </div>
  );
}
