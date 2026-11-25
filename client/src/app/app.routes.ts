import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth.guard';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: AppComponent },
  { path: 'register', component: AppComponent },
  { path: 'post-job', component: AppComponent, canActivate: [authGuard, roleGuard(['recruiter', 'admin'])] },
  { path: 'applications', component: AppComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
