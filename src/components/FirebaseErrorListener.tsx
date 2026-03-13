
'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * A component that listens for globally emitted 'permission-error' events.
 * The UI has been hidden as requested.
 */
export function FirebaseErrorListener() {
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      setError(error);
      // Still log to console for debugging purposes
      console.warn('Firestore Permission Error (Hidden):', error.request);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // Return null to hide the visual alert while maintaining the error listener for background debugging
  return null;
}
