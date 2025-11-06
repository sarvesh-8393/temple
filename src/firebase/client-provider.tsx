
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// This component is now a pass-through and could be removed,
// but is kept for structural consistency in case Firebase is re-enabled.
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
    return <>{children}</>;
}
