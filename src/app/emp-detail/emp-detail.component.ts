import { Component,ViewChild,QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { DatePipe,Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { EmpDegreeComponent } from '../emp-degree/emp-degree.component';
import { Observable, forkJoin, of } from 'rxjs';
import { EmpEditModalComponent } from '../emp-edit-modal/emp-edit-modal.component';
import { CommonService } from '../services/common.service';
import { ProPhotoComponent } from '../pro-photo/pro-photo.component'; // test pro photo in Empdetail

@Component({
  selector: 'app-emp-detail',
  templateUrl: './emp-detail.component.html',
  styleUrls: ['./emp-detail.component.css'],
})


export class EmpDetailComponent {

  emp: any = {};
//{{emp.empid}} giving error in console so converted to "empid" only for interpolation 
EmpID:any=0; 
EmployeeID:any=''; 
Firstname:any=""; 
Lastname:any=""; 
MiddleI:any=""; 
FullName:any=""; 
JobTitle:any=0; 
Department:any=0; 
Prefix:any=0; 
Suffix:any=0; 
Registration:any=0; 
HireDate:any=""; 
EmployeeStatus:any=0; 
ComID:any=0; 
DisciplineSF330:any=0; 
DisciplineSF254:any=0; 
Employee_Consultant:any=0; 
ImageDataWeb:any=""; 


dynamicimagepath:any='';
activeTabClass:string="";

  id: any = null;
  loading2:boolean=false;
  formErrors:any=[{}];
  lstEmpID:any= [];
  findid: any = '';
  cmbEmp:any=[{}];

  // CALL CHILD METHOD
  @ViewChild(EmpDegreeComponent) empdegreecomponent!:EmpDegreeComponent;


  constructor(private router: Router, public activatedRoute: ActivatedRoute,private empservice: EmployeeService,public datePipe: DatePipe,private location: Location,private commonService: CommonService) {
    // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
  }


 // CALL CHILD METHOD
 @ViewChild(EmpEditModalComponent)
 private empmainmodalcomponent!: EmpEditModalComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co

 // Not using. Using in html [class.tr_selected]="indexOfelement == 0 in pro-photo.html
 // CALL CHILD METHOD
 // used to show first row of prophotodt selected on load by calling child method  
// Not using.
// @ViewChild(ProPhotoComponent)
// private prophotocomponent!: ProPhotoComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co


// Not using.
// @ViewChild(EmpDegreeComponent)
// private empdegreeomponent!: EmpDegreeComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co



  //to use seperate child component for modal and call it from parent
  showEmpMainChildModal() {
    this.empmainmodalcomponent.showChildModal();
  }

  

  // Not using. Using in html [class.tr_selected]="indexOfelement == 0 in pro-photo.html
  // selectChildFirstRow() {
  //   this.prophotocomponent.selectFirstRow();
  // }


  // not using now
  // // refresh/reload child ProPhotodatatable on tab click
  // refreshChildProPhoto() {
  //   this.prophotocomponent.refreshDatatableProPhoto();
  // }


  // not using now
  // // refresh/reload child EmpDegreedatatable on tab click
  // refreshChildEmpDegree() {
  //   this.empdegreeomponent.refreshDatatableEmpDegree();
  // }


  ngOnInit() {
    // this.loadEmpDetail();
    this.fillEmpCmb();
    // //child tabs initially will be updated using parent to child @Input()
    // //On emp cmb search child tabs will be updated using this.empdegreecomponent.loadAngularDatatable(); in findbyemployeeid() method
    
    // // option1
    // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
    // this.emp = this.loadEmpDetail();
    // this.fillEmpCmb();


    // OPTION2  https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // ngOnInit() only called once so empcmb click will not refresh page. So we are using observable 
    this.activatedRoute.paramMap.subscribe((param)=>{
      this.id=param.get('id')
      this.emp = this.loadEmpDetail();
      this.findid=this.id; // set the initial value findid
    })
    

  }



  findbyemployeeid() {
    // // https://medium.com/@mvivek3112/reloading-components-when-change-in-route-params-angular-deed6107c6bb
    // this.router.navigate(['/Empdetail/' + this.findid + '']);
   
    // // after many search browser back only changes url not the page. So following is used so that going back
    // // with take to datatable page without showing all the search pages in url
    // // https://stackoverflow.com/questions/38891002/angular-2-replace-history-instead-of-pushing
    // this.location.replaceState('/Empdetail/' + this.findid + '');


    // // // this will load whole page
    // // setTimeout(() => {
    // //  location.reload();
    // // }, 1);


    // //Async observable: https://stackoverflow.com/questions/52115904/how-to-call-a-function-after-the-termination-of-another-function-in-angular/52116252

    // //this will only update emp
    // setTimeout(() => {
    //   this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
    //   this.loadEmpDetail()
    // }, 2);

    // setTimeout(() => {
    //   this.empdegreecomponent.loadAngularDatatable();
    // }, 3);
    // this.id = this.activatedRoute.snapshot.paramMap.get('id');
  // setTimeout(() => {
      // this.empdegreecomponent.loadAngularDatatable();
    // }, 3);

    // this.empdegreeomponent.refreshDatatableEmpDegree();
    // this.prophotocomponent.refreshDatatableProPhoto();
  }



  // findbyemployeeid() {

  //   this.findid = $("#selectemployeeid").val();

  //   // to find detail page for emp but looses history and reloads entire page
  //   // this :key is used for fid by Employeeid in detail page to avoid whole page reload . This :key will
  //   // check for any change in route and remount the page without reloading. History is also preserved   -->
  //   // https://laracasts.com/discuss/channels/vue/vue-2-reload-component-when-same-route-is-requested?page=1 -->
  //   // this line is added in master.blade.php <router-view :key="$route.fullPath"></router-view>
  //   this.$router.push({
  //     name: "empdetail", // name property of this route must be used in route list to use with parameter
  //     params: { empid: this.findid },
  //     query: { this: this.findid } // query param is used to pass empid to detail page to use it for refresh(id is lost in detail page when page is refreshed)
  //   });
  // },



  loadEmpDetail() {

    // alert("empdetail loaded");

    // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
    this.loading2 = true;

    this.empservice.getEmpdetail(this.id).subscribe(resp => {
      this.emp = resp;

     //{{emp.empid}} giving error in console so converted to "empid" only for interpolation 
        this.EmpID= resp.EmpID,
        this.EmployeeID= resp.EmployeeID,
        this.Firstname= resp.Firstname,
        this.Lastname= resp.Lastname,
        this.MiddleI= resp.MiddleI,
        this.FullName= resp.FullName,
        this.JobTitle= resp.JobTitle,
        this.Department= resp.Department,
        this.Prefix= resp.Prefix,
        this.Suffix= resp.Suffix,
        this.Registration= resp.Registration,
        this.HireDate= resp.HireDate,
        this.EmployeeStatus= resp.EmployeeStatus,
        this.ComID= resp.ComID,
        this.DisciplineSF330= resp.DisciplineSF330,
        this.DisciplineSF254= resp.DisciplineSF254,
        this.Employee_Consultant= resp.Employee_Consultant,
        this.ImageDataWeb= resp.ImageDataWeb,

        this.dynamicimagepath = '' + this.commonService.baseUrl + '/img/empphoto/' + this.ImageDataWeb;



      this.loading2 = false;
    },
      err => {
        alert(err.message);
        this.loading2 = false;
      });
  }


  

  // Fill all combos in one function using forkJoin of rxjx
  fillEmpCmb() {
    this.empservice.getCmbEmp().subscribe(resp => {
      this.cmbEmp = resp;
      // console.log(resp);
    },
      err => {
        alert(err.message);
      });
  }


}
