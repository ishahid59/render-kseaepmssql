import { Component, ViewChild,HostListener } from '@angular/core';
import { CommonService } from './services/common.service';
import { Subject } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { observable,of as observableOf  } from 'rxjs';
import { LoginComponent } from './login/login.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})



export class AppComponent {

  constructor(public authService: AuthService,private router: Router) {}

  // myappser:AppService =new AppService();
  changingValue: Subject<boolean> = new Subject();
  title = 'angulardttest';
  logedin:boolean=true;



 ngOnInit(){
  // alert("main init")


 }



  ngOnDestroy() {
    // alert("main destroyed")
  }


  
  logout() {
    this.router.navigate(['/']);
    localStorage.removeItem('token');
    this.authService.isLoggedIn$ = observableOf(false);

    // location reload is called to forcefully refresh login form after logout else it doesnt triger ondestroy() second time and dasboard doesnt show after login
    // location.reload();
    setTimeout(() => {
      location.reload();
    }, 1);
    // this.authService.logedOut=true; //added later to hide login form when looged in
    // $(".wrapper").css("margin-left","0px !important");
  }





  // firstname for search is supplied from parent to child for angular-datatable, since table code is written in ngOnInit() 
  // search input field is in parent component else ngOnInit() will clear all input in child component
  // firstname: string = "";

  // CALL CHILD METHOD
  // @ViewChild(CustomRangeSearchComponent)
  // private CustomRangeSearchComponent!: CustomRangeSearchComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co

  // // CALL CHILD METHOD
  // // https://stackoverflow.com/questions/65934987/how-to-call-child-components-method-from-parent-component
  // callChildSearch() {
  //   this.CustomRangeSearchComponent.SearchAngularTable();
  // }

  // ClearAngularTableSearch() {
  //  var that=this;
  //   this.firstname = "";
  //   // this.callChildSearch();
  //   // this.CustomRangeSearchComponent.SearchAngularTable();
  //   setTimeout<any>(function() {
  //     that.CustomRangeSearchComponent.SearchAngularTable()
  //   }, 5);
   
  // }



}
