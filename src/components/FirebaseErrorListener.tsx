
'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * A component that listens for globally emitted 'permission-error' events.
 * Instead of throwing (which crashes the app), it shows a non-intrusive alert.
 */
export function FirebaseErrorListener() {
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      setError(error);
      // Still log to console for debugging
      console.warn('Firestore Permission Error:', error.request);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  if (!error) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:max-w-md">
      <Alert variant="destructive" className="glass-panel border-red-500/50 bg-red-950/20 backdrop-blur-xl">
        <ShieldAlert className="h-4 w-4" />
        <div className="flex justify-between items-start w-full">
          <div className="flex-grow">
            <AlertTitle className="font-bold">Database Access Issue</AlertTitle>
            <AlertDescription className="text-xs mt-1">
              The request to <code className="bg-black/20 px-1 rounded">{error.request.path}</code> was denied. 
              The app will attempt to continue, but some data may be missing.
            </AlertDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 -mr-2 -mt-2 hover:bg-white/10"
            onClick={() => setError(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
}
