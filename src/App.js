import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import AnalysisSection from './components/AnalysisSection';
import BottomCTA from './components/BottomCTA';
import DataAdminPage from './components/DataAdminPage';
import DataDeletionPage from './components/DataDeletionPage';
import SharedAnalysisPage from './components/SharedAnalysisPage';
import AdminAuth from './components/AdminAuth';
import { scrollToElement, isAdminAuthenticated, clearAdminSession } from './utils';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [sharedAnalysisId, setSharedAnalysisId] = useState(null);

  // Simple routing based on URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the #
      
      if (hash === 'admin') {
        setCurrentPage('admin');
        setSharedAnalysisId(null);
        // Check if already authenticated
        setIsAdminAuth(isAdminAuthenticated());
      } else if (hash === 'delete') {
        setCurrentPage('delete');
        setSharedAnalysisId(null);
      } else if (hash.startsWith('share/')) {
        // Extract analysis ID from share/ANALYSIS_ID
        const analysisId = hash.split('/')[1];
        if (analysisId) {
          setCurrentPage('shared');
          setSharedAnalysisId(analysisId);
        } else {
          setCurrentPage('home');
          setSharedAnalysisId(null);
        }
        setIsAdminAuth(false);
      } else {
        setCurrentPage('home');
        setSharedAnalysisId(null);
        setIsAdminAuth(false);
      }
    };

    // Set initial page based on current hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Security: Clear admin session on page unload
    const handleBeforeUnload = () => {
      if (currentPage === 'admin') {
        clearAdminSession();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentPage]);

  const handleScrollToUpload = () => {
    scrollToElement('upload-section');
  };

  const handleAdminAuthenticated = () => {
    setIsAdminAuth(true);
  };

  const handleGoHome = () => {
    window.location.hash = '';
    setCurrentPage('home');
    setSharedAnalysisId(null);
    setIsAdminAuth(false);
  };

  // Shared analysis page
  if (currentPage === 'shared' && sharedAnalysisId) {
    return (
      <SharedAnalysisPage 
        analysisId={sharedAnalysisId} 
        onGoHome={handleGoHome}
      />
    );
  }

  // Admin authentication flow
  if (currentPage === 'admin') {
    if (!isAdminAuth) {
      return <AdminAuth onAuthenticated={handleAdminAuthenticated} />;
    }
    return <DataAdminPage />;
  }

  // Delete page
  if (currentPage === 'delete') {
    return <DataDeletionPage />;
  }

  // Main landing page
  return (
    <Layout>
      <HeroSection onScrollToUpload={handleScrollToUpload} />
      <AnalysisSection />
      <BottomCTA />
    </Layout>
  );
};

export default App;