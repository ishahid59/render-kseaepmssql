import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {




// **FormFroup and FormControl is used to pass value instead og [(ngModel)], [(ngModel)] and Formgroup cannot be used together
  form = new FormGroup({
    // email: new FormControl(null, [Validators.required,Validators .email]),
    // password: new FormControl(null, Validators.required),
    UserID: new FormControl(null,[Validators.required] ),
    Password: new FormControl(null,[Validators.required] ),
  });

    user:any={}
    // email:string="f@f.com";
    // password:string="fff";

    loading2:boolean=false;
    formErrors:any=[{}];

    private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
    isLoggedIn$ = this._isLoggedIn$.asObservable();
    
 

  constructor(private http: HttpClient,private router: Router,public authService: AuthService,) {
    const token = localStorage.getItem('profanis_auth');
    this._isLoggedIn$.next(!!token);
  }


  // set the getters for convenience to use in html for validation
  // get email() {
  //   return this.form.get('email');
  // }
  // get password() {
  //   return this.form.get('password');
  // }

  get userid() {
    return this.form.get('UserID');
  }
  get password() {
    return this.form.get('Password');
  }


ngOnInit(){

  if (localStorage.getItem('token')!==null) {
    this.router.navigate(['/Home']);
  }


}

  // https://www.youtube.com/watch?v=7G7qzlblJcI
  // https://github.com/profanis/codeShotsWithProfanis/blob/18/auth-login-and-display-menu/src/app/login/login.component.html
  // https://www.youtube.com/watch?v=4dgCArSsyS4

  submitForm() {
  
   
// console.log("submited login form");
// console.log(this.form.controls['email'].value);
    this.loading2=true;

    // // check internet con first
    // var onlineOffline = navigator.onLine;
    // if (onlineOffline===false) {
    //   alert("no internet connection");
    //   return;
    // }
    
    // if (this.form.invalid) {
    //   this.loading2=false;
    //   return;
    // }

     this.authService
      // .login({ email: this.form.get('email')?.value, password: this.form.get('password')?.value })
      // **FormFroup and FormControl is used to pass value instead og [(ngModel)]
      .login(this.form.value)

      .subscribe((response) => {
        // this.$axios.defaults.headers.common["Authorization"] ="Bearer" + localStorage.getItem("token");
        // this.$axios.defaults.headers.common["Accept"] = "application/json";
        this.router.navigate(['/Home']);

        // // refresh dashboard else adminlte treeview not initialized
        setTimeout(() => {
          location.reload();
        }, 1);

        // this.authService.logedOut=false;//added later to hide login form when looged in
        // this.form.controls['email'].setValue(null); // to clear form
        // this.form.controls['password'].setValue(null); // to clear form
        this.loading2=false;
        // $("#contentwrapper").css("margin-left","230px");
        // $("#maincontent").css("padding-left","15px");
        // $("#maincontent").css("padding-top","15px");
        // $("#maincontent").css("padding-right","15px");
  
      },
        err => {
         
          // this.formErrors = err.error.errors;
          // // alert(err.error.errors[0].msg);
          
          this.loading2=false;

          // For Validation errors
          if (err.status === 422 || err.status === 400) {
            // alert(err.error.errors[0].msg);
            this.formErrors=err.error.errors;
          }
          else{
            alert(err.message);
          }
          
          // // For Validation errors
          // if (err.status === 422 || err.status === 400) {
          //   // alert(err.error.errors[0].msg);
          //   this.formErrors=err.error.errors;
          // }
          // // Unauthorized. For no token(401) or token failed varification(403)
          // else if (err.status === 401 || err.status === 403){
          //   alert(err.status +". "+ err.statusText);
          // }
          // // path not found
          // else if (err.status === 404 ){
          //   alert(err.status +". "+ err.statusText);
          // }
          // // "Internal server error"
          // else if (err.status === 500 ){
          //   alert( err.status +". "+ err.statusText);
          // }
          // // Unknown Error. Backend server not running
          // else if (err.status === 0 ){
          //   alert("Unknown Error. Connection refused");

          // }
          // // Other errors including sql errors(500-internal server error)
          // else {
          //   alert("Unknown Error");
          // }

          

          // // Validation errors
          // if (err.response.status === 422 || err.response.status === 400) {
          //   this.formErrors = err.response.data.errors;
          //   var arr = Object.keys(this.formErrors);
          //   var height = arr.length * 33;
          //    $("#emptoperrbar").css({"height": height + "px","border": "1px solid #ffb4bb"});
          // }

          // // For no token(401) or token failed varification(403)
          // else if (err.response.status === 401 || err.response.status === 403){
          //   this.formErrors = err.message 
          //    $("#emptoperrbar").css({ "height": 60 + "px", "padding": 10 + "px","border": "1px solid #ffb4bb" });
          // }

          // // Other errors including sql errors(500-internal server error)
          // else {
          //   this.formErrors = err.message + ". Please check network connection.";
          //   $("#emptoperrbar").css({ "height": 60 + "px", "padding": 10 + "px","border": "1px solid #ffb4bb" });
          // }


      });

      // if (!this.errors) {
      //   //route to new page
      // }

      // this.loading2=false;
    
  }

  // logout(){
  //   this.router.navigate(['/']);
  //   localStorage.removeItem('token');
  // }


  ngOnDestroy() {
    console.log('Login component destroyed');
  }

}













