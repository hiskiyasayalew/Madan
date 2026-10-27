'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext({
  isAssetLoaded: false,
  setAssetLoaded: (val: boolean) => {},
});

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAssetLoaded, setAssetLoaded] = useState(false);

  // Use callback to prevent unnecessary re-renders
  const handleSetAssetLoaded = useCallback((val: boolean) => {
    setAssetLoaded(val);
  }, []);

  return (
    <LoadingContext.Provider value={{ isAssetLoaded, setAssetLoaded: handleSetAssetLoaded }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);