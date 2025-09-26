import { ApplicationConfig,provideZoneChangeDetection } from '@angular/core'; //browserglobalerror no me deja
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
//import { provideBrowserGlobalErrorListeners} from '@angular/core';

// usar primeng
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura'; // usamos Aura 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
//    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
};
