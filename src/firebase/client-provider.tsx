
'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export const FirebaseClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const firebaseStack = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider value={firebaseStack}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
};
