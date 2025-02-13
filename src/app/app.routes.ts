import { Routes } from '@angular/router';
import { ContactComponent } from './pages/contact/contact.component';
import { CreationBookComponent } from './pages/creation-book/creation-book.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { AccountComponent } from './pages/account/account.component';

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
    {
        path: 'login',
        title: 'Login',
        component: LoginComponent,
    },
    {
        path: 'sign-in',
        title: 'Sign-In',
        component: SignInComponent,
    },
    {
        path: `account`,
        title: 'Account',
        component: AccountComponent,
    },
];
