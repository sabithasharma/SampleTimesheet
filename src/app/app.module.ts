import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TMSEntryComponent } from './components/tmsEntry/tmsEntry.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TMSApprovalComponent } from './components/tmsApproval/tmsApproval.component';
import { AboutComponent } from './components/about/about.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
//import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { RouterModule, Routes } from '@angular/router';
import { routes } from './app.router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AccordionModule} from 'primeng/accordion'; 
import { HttpModule } from '@angular/http';
                //api
import {FileUploadModule,ButtonModule,GrowlModule, ChartModule, CalendarModule, SharedModule} from 'primeng/primeng';
//const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
import 'hammerjs';
import { FileSelectDirective } from 'ng2-file-upload';
import {
  MatAutocompleteModule,  MatButtonModule,  MatButtonToggleModule,  MatCardModule,  MatCheckboxModule,  MatChipsModule,  MatDatepickerModule,
  MatDialogModule,  MatExpansionModule,  MatGridListModule,  MatIconModule,  MatInputModule,  MatListModule,  MatMenuModule,  MatNativeDateModule,
  MatPaginatorModule,  MatProgressBarModule,  MatProgressSpinnerModule,  MatRadioModule,  MatRippleModule,  MatSelectModule,  MatSidenavModule,
  MatSliderModule,  MatSlideToggleModule,  MatSnackBarModule,  MatSortModule,  MatTableModule,  MatTabsModule,  MatToolbarModule,  MatTooltipModule,
  MatStepperModule,  MatFormFieldModule
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TMSEntryComponent,
    ProjectsComponent,
    TMSApprovalComponent,
    AboutComponent,
    ProfileComponent,
    RegisterComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
   // RouterModule.forRoot(routes,   { enableTracing: true }),
    //SocketIoModule.forRoot(config),
    routes,
    BrowserAnimationsModule,
      MatAutocompleteModule,  MatButtonModule,  MatButtonToggleModule,  MatCardModule,  MatCheckboxModule,  MatChipsModule,  MatDatepickerModule,  MatDialogModule,
      MatExpansionModule,  MatGridListModule,  MatIconModule,  MatInputModule,  MatListModule,  MatMenuModule,  MatNativeDateModule,  MatPaginatorModule,  MatProgressBarModule,
      MatProgressSpinnerModule,  MatRadioModule,  MatRippleModule,  MatSelectModule,  MatSidenavModule,  MatSliderModule,  MatSlideToggleModule,
      MatSnackBarModule,  MatSortModule,  MatTableModule,  MatTabsModule,  MatToolbarModule,  MatTooltipModule,  MatStepperModule,  MatFormFieldModule,
   FormsModule,ReactiveFormsModule,
   FileUploadModule,ButtonModule,GrowlModule,ChartModule, CalendarModule, SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
