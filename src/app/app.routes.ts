/** ANGULAR ROUTER */
import { Routes } from '@angular/router';

/** COMPONENTS - (LAYOUTS) */
import { MainLayoutComponent } from './components/layouts/main-layout.component';

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
  // Public routes (no layout)
  {
    path: 'login',
    component: LoginComponent
  },
  
  // Protected routes with main layout (header, optional sidebar/footer)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: EventsDashComponent
      },
      {
        path: 'trips',
        component: TripsComponent
      },
      {
        path: 'build-log',
        component: BuildTasksComponent
      },
      {
        path: 'venues',
        component: VenuesComponent
      },
      {
        path: 'contacts',
        component: ContactsComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'admin',
        children: [
          {
            path: '',
            component: AdminComponent
          },
          {
            path: 'dashboard',
            component: AdminComponent
          },
          {
            path: 'users',
            component: UsersComponent
          },
          {
            path: 'settings',
            component: AdminComponent
          }
        ]
      },
      {
        path: 'event/:id',
        component: EventDetailComponent
      }
    ]
  },
  
  // Fallback
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

console.log('(E-TRAK) File: app.routes.ts #(const routes)# has been created.');

