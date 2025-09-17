import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import {
  TranslateModule,
  TranslateLoader,
  DEFAULT_LANGUAGE,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

// This function is used to configure the TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    // ✅ Provide the router
    provideRouter(routes),

    // ✅ Enable Fetch API for better performance
    provideHttpClient(withFetch()),

    // ✅ Provide the TranslateModule with loader configuration
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),

    // ✅ Set Default Language
    {
      provide: DEFAULT_LANGUAGE,
      useValue: 'en',
    },

    // ✅ Enable Client Hydration
    provideClientHydration(),
  ],
};
