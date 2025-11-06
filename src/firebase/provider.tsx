
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';

// Mock types to avoid hard dependency on 'firebase' package
type FirebaseApp = object;
type Firestore = object;
type Auth = object;
type User = object;
type Error = object;


// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean; // True if core services (app, firestore, auth instance) are provided
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  // User authentication state
  user: User | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null; // Error from auth listener
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

// Dummy props for the provider
interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp?: FirebaseApp;
  firestore?: Firestore;
  auth?: Auth;
}

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 * This is a MOCKED version and does not connect to Firebase.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
}) => {

  // Memoize a mock context value.
  const contextValue = useMemo((): FirebaseContextState => ({
    areServicesAvailable: false,
    firebaseApp: null,
    firestore: null,
    auth: null,
    user: null,
    isUserLoading: false,
    userError: null,
  }), []);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

// All hooks will now throw an error if used, since Firebase is mocked.
const FAKE_HOOK_ERROR = "Firebase is currently mocked. This hook is not available.";

export const useFirebase = () => {
  throw new Error(FAKE_HOOK_ERROR);
};

export const useAuth = (): Auth => {
  throw new Error(FAKE_HOOK_ERROR);
};

export const useFirestore = (): Firestore => {
    throw new Error(FAKE_HOOK_ERROR);
};

export const useFirebaseApp = (): FirebaseApp => {
  throw new Error(FAKE_HOOK_ERROR);
};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
    return useMemo(factory, deps);
}

export const useUser = () => {
  throw new Error(FAKE_HOOK_ERROR);
};
