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
import { file } from 'jszip';

@Component({
  selector: 'app-employee-search',
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.css']
})
export class EmployeeSearchComponent {



  constructor(private http: HttpClient, private empservice: EmployeeService, public datePipe: DatePipe, private router: Router,private commonService: CommonService) {
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

  cmbJobtitle: any = [];
  cmbDepartment: any = ([]);
  cmbPrefix: any = ([]);
  cmbSuffix: any = ([]);
  cmbRegistration: any = ([]);
  cmbDisciplineSF330: any = ([]);
  cmbDisciplineSF254: any = ([]);
  cmbEmployeeStatus: any = ([]);
  cmbComid: any = ([]);




  formErrors: any = [{}];
  loading2: boolean = false;
  modalClicked = "editModal"

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
  searchEmployeeid: string = "";
  searchFirstname: string = "";
  searchLastname: string = "";
  searchJobtitle: number = 0;
  searchRegistration: number = 0;


  // https://www.youtube.com/watch?v=Wr5urqswiko&list=PLQcBFrxTul9IQFF7fJz7jgdRYJz1OCbll&index=6
  // https://stackoverflow.com/questions/52771445/best-way-to-show-error-messages-for-angular-reactive-forms-one-formcontrol-mult
  employeeFormGroup = new FormGroup({
    EmpID: new FormControl(0),
    EmployeeID: new FormControl(''),
    Firstname: new FormControl('', [Validators.required]),
    Lastname: new FormControl('', [Validators.required]),
    MiddleI: new FormControl(''), 
    FullName: new FormControl(''), 
    JobTitle: new FormControl(0),
    Department: new FormControl(0),
    Prefix: new FormControl(0),
    Suffix: new FormControl(0),
    Registration: new FormControl(0),
    HireDate: new FormControl(''), // should use null instead of ''
    EmployeeStatus: new FormControl(0),
    ComID: new FormControl(0),
    DisciplineSF330: new FormControl(0),
    DisciplineSF254: new FormControl(0),
    ExpWithOtherFirm: new FormControl(0),
    Employee_Consultant: new FormControl(0),
    ImageDataWeb:new FormControl(''),
    
  });


  image:any= {}; //'/images/employee/AlthaverDB.jpg',
  //dynamic image path. Needed because img src is binded with formdata and has a path. 
  //so when user pick another image he cannot immidiately see the image since it it not stored in the path yet
  //to solve this dynamicimagepath is used
  dynamicimagepath:any= '';

  Image: any={}; // not in database



  // set the getters for convenience to use in html for validation
  get firstname() {
    return this.employeeFormGroup.get('Firstname');
  }
  get lastname() {
    return this.employeeFormGroup.get('Lastname');
  }
  get jobtitle() {
    return this.employeeFormGroup.get('JobTitle');
  }
  get registration() {
    return this.employeeFormGroup.get('Registration');
  }



  // CALL CHILD METHOD
  @ViewChild(EmpEditModalComponent)
  private empmainmodalcomponent!: EmpEditModalComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co


  //to use seperate child component for modal and call it from parent
  showEmpMainChildModal() {
    this.empmainmodalcomponent.showChildModal();
    
  }





  // image related ******************************************************************************************
  // https://codepen.io/Atinux/pen/qOvawK/
  onFileChange(e:any) {
    var files = e.target.files || e.dataTransfer.files;
    if (!files.length)
      return;
    this.createImage(files[0]);
    var fileData = e.target.files[0];
    this.image = fileData;
    this.Image = e.target.files[0]; // save the image to formdata
  }

  createImage(file:any) {
    var image = new Image();
    var reader = new FileReader();
    // var vm = this;
    reader.onload = (e:any) => {
      // vm.image = e.target.result;
      this.image = e.target.result;
      this.dynamicimagepath = e.target.result;
      // alert(this.dynamicimagepath);
    };
    reader.readAsDataURL(file);
  }


 
  removeImage(e:any) {
    this.image = '';
    this.Image = ''; // Added for addmode
    // this.imagefilename='';
    // this.formdata.ImageData = '';
    this.employeeFormGroup.controls['ImageDataWeb'].setValue('');
    this.dynamicimagepath = "";
    $("#ImageData").val(''); // to remove file name from file input// TODO if ImageData or ImageDataWeb
  }


// uploadFile(e:any){
//   console.log("file selected");
//   // const file= (e.target as HTMLInputElement).files?.[0];
//   // this.Image=file;
//   this.Image=e.target.files[0];
// }


//*****************************************************************************************************************************



  public ngOnInit(): void {

    // var onlineOffline = navigator.onLine;
    // if (onlineOffline===false) {
    //   alert("no internet connection");
    //   return;
    // }




    var that = this;

    // Angular-Datatable with POST Method
    // https://l-lin.github.io/angular-datatables/#/basic/server-side-angular-way
    // let additionalparameters = { token: '', firstname: this.searchFirstname,  lastname: this.searchLastname, }; // send additional params

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      serverSide: true,// server side processing
      lengthChange: false,
      // lengthMenu: [ 10, 35, 50, 75, 100 ],
      dom: 'Blfrtip',//'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // //"any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      buttons: [
        // 'copy', 'csv', 'excel', 'pdf', 'print'
        'excel', 'csv', 'pdf', 'print'
      ],

      ajax: (dataTablesParameters: any, callback: any) => {
        this.http.post<any>(
          // 'http://localhost:5000/api/employee/search/angular-datatable',
          // '' + that.commonService.baseUrl + '/api/employee/search/angular-datatable',
          '' + that.commonService.baseUrl + '/api/employee/search-angular-datatable',


          // Adding custom parameters: https://stackoverflow.com/questions/49645200/how-can-add-custom-parameters-to-angular-5-datatables
          // using Object.assign to bundle dataTablesParameters and additionalparameters in 1 object so that an additional  
          // parameter can be used for post,last parameter is for header which is passes in request header instead of body
          Object.assign(dataTablesParameters,
            {
              token: '',
              firstname: this.searchFirstname,
              lastname: this.searchLastname,
              jobtitle: this.searchJobtitle,
              registration: this.searchRegistration
              // Firstname: this.searchFirstname,
              // Lastname: this.searchLastname,
              // JobTitle: this.searchJobtitle,
              // Registration: this.searchRegistration
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
            data: resp.data  // set data
          });
        });
      },

      columnDefs: [
        // {
        // "orderable": true,
        // "targets": '_all',
        // },
        {
          "targets": 4, // center action column
          "className": "text-center",
          "orderable": false,
          // "width": "4%"
        },
      ],



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

      columns: [
        // { data: 'EmpID', title: "EmpID" }, 
        // {
        //   render: (data: any, type: any, row: any) => {
        //     // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
        //     return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.Firstname + "</a> ";
        //   }, title: 'Firstname'
        // },
        {
          render: (data: any, type: any, row: any) => {
            // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
            return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.EmployeeID + "</a> ";
          }, title: 'EmployeeID'
        },
        // { data: 'Lastname', title: 'Lastname' },
        { data: 'JobTitle', title: 'Jobtitle', width: '210px' },
        { data: 'Registration', title: 'Registration' },
        // { data: 'HireDate', title: 'Hiredate' },
        {
          render: (data: any, type: any, row: any) => {
            return this.datePipe.transform(row.HireDate, "MM/dd/yyyy");
          }, title: 'Hiredate'
        },
        {
          render: (data: any, type: any, row: any) => {
            return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
          }, title: 'Action', width: '160px'
        },
      ],



      // ** Calling angular method from within datatable. Routerlink is more smoth than a tag since it swith between components 
      // https://stackoverflow.com/questions/47529333/render-column-in-data-table-with-routerlink
      // https://l-lin.github.io/angular-datatables/#/advanced/row-click-event
      // https://datatables.net/reference/option/rowCallback
      // buttons in same column //https://datatables.net/forums/discussion/56914/rowcallback-mode-responsive
      rowCallback: (row: Node, data: any[] | Object, index: number) =>{
        const self = this;

        // Firstname col
        jQuery('a:eq(0)', row).unbind('click');
        jQuery('a:eq(0)', row).bind('click', () => { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
          self.rowFirstNameClickHandler(data);
        });
        // // Detail col, Note: put a "," after "a" tag for the second column"
        // jQuery('a,:eq(5)', row).unbind('click');
        // jQuery('a,:eq(5)', row).bind('click', () => { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
        //   self.rowFirstNameClickHandler(data);
        // });

        // Action column with 3 "a" tags in same column  // https://datatables.net/forums/discussion/56914/rowcallback-mode-responsive
        const eltdetail = $('td', row).find('a.btn-detail');
        if (eltdetail) {
          eltdetail.unbind('click');
          eltdetail.bind('click', () => {
            this.rowDetailClickHandler(data);
          });
        }
        const eltedit = $('td', row).find('a.btn-edit');
        if (eltedit) {
          eltedit.unbind('click');
          eltedit.bind('click', () => {
            this.rowEditClickHandler(data);
          });
        }
        const eltdelete = $('td', row).find('a.btn-delete');
        if (eltdelete) {
          eltdelete.unbind('click');
          eltdelete.bind('click', () => {
            this.rowDeleteClickHandler(data);
          });
        }
      return row;
      },

    }; // end dtOptions

    this.fillAllCmb();// now using forkJoin of rxjx to call all cmbfill in one function


  } // end onInit()



// Action column handlers connecting to angular methods directly from within jquatu table
  rowFirstNameClickHandler(data:any) {
    this.router.navigate(['/Empdetail/' + data.EmpID]);
    // this.router.navigate(['/Empdetail/1']);// + data.EmpID]);

  }
  rowDetailClickHandler(data:any) {
    // alert("Detail Handler: "+data.firstname+"");
    this.router.navigate(['/Empdetail/' + data.EmpID]);
  }
  rowEditClickHandler(data:any) {
    // alert("Edit Handler: "+data.firstname+"");
    this.showEmpEditModal(data) // for edit pass only data instead of data.empid
  }
  rowDeleteClickHandler(data:any) {
    // alert("Delete Handler: "+data.firstname+"");
    this.deleteEmp(data);
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

    // fill cmbs AfterViewInit
    // this.fillCmbEmpJobtitle();
    // this.fillCmbEmpRegistration();
    // this.fillAllCmb();// now using forkJoin of rxjx to call all cmbfill in one function
  }



  // // Fill all combos in one function using forkJoin of rxjx
  // fillAllCmb() {
  //   forkJoin([
  //     this.empservice.getCmbEmpJobtitle(), //observable 1
  //     this.empservice.getCmbEmpRegistration() //observable 2
  //   ]).subscribe(([cmbEmpJobtitle, cmbEmpRegistration]) => {
  //     // When Both are done loading do something
  //     this.cmbJobtitle = cmbEmpJobtitle;
  //     this.cmbRegistration = cmbEmpRegistration;
  //   }, err => {
  //     alert(err.message);
  //     // alert("Problem filling Employee combos");
  //   });
  //   // if (!this.errors) {
  //   //   //route to new page
  //   // }
  // }



  // Fill all combos in one function using forkJoin of rxjx
  fillAllCmb() {
    this.loading2 = true;
    this.empservice.getCmbEmpListAll().subscribe(resp => {
      this.cmbJobtitle = resp[0].jobtitle;
      this.cmbDepartment = resp[1].department;
      this.cmbPrefix = resp[2].prefix;
      this.cmbSuffix = resp[3].suffix;
      this.cmbRegistration = resp[4].registration;
      this.cmbDisciplineSF330 = resp[5].disciplinesf330;
      this.cmbDisciplineSF254 = resp[6].disciplinesf254;
      this.cmbEmployeeStatus = resp[7].employeestatus;
      this.cmbComid = resp[8].comid;
      this.loading2 = false;      
    },
      err => {
        alert(err.message);
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

    this.clearForm()
    this.modalClicked = "editModal"
    this.loading2 = true;

    this.empservice.getEmployee(e).subscribe(resp => {
      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
console.log(resp)
      this.empid = resp.EmpID; // to pass to child modal if used
      this.employeeFormGroup.patchValue(resp);
      // OR
      // this.employeeFormGroup.controls['empid'].setValue(resp.empid);
      // this.employeeFormGroup.controls['firstname'].setValue(resp.firstname);
      // this.employeeFormGroup.controls['lastname'].setValue(resp.lastname);
      // this.employeeFormGroup.controls['jobtitle'].setValue(resp.jobtitle);
      // this.employeeFormGroup.controls['registration'].setValue(resp.registration);
      // this.employeeFormGroup.controls['hiredate'].setValue(resp.hiredate);
      // this.employeeFormGroup.controls['consultant'].setValue(resp.consultant);
//  alert(this.employeeFormGroup.controls['HireDate'].value)
      // Handle date : First datepipe used to convert date format, so that it can be shown in html input element properly
      // But null date returns 1/1/1970. So condition is used to convert only when date is not null
      if (this.employeeFormGroup.controls['HireDate'].value !== null) {
       
        var date = new Date(resp.HireDate);
        var formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");//output : 2018-02-13
        this.employeeFormGroup.controls['HireDate'].setValue(formattedDate);
      }


      // load the image from the path and this.formdata.ImageData 
      // this.dynamicimagepath = "images/empphoto/" + this.formdata.ImageData;
      this.dynamicimagepath = '' + this.commonService.baseUrl + '/img/empphoto/' + this.employeeFormGroup.controls['ImageDataWeb'].value;

      console.log(this.employeeFormGroup.controls['MiddleI'].value);

      this.loading2 = false;
    },
      err => {
        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors = err.error.errors;
        }
        else {
          alert(err.message);
        }
      });

    // if (!this.errors) {
    //   //route to new page
    // }

  }


  showEmpAddModal() {
    this.modalClicked = "addModal"

    //  this.editData.empid= 0;
    //  this.editData.firstname= '';
    //  this.editData.lastname= '';
    //  this.editData.jobtitle= 0;
    //  this.editData.registration= 0;

    // clear form group since same group is used for edit and add
    // Now formgroup is used instead of data object to pass value
    this.employeeFormGroup.reset(); // to clear the previous validations
    // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
    this.employeeFormGroup.controls['EmpID'].setValue(0);
    this.employeeFormGroup.controls['EmployeeID'].setValue('');
    this.employeeFormGroup.controls['Firstname'].setValue('');
    this.employeeFormGroup.controls['Lastname'].setValue('');
    this.employeeFormGroup.controls['MiddleI'].setValue('');
    this.employeeFormGroup.controls['FullName'].setValue('');
    this.employeeFormGroup.controls['JobTitle'].setValue(0);
    this.employeeFormGroup.controls['Department'].setValue(0);
    this.employeeFormGroup.controls['Prefix'].setValue(0);
    this.employeeFormGroup.controls['Suffix'].setValue(0);
    this.employeeFormGroup.controls['Registration'].setValue(0);
    this.employeeFormGroup.controls['HireDate'].setValue(null);  // should use null instead of ''
    this.employeeFormGroup.controls['EmployeeStatus'].setValue(0);
    this.employeeFormGroup.controls['ComID'].setValue(0);
    this.employeeFormGroup.controls['DisciplineSF330'].setValue(0);
    this.employeeFormGroup.controls['DisciplineSF254'].setValue(0);
    this.employeeFormGroup.controls['ExpWithOtherFirm'].setValue(0);
    this.employeeFormGroup.controls['Employee_Consultant'].setValue(0);
    this.employeeFormGroup.controls['ImageDataWeb'].setValue('');
  }








clearForm(){
  this.employeeFormGroup.reset(); // to clear the previous validations
  // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
  this.employeeFormGroup.controls['EmpID'].setValue(0);
  this.employeeFormGroup.controls['EmployeeID'].setValue('');
  this.employeeFormGroup.controls['Firstname'].setValue('');
  this.employeeFormGroup.controls['Lastname'].setValue('');
  this.employeeFormGroup.controls['MiddleI'].setValue('');
  this.employeeFormGroup.controls['FullName'].setValue('');
  this.employeeFormGroup.controls['JobTitle'].setValue(0);
  this.employeeFormGroup.controls['Department'].setValue(0);
  this.employeeFormGroup.controls['Prefix'].setValue(0);
  this.employeeFormGroup.controls['Suffix'].setValue(0);
  this.employeeFormGroup.controls['Registration'].setValue(0);
  this.employeeFormGroup.controls['HireDate'].setValue(null);  // should use null instead of ''
  this.employeeFormGroup.controls['EmployeeStatus'].setValue(0);
  this.employeeFormGroup.controls['ComID'].setValue(0);
  this.employeeFormGroup.controls['DisciplineSF330'].setValue(0);
  this.employeeFormGroup.controls['DisciplineSF254'].setValue(0);
  this.employeeFormGroup.controls['ExpWithOtherFirm'].setValue(0);
  this.employeeFormGroup.controls['Employee_Consultant'].setValue(0);
  this.employeeFormGroup.controls['ImageDataWeb'].setValue('');
}

  // called form save clicked to detect any new errors on save click.
  clearFormErrors() {
    this.formErrors = [{}];
  }



  // saveEmp common for edit and add. Option to call 2 function from here 
  saveEmp() {

    // check internet connection first
    var onlineOffline = navigator.onLine;
    if (onlineOffline === false) {
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

    this.loading2 = true;

    if (this.employeeFormGroup.invalid) {
      this.loading2 = false;
      return;
    }
    

    // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
    // which gives error while reading in form . So convert the date to "null" before saving empty string
      if (this.employeeFormGroup.controls['HireDate'].value === '' || this.employeeFormGroup.controls['HireDate'].value === null) {
        this.employeeFormGroup.controls['HireDate'].setValue(null);
      }


      if (this.employeeFormGroup.controls['MiddleI'].value==null) {
        this.employeeFormGroup.controls['MiddleI'].setValue('');
      }


// New FormData to Upload file. File input cannot be uploaded without Js formData https://www.youtube.com/watch?v=8TRNKTwe1Fk
//******************************************************************************* */

const fd:any=new FormData();
fd.append("EmpID", this.employeeFormGroup.controls['EmpID'].value);
fd.append("EmployeeID", this.employeeFormGroup.controls['EmployeeID'].value);
fd.append("Firstname", this.employeeFormGroup.controls['Firstname'].value);
fd.append("Lastname", this.employeeFormGroup.controls['Lastname'].value);
fd.append("MiddleI", this.employeeFormGroup.controls['MiddleI'].value);
fd.append("FullName", this.employeeFormGroup.controls['FullName'].value);
fd.append("JobTitle", this.employeeFormGroup.controls['JobTitle'].value);
fd.append("Department", this.employeeFormGroup.controls['Department'].value);
fd.append("Prefix", this.employeeFormGroup.controls['Prefix'].value);
fd.append("Suffix", this.employeeFormGroup.controls['Suffix'].value);
fd.append("Registration", this.employeeFormGroup.controls['Registration'].value);
fd.append("HireDate", this.employeeFormGroup.controls['HireDate'].value);
fd.append("EmployeeStatus", this.employeeFormGroup.controls['EmployeeStatus'].value);
fd.append("ComID", this.employeeFormGroup.controls['ComID'].value);
fd.append("DisciplineSF330", this.employeeFormGroup.controls['DisciplineSF330'].value);
fd.append("DisciplineSF254", this.employeeFormGroup.controls['DisciplineSF254'].value);
fd.append("ExpWithOtherFirm", this.employeeFormGroup.controls['ExpWithOtherFirm'].value);
fd.append("Employee_Consultant", this.employeeFormGroup.controls['Employee_Consultant'].value);
fd.append("ImageDataWeb", this.employeeFormGroup.controls['ImageDataWeb'].value);
// fd.append("Image", this.Image);

console.log(this.employeeFormGroup.controls['MiddleI'].value);

if (this.Image !== "null") {
  fd.append('Image',this.Image);
}


    // this.empservice.updateEmployee(this.employeeFormGroup.value).subscribe(resp => {
      this.empservice.updateEmployee(fd).subscribe(resp => { //for formData
      // $("#empeditmodal").modal("hide");
      $("#btnEditCloseModal").click();
      this.refreshEmployeeDatatable();
      this.loading2 = false;
    },
      err => {
        // console.log(error.response.data);
        // console.log(error.error.errors[0].param); //working
        // console.log(error.error.errors[0].msg); //working

        this.loading2 = false;

        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors = err.error.errors;
        }
        else {
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
    this.loading2 = true;


    if (this.employeeFormGroup.invalid) {
      this.loading2 = false;
      return;
    }
    

    // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
    // which gives error while reading in form . So convert the date to "null" before saving empty string
      if (this.employeeFormGroup.controls['HireDate'].value === '' || this.employeeFormGroup.controls['HireDate'].value === null) {
        this.employeeFormGroup.controls['HireDate'].setValue(null);
      }


      if (this.employeeFormGroup.controls['MiddleI'].value==null) {
        this.employeeFormGroup.controls['MiddleI'].setValue('');
      }


// New FormData to Upload file. File input cannot be uploaded without Js formData https://www.youtube.com/watch?v=8TRNKTwe1Fk
//******************************************************************************* */

const fd:any=new FormData();
fd.append("EmpID", this.employeeFormGroup.controls['EmpID'].value);
fd.append("EmployeeID", this.employeeFormGroup.controls['EmployeeID'].value);
fd.append("Firstname", this.employeeFormGroup.controls['Firstname'].value);
fd.append("Lastname", this.employeeFormGroup.controls['Lastname'].value);
fd.append("MiddleI", this.employeeFormGroup.controls['MiddleI'].value);
fd.append("FullName", this.employeeFormGroup.controls['FullName'].value);
fd.append("JobTitle", this.employeeFormGroup.controls['JobTitle'].value);
fd.append("Department", this.employeeFormGroup.controls['Department'].value);
fd.append("Prefix", this.employeeFormGroup.controls['Prefix'].value);
fd.append("Suffix", this.employeeFormGroup.controls['Suffix'].value);
fd.append("Registration", this.employeeFormGroup.controls['Registration'].value);
fd.append("HireDate", this.employeeFormGroup.controls['HireDate'].value);
fd.append("EmployeeStatus", this.employeeFormGroup.controls['EmployeeStatus'].value);
fd.append("ComID", this.employeeFormGroup.controls['ComID'].value);
fd.append("DisciplineSF330", this.employeeFormGroup.controls['DisciplineSF330'].value);
fd.append("DisciplineSF254", this.employeeFormGroup.controls['DisciplineSF254'].value);
fd.append("ExpWithOtherFirm", this.employeeFormGroup.controls['ExpWithOtherFirm'].value);
fd.append("Employee_Consultant", this.employeeFormGroup.controls['Employee_Consultant'].value);
fd.append("ImageDataWeb", this.employeeFormGroup.controls['ImageDataWeb'].value);
// fd.append("Image", this.Image);


if (this.Image !== "null") {
  fd.append('Image',this.Image);
}

    
    // this.empservice.addEmployee(this.employeeFormGroup.value).subscribe(resp => {
      this.empservice.addEmployee(fd).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnEditCloseModal").click();
      this.refreshEmployeeDatatable();
      this.loading2 = false;
    },
      err => {
        this.loading2 = false;

        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors = err.error.errors;
        }
        else {
          alert(err.message);
        }
      });
    // if (!this.errors) {
    //   //route to new page
    // }

  }



  deleteEmp(e: any) {
    if (confirm("Are you sure to delete " + name)) {

      this.empservice.deleteEmployee(e).subscribe(resp => {
        // $("#empeditmodal").modal("hide");
        this.refreshEmployeeDatatable();
      },
        err => {
          // For Validation errors
          if (err.status === 422 || err.status === 400) {
            // alert(err.error.errors[0].msg);
            this.formErrors = err.error.errors;
          }
          else {
            alert(err.message);
          }
        });

      // if (!this.errors) {
      //   //route to new page
      // }
    }else{
      alert("Delete Cancelled");
    }

  }

  


}
