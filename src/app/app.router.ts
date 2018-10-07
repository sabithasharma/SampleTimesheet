import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TMSEntryComponent } from './components/tmsEntry/tmsEntry.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TMSApprovalComponent } from './components/tmsApproval/tmsApproval.component';
import { AboutComponent } from './components/about/about.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';

export const router: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'tmsEntry', component: TMSEntryComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: 'tmsApproval', component: TMSApprovalComponent},
    { path: 'about', component: AboutComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'register', component: RegisterComponent}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);