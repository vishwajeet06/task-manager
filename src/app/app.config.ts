import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideStore } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TaskEffects } from './core/state/task.effects';
import { taskReducer } from './core/state/task.reducer';
import { MatNativeDateModule } from '@angular/material/core';
import { activityReducer } from './core/state/activity.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore({ tasks: taskReducer, activity: activityReducer }),
    importProvidersFrom(EffectsModule.forRoot([TaskEffects])),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(MatNativeDateModule),
  ],
};
