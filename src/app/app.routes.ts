import { Routes } from '@angular/router';
import { ContactComponent } from './pages/contact/contact.component';
import { CreationBookComponent } from './pages/creation-book/creation-book.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        title: 'Dashboard',
        component: DashboardComponent,
    },
    {
        path: 'creation-book',
        title: 'Book Creation',
        component: CreationBookComponent,
    },
    {
        path: 'contact',
        title: 'App Home Page',
        component: ContactComponent,
    },
];
