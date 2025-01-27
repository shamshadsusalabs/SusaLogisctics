import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngxs/store';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import {  provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Service/auth.interceptor';
import { DriverState } from './Store/state/driver';
import { VendorState } from './Store/state/vendor';
import { OperatorState } from './Store/state/Operator';
import { VehicleState } from './Store/state/vehical';
import { PatnerState } from './Store/state/Patner';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore(
      [DriverState,VendorState,OperatorState,VehicleState,PatnerState],
      withNgxsReduxDevtoolsPlugin(),
      withNgxsLoggerPlugin()
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) // Combine both configurations here
    ),
   // Add HttpClientModule here
  ]
};
