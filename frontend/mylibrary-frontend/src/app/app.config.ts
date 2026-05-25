import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    // O sistema de detecção de mudanças
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideBrowserGlobalErrorListeners(),
    
    provideRouter(routes),
    
    providePrimeNG({
      theme: {
          preset: Aura,
          options: {
          darkModeSelector: 'none' 
        }
      }
    }),

    provideAnimationsAsync(),
    provideHttpClient(),
    MessageService
  ]
};