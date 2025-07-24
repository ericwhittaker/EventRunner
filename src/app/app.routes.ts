/** ANGULAR ROUTER */
import { Routes } from '@angular/router';

/** COMPONENTS - (LOGIN & LOADING) */
import { LoginComponent } from './components/auth/login.component';

/** COMPONENTS - (VIEWS) */
import { EventsDashComponent } from './components/events-dash/events-dash';
import { TripsComponent } from './components/trips/trips.component';
import { BuildTasksComponent } from './components/build-tasks/build-tasks';
import { VenuesComponent } from './components/venues/venues.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { UsersComponent } from './components/users/users.component';
import { AdminComponent } from './components/admin/admin.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';

/** GUARDS */
import { AuthGuard } from './guards/auth.guard';










console.log('(E-TRAK) File: app.routes.ts #(const routes)# is being created.');

export const routes: Routes = [
  // Login route (public)
  {
    path: 'login',
    component: LoginComponent
  },
  
  // Protected routes (require authentication)
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: EventsDashComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'trips',
    component: TripsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'build-log',
    component: BuildTasksComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'venues',
    component: VenuesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contacts',
    component: ContactsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'event/:id',
    component: EventDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

console.log('(E-TRAK) File: app.routes.ts #(const routes)# has been created.');

