import { Injectable } from '@angular/core';

// must use @Injectable with providedIn: 'root' to use in other components
@Injectable({
  providedIn: 'root'
})

export class CommonService{
    myGlobalVar;
    myfirstname:string='';

    // baseUrl:string="https://aepnode.onrender.com"
    // baseUrl:string="https://aepnodemssql.onrender.com"
     baseUrl:string="http://localhost:5000";

    constructor(){
      this.myGlobalVar = true;
      // alert("My intial global variable value is: " + this.myGlobalVar);
    }

    setMyGV(val: boolean){
      this.myGlobalVar = val;
    }

    getMyGV(val: boolean){
      return this.myGlobalVar;
    }
}