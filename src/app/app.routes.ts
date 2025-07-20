/** ANGULAR ROUTER */
import { Routes } from '@angular/router';

/** COMPONENTS - (LOGIN & LOADING) */
/** TBD */

/** COMPONENTS - (VIEWS) */
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TripsComponent } from './components/trips/trips.component';
import { BuildTasksComponent } from './components/build-tasks/build-tasks';
import { VenuesComponent } from './components/venues/venues.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { UsersComponent } from './components/users/users.component';
import { AdminComponent } from './components/admin/admin.component';
import { MigrationComponent } from './components/migration.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';










console.log('(E-TRAK) File: app.routes.ts #(const routes)# is being created.');

export const routes: Routes = [
  {
    path: '', component: DashboardComponent
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path: 'trips', component: TripsComponent
  },
  {
    path: 'build-log', component: BuildTasksComponent
  },
  {
    path: 'venues', component: VenuesComponent
  },
  {
    path: 'contacts', component: ContactsComponent
  },
  {
    path: 'users', component: UsersComponent
  },
  {
    path: 'admin', component: AdminComponent
  },
  {
    path: 'migration', component: MigrationComponent
  },
  {
    path: 'event/:id', component: EventDetailComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

console.log('(E-TRAK) File: app.routes.ts #(const routes)# has been created.');

