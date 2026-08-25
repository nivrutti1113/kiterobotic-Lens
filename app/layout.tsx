'use client';

import React, { useState, useEffect } from 'react';
import '@/app/globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SupportedLanguage } from '@/lib/languages';
import { webSerialBridge } from '@/lib/web-serial';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [hardwareConnected, setHardwareConnected] = useState(false);

  useEffect(() => {
    const unsub = webSerialBridge.subscribeStatus((status) => {
      setHardwareConnected(status.connected);
    });
    return () => unsub();
  }, []);

  const handleConnectHardware = async () => {
    const res = await webSerialBridge.connect();
    setHardwareConnected(res.connected);
  };

  return (
    <html lang={currentLang} className="dark">
      <body className="bg-gray-950 text-white min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-gray-950">
        <Navbar
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          hardwareConnected={hardwareConnected}
          onConnectHardware={handleConnectHardware}
        />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
