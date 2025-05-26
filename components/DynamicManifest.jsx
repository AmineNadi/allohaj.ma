'use client';
import { useEffect } from 'react';

export default function DynamicManifest() {
  useEffect(() => {
    const isAdmin = window.location.pathname.startsWith('/login');
    const manifestLink = document.querySelector('link[rel="manifest"]');

    if (manifestLink) {
      manifestLink.setAttribute('href', isAdmin ? '/manifest-admin.json' : '/manifest-client.json');
    }

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', isAdmin ? '#222222' : '#8936FF');
    }
  }, []);

  return null;
}
