import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component'
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: 'expenses', component: ExpensesComponent },
      { path: 'subscriptions', component: SubscriptionsComponent },
      { path: 'settings', component: SettingsComponent },
    ]
  }
  ];