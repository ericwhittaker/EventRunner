/** ANGULAR ROUTER */
import { Routes } from '@angular/router';

/** COMPONENTS - (LOGIN & LOADING) */
/** TBD */

/** COMPONENTS - (VIEWS) */
import { DashboardComponent } from './components/dashboard/dashboard.component';










console.log('(E-TRAK) File: app.routes.ts #(const routes)# is being created.');

export const routes: Routes = [
  {
    path: '', component: DashboardComponent
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path: 'events',
    loadComponent: () => import('./components/events-viewer/events-viewer.component').then(c => c.EventsViewerComponent)
  },
  {
    path: 'trips',
    loadComponent: () => import('./components/trips/trips.component').then(c => c.TripsComponent)
  },
  {
    path: 'build-log',
    loadComponent: () => import('./components/build-log/build-log.component').then(c => c.BuildLogComponent)
  },
  {
    path: 'venues',
    loadComponent: () => import('./components/venues/venues.component').then(c => c.VenuesComponent)
  },
  {
    path: 'contacts',
    loadComponent: () => import('./components/contacts/contacts.component').then(c => c.ContactsComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./components/users/users.component').then(c => c.UsersComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin.component').then(c => c.AdminComponent)
  },
  {
    path: 'migration',
    loadComponent: () => import('./components/migration.component').then(c => c.MigrationComponent)
  },
  {
    path: 'event/:id',
    loadComponent: () => import('./components/event-detail/event-detail.component').then(c => c.EventDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

console.log('(E-TRAK) File: app.routes.ts #(const routes)# has been created.');

