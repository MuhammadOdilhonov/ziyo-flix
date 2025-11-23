import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './pages/navbar`s/Navbar';
import Footer from './pages/footer/Footer';
import NavbarLeft from './pages/navbar`s/NavbarLeft';
import NavbarMedia from './pages/navbar`s/NavbarMedia';
import { setJsonLdById } from './utils/seo';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Initialize theme on app load
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const website = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: origin,
      name: "ZiyoFlix",
      potentialAction: {
        "@type": "SearchAction",
        target: `${origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
    const organization = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ZiyoFlix",
      url: origin,
      logo: `${origin}/Ziyo-Flix-Logo.png`
    };
    setJsonLdById('ld-website', website);
    setJsonLdById('ld-organization', organization);
  }, []);

  return (
    <div className="App" data-theme={localStorage.getItem('theme') || 'light'}>
      {location.pathname.startsWith("/reels") ? (
        <NavbarLeft />
      ) : (
        <Navbar />
      )}

      <Outlet />
      <NavbarMedia />
      {!location.pathname.startsWith("/reels") && (
        <Footer />
      )}

    </div>
  );
}

export default App;
