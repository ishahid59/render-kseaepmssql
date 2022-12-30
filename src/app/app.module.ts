import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DataTablesModule } from "angular-datatables";
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {EmployeeComponent} from './employee/employee.component';
import {ReactiveFormsModule} from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { JquerydatatableComponent } from './jquerydatatable/jquerydatatable.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { DatePipe } from '@angular/common';
import { AuthInterceptorProvider } from './auth.interceptor';
import { HomeComponent } from './home/home.component';
import { EmpDetailComponent } from './emp-detail/emp-detail.component';
import { EmpDegreeComponent } from './emp-degree/emp-degree.component';
import { EmpRegComponent } from './emp-reg/emp-reg.component';
import { EmpEditModalComponent } from './emp-edit-modal/emp-edit-modal.component';
import { EmployeeSearchComponent } from './employee-search/employee-search.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProPhotoComponent } from './pro-photo/pro-photo.component';
// import { HashLocationStrategy, LocationStrategy,PathLocationStrategy } from '@angular/common'; //LocationStrategy is used to refresh page after deployment
import { LightboxModule } from 'ngx-lightbox';
// import * as fileSaver from 'file-saver';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    JquerydatatableComponent,
    LoginComponent,
    NavigationComponent,
    HomeComponent,
    EmpDetailComponent,
    EmpDegreeComponent,
    EmpRegComponent,
    EmpEditModalComponent,
    EmployeeSearchComponent,
    PageNotFoundComponent,
    ProPhotoComponent,
 
    
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    LightboxModule 

  ],
  providers: [AuthInterceptorProvider,DatePipe], // datepipe used to convert date format to show in html date element
  //LocationStrategy is used to refresh page after deployment with htaccess file
    // providers: [AuthInterceptorProvider,DatePipe,{provide: LocationStrategy, useClass: PathLocationStrategy} ], // datepipe used to convert date format to show in html date element

  // providers: [AuthInterceptorProvider,DatePipe,{provide: LocationStrategy, useClass: HashLocationStrategy} ], // datepipe used to convert date format to show in html date element
  bootstrap: [AppComponent]
})
export class AppModule { }
