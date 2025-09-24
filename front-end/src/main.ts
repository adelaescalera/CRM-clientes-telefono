import { bootstrapApplication } from '@angular/platform-browser';
import { routes } from './app/app.routes';
import { App } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';


bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
}
).catch(err => console.error(err));

