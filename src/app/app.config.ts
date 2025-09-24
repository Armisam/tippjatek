import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyBLKm358fi1UccnZda8-svRe2sUh60nCPs",
        authDomain: "tippjatek-63c96.firebaseapp.com",
        projectId: "tippjatek-63c96",
        storageBucket: "tippjatek-63c96.firebasestorage.app",
        messagingSenderId: "590907780911",
        appId: "1:590907780911:web:1e80613c93f09a5fb6fbda"
      })
    ),
    provideFirestore(() => getFirestore()),
  ]
};
