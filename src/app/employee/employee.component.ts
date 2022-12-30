import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { EmployeeService } from '../services/employee.service';
import { createUrlTreeFromSnapshot } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { ThisReceiver } from '@angular/compiler';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { cleanData, data } from 'jquery';
import { TestBed } from '@angular/core/testing';
// import * as moment from 'moment';
import { Observable, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { EmpEditModalComponent } from '../emp-edit-modal/emp-edit-modal.component';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})


// export class CustomRangeSearchComponent implements OnDestroy, OnInit {
export class EmployeeComponent {


  constructor(private http: HttpClient, private empservice: EmployeeService,public datePipe: DatePipe,private router: Router,private commonService: CommonService) {
  }


  // // firstname for search is supplied from parent to child for angular-datatable, since table code is written in ngOnInit() 
  // // search input field is in parent component else ngOnInit() will clear all input in child component
  // @Input()
  // fname: string = "";



  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json


  // table data
  myData: any = ([]); // in angular should ([]) for array
  empid: any = 0; // to pass to child modal if used
  cmbJobtitle: any = ([]);
  cmbRegistration: any = ([]);

  formErrors:any=[{}];
  loading2:boolean=false;
  modalClicked="editModal"

  // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
  // editData from database 
  // editData: any = {
  //   empid: 0,
  //   firstname: "",
  //   lastname: "",
  //   jobtitle: 0,
  //   registration: 0
  // };

  // Search params
  searchFirstname: string = "";
  searchLastname: string = "";
  searchJobtitle: number = 0;
  searchRegistration: number = 0;


  // https://www.youtube.com/watch?v=Wr5urqswiko&list=PLQcBFrxTul9IQFF7fJz7jgdRYJz1OCbll&index=6
  // https://stackoverflow.com/questions/52771445/best-way-to-show-error-messages-for-angular-reactive-forms-one-formcontrol-mult
  employeeFormGroup = new FormGroup({
    empid: new FormControl(0),
    firstname: new FormControl('', [Validators.required]),
    // firstname: new FormControl(''),
    lastname: new FormControl('', [Validators.required]),
    // lastname: new FormControl(''),
    jobtitle: new FormControl(0),
    registration: new FormControl(0),
    hiredate: new FormControl(''), // should use null instead of ''
    consultant: new FormControl(0),
  });



  // set the getters for convenience to use in html for validation
  get firstname() {
    return this.employeeFormGroup.get('firstname');
  }
  get lastname() {
    return this.employeeFormGroup.get('lastname');
  }
  get jobtitle() {
    return this.employeeFormGroup.get('jobtitle');
  }
  get registration() {
    return this.employeeFormGroup.get('registration');
  }



  // CALL CHILD METHOD
  @ViewChild(EmpEditModalComponent)
  private empmainmodalcomponent!: EmpEditModalComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co


  //to use seperate child component for modal and call it from parent
  showEmpMainChildModal() {
    this.empmainmodalcomponent.showChildModal();
  }



  public ngOnInit(): void {

    // var onlineOffline = navigator.onLine;
    // if (onlineOffline===false) {
    //   alert("no internet connection");
    //   return;
    // }


    var that=this;

    // Angular-Datatable with POST Method
    // https://l-lin.github.io/angular-datatables/#/basic/server-side-angular-way
    // let additionalparameters = { token: '', firstname: this.searchFirstname,  lastname: this.searchLastname, }; // send additional params

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      serverSide: true,// server side processing
      lengthChange: true,
      lengthMenu: [ 10, 35, 50, 75, 100 ],
      // dom: 'Bfrtip',//'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // //"any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      // buttons: [
      //     // 'copy', 'csv', 'excel', 'pdf', 'print'
      //     'copy', 'csv', 'excel', 'pdf', 'print'
      // ],
 
      ajax: (dataTablesParameters: any, callback:any) => {
        this.http.post<any>(
          // 'http://localhost:5000/api/employee/search/angular-datatable',
          // '' + that.commonService.baseUrl + '/api/employee/search/angular-datatable',
          '' + that.commonService.baseUrl + '/api/employee',

          // Adding custom parameters: https://stackoverflow.com/questions/49645200/how-can-add-custom-parameters-to-angular-5-datatables
          // using Object.assign to bundle dataTablesParameters and additionalparameters in 1 object so that an additional  
          // parameter can be used for post,last parameter is for header which is passes in request header instead of body
          Object.assign(dataTablesParameters,
            {
              token: '',
              // firstname: this.searchFirstname,
              // lastname: this.searchLastname,
              // jobtitle: this.searchJobtitle,
              // registration: this.searchRegistration
              Firstname: this.searchFirstname,
              Lastname: this.searchLastname,
              JobTitle: this.searchJobtitle,
              Registration: this.searchRegistration
            }),
          {
            // ** Header is now coming from Auth.Inceptor file
            // headers: {
              // Authorization: "Bearer " + localStorage.getItem("token"),
              // Accept: "application/json" //the token is a variable which holds the token
            // }

            // headers: new HttpHeaders({
            //   'Content-Type':  'application/json',
            //   'Authorization': 'token',
            // })
          },
        ).subscribe(resp => {
          this.myData = resp.data; //use .data after resp for post method
          
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            // data: []
            //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            // data:  resp.data  // set data
            data: []
          });
        });
      },
      // columnDefs: [{
      //   "orderable": true,
      //   "targets": '_all'
      //   }],


    // // datatable columns nedded to export excel data. But visibility turned off so that data does not repeat. 
    // // As a result <thead> in html will not show. So <thead> is used twice to show headers in table 
    // columns: [
    //   { data: 'empid', title: "empid",visible:false }, 
    //   { data: 'firstname', title: 'firstname',visible:false }, 
    //   { data: 'lastname', title: 'lastname',visible:false  }, 
    //   { data: 'jobtitle', title: 'jobtitle', width: '210px',visible:false  }, 
    //   { data: 'registration', title: 'registration',visible:false  }, 
    //   { data: 'hiredate', title: 'hiredate', width: '100px',visible:false }, // date format converted in html since ang dttable gets data in html
    //   { data: null, title: 'Edit', width: '160px', "orderable": false,visible:false  }
    // ],

    // In datatable without search getting data from html template by callback data: [], to use edit, delete functionality with angular
    // But in search form data needs to come from here in order to export to excel.
    columns: [
      // { data: 'EmpID', title: "EmpID",visible:false }, 
      { data: 'EmployeeID', title: "EmployeeID",visible:true }, 
      // { data: 'Firstname', title: 'Firstname'}, 
      // { data: 'Lastname', title: 'Lastname'}, 
      { data: 'JobTitle', title: 'Jobtitle', width: '210px'}, 
      { data: 'Registration', title: 'Registration'}, 
      { data: 'HireDate', title: 'Hiredate'}, 
      { data: null, title: 'Edit', width: '160px', "orderable": false }
    ],


    };


    // // Angular-Datatable with GET (not working) should use POST as per example
    // // https://stackoverflow.com/questions/54144542/server-side-ajax-configuration-for-angular-datatables-for-get-request
    // this.dtOptions = {
    //   serverSide: true,
    //   processing: true,
    //   ajax: (dataTablesParameters: any, callback) => {
    //     const params = Object.assign( dataTablesParameters , {"firstname":"","lastname":"","jobtitle":0,"registration":0});
    //     console.log('params', params);
    //     this.http
    //       .get<any>(
    //         'http://localhost:5000/api/employee/',
    //         {
    //           params: params,
    //           // headers: new HttpHeaders().set(
    //           //   'token',
    //           //   localStorage.getItem('token')
    //           // )
    //         }
    //       )
    //       .subscribe(resp => {
    //         // this.myData = resp['data'];
    //         this.myData = resp.data;
    //         console.log(resp);
    //         callback({
    //           recordsTotal: resp['length'],
    //           recordsFiltered: resp['length'],
    //           data: []
    //         });
    //       });
    //   },
    //   // columns: [{ data: 'empid' }, { data: 'firstName' }, { data: 'jobtitle' }, { data: 'registration' }, { data: 'hiredate' }]
    // };
  }




  search() {
    this.refreshEmployeeDatatable();
  }




  // // For Angular-Datatable reload. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshEmployeeDatatable() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }




  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if (that.myData.length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });

// test to remove hash https://www.youtube.com/watch?v=j1ZHuyhHApg
// history.pushState({id:1},'','/AngularDatatable')


    // fill cmbs AfterViewInit
    // this.fillCmbEmpJobtitle();
    // this.fillCmbEmpRegistration();
    // this.fillAllCmb();// now using forkJoin of rxjx to call all cmbfill in one function
  }

  


// Fill all combos in one function using forkJoin of rxjx
  fillAllCmb() {
    forkJoin([
      this.empservice.getCmbEmpJobtitle(), //observable 1
      this.empservice.getCmbEmpRegistration() //observable 2
    ]).subscribe(([cmbEmpJobtitle, cmbEmpRegistration]) => {
      // When Both are done loading do something
      this.cmbJobtitle = cmbEmpJobtitle;
      this.cmbRegistration = cmbEmpRegistration;
    }, err => {
      alert(err.message);
      // alert("Problem filling Employee combos");
    });
    // if (!this.errors) {
    //   //route to new page
    // }
  }




  // Clear Search params
  clearSearch() {
    this.searchFirstname = "";
    this.searchLastname = "";
    this.searchJobtitle = 0;
    this.searchRegistration = 0;
    $('#dt').DataTable().search('').draw();//clear dt text search input
    this.search();
  }


  viewEmp(e: any) {
    alert("view emp with id: " + e.empid);
    // console.log(e);
     this.router.navigate(['/Empdetail']);
  }


  showEmpEditModal(e: any) {

    this.modalClicked="editModal"
    this.loading2=true;

    this.empservice.getEmployee(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      this.empid=resp.empid; // to pass to child modal if used
      this.employeeFormGroup.patchValue(resp);
      // OR
      // this.employeeFormGroup.controls['empid'].setValue(resp.empid);
      // this.employeeFormGroup.controls['firstname'].setValue(resp.firstname);
      // this.employeeFormGroup.controls['lastname'].setValue(resp.lastname);
      // this.employeeFormGroup.controls['jobtitle'].setValue(resp.jobtitle);
      // this.employeeFormGroup.controls['registration'].setValue(resp.registration);
      // this.employeeFormGroup.controls['hiredate'].setValue(resp.hiredate);
      // this.employeeFormGroup.controls['consultant'].setValue(resp.consultant);

      // Handle date : First datepipe used to convert date format, so that it can be shown in html input element properly
      // But null date returns 1/1/1970. So condition is used to convert only when date is not null
      if (this.employeeFormGroup.controls['hiredate'].value !== null) {
        var date = new Date(resp.hiredate);
        var formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");//output : 2018-02-13
        this.employeeFormGroup.controls['hiredate'].setValue(formattedDate);
      }

      this.loading2 = false;
    },
      err => {
        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors=err.error.errors;
        }
        else{
          alert(err.message);
        }
      });

    // if (!this.errors) {
    //   //route to new page
    // }
  }


  showEmpAddModal() {
    this.modalClicked="addModal"

    //  this.editData.empid= 0;
    //  this.editData.firstname= '';
    //  this.editData.lastname= '';
    //  this.editData.jobtitle= 0;
    //  this.editData.registration= 0;

    // clear form group since same group is used for edit and add
    // Now formgroup is used instead of data object to pass value
    this.employeeFormGroup.reset(); // to clear the previous validations
    // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
    this.employeeFormGroup.controls['empid'].setValue(0);
    this.employeeFormGroup.controls['firstname'].setValue('');
    this.employeeFormGroup.controls['lastname'].setValue('');    
    this.employeeFormGroup.controls['jobtitle'].setValue(0);
    this.employeeFormGroup.controls['registration'].setValue(0);
    this.employeeFormGroup.controls['hiredate'].setValue(null);  // should use null instead of ''
    this.employeeFormGroup.controls['consultant'].setValue(0);
  }



  // called form save clicked to detect any new errors on save click.
  clearFormErrors(){
    this.formErrors=[{}];
  }



  // saveEmp common for edit and add. Option to call 2 function from here 
  saveEmp() {

    // check internet connection first
    var onlineOffline = navigator.onLine;
    if (onlineOffline===false) {
      alert("no internet connection");
      return;
    }
    if (this.modalClicked == "editModal") {
      this.updateEmp();
    }
    if (this.modalClicked == "addModal") {
      this.addEmp();
    }
  }


  updateEmp() {
    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]

    this.loading2=true;

    if (this.employeeFormGroup.invalid) {
      this.loading2=false;
      return;
    }

    // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
    // which gives error while reading in form . So convert the date to "null" before saving empty string
    if (this.employeeFormGroup.controls['hiredate'].value === '') {
      this.employeeFormGroup.controls['hiredate'].setValue(null);
    }

    this.empservice.updateEmployee(this.employeeFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnEditCloseModal").click();
      this.refreshEmployeeDatatable();
      this.loading2=false;
    },
      err => {
        // console.log(error.response.data);
        // console.log(error.error.errors[0].param); //working
        // console.log(error.error.errors[0].msg); //working

        this.loading2=false;

        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors=err.error.errors;
        }
        else{
          alert(err.message);
        }

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

  }





  addEmp() {
    this.loading2=true;
    this.empservice.addEmployee(this.employeeFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnEditCloseModal").click();
      this.refreshEmployeeDatatable();
      this.loading2=false;
    },
      err => {
        this.loading2=false;

        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors=err.error.errors;
        }
        else{
          alert(err.message);
        }
      });
    // if (!this.errors) {
    //   //route to new page
    // }

  }



  deleteEmp(e: any) {
    this.empservice.deleteEmployee(e).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      this.refreshEmployeeDatatable();
    },
      err => {
        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors=err.error.errors;
        }
        else{
          alert(err.message);
        }
      });

    // if (!this.errors) {
    //   //route to new page
    // }
  }



}
