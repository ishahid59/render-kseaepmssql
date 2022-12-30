import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeComponent } from './employee/employee.component';
import { JquerydatatableComponent } from './jquerydatatable/jquerydatatable.component';
import { LoginComponent } from './login/login.component';
import { IsAuthenticatedGuard } from './is-authenticated.guard';
import { HomeComponent } from './home/home.component';
import { EmpDetailComponent } from './emp-detail/emp-detail.component';
import { EmployeeSearchComponent } from './employee-search/employee-search.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// import { AboutComponent } from './about/about.component';
// import { ContactComponent } from './contact/contact.component';


// https://www.youtube.com/watch?v=Nehk4tBxD4o&t=504s

const routes: Routes = [ 
  {path:'', redirectTo: "Login",pathMatch:'full'},
  {path:'Login', component:LoginComponent},
  // {path:'', component:LoginComponent},
  {path:'Home', component: HomeComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'AngularDatatable', component: EmployeeComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'EmployeeSearch', component: EmployeeSearchComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'JqueryDatatable', component: JquerydatatableComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'Empdetail/:id', component: EmpDetailComponent,canActivate:[IsAuthenticatedGuard]},
  
  // page not found route.  wild card route must go last 
  {path:'**', component:PageNotFoundComponent},
 
  // {path:'About', component: AboutComponent},
  // {path:'Contact', component: ContactComponent},
];


// https://stackoverflow.com/questions/44912771/load-a-page-outside-the-router-outlet-in-angular-4
// const routes: Routes = [
//   { path: '', component: LoginComponent },
//   {
//     path: 'home', component: HomeComponent,
//     children: [
//       { path: 'AngularDatatable', component: EmployeeComponent, canActivate: [IsAuthenticatedGuard] },
//       { path: 'JqueryDatatable', component: JquerydatatableComponent, canActivate: [IsAuthenticatedGuard] },
//     ]
//   }
// ];

@NgModule({
  // imports: [RouterModule.forRoot(routes)], // Default is hash:false. Refresh wont work in deployment
  imports: [RouterModule.forRoot(routes, { useHash: true })], //https://stackoverflow.com/questions/65828232/how-can-i-prevent-404-not-found-error-in-angular-when-i-refresh-page
  exports: [RouterModule]
})
export class AppRoutingModule { }
