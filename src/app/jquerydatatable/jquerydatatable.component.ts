import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { EmployeeService } from '../services/employee.service';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jquerydatatable',
  templateUrl: './jquerydatatable.component.html',
  styleUrls: ['./jquerydatatable.component.css']
})
export class JquerydatatableComponent {

  constructor(private http: HttpClient, private empservice: EmployeeService,public authService: AuthService,private commonService: CommonService, private router: Router) {
  }



  // table data
  myData: any = ([]); // in angular should ([]) for array
  loading2: boolean = false;


  // editData from database 
  editData: any = {
    EmpID: 0,
    Firstname: "",
    Lastname: "",
    JobTitle: 0,
    Registration: 0
  };

  // Search params
  searchFirstname: string = "";
  searchLastname: string = "";
  searchJobtitle: number = 0;
  searchRegistration: number = 0;


  cmbJobtitle: any = [];
  cmbRegistration: any = ([]);


  // https://www.youtube.com/watch?v=Wr5urqswiko&list=PLQcBFrxTul9IQFF7fJz7jgdRYJz1OCbll&index=6
  employeeFormGroup = new FormGroup({
    EmpID: new FormControl(0),
    Firstname: new FormControl('',[Validators.required]),
    Lastname: new FormControl('',[Validators.required]),
    JobTitle: new FormControl(0),
    Registration: new FormControl(0),
  });



  ngOnInit() {
    this.fillAllCmb();// now using forkJoin of rxjx to call all cmbfill in one function
  }


  // Fill all combos in one function using forkJoin of rxjx
  fillAllCmb() {
    this.loading2 = true;
    this.empservice.getCmbEmpListAll().subscribe(resp => {
      this.cmbJobtitle = resp[0].jobtitle;
      this.cmbRegistration = resp[4].registration;
      this.loading2 = false;
    },
      err => {
        alert(err.message);
      });
    // if (!this.errors) {
    //   //route to new page
    // }
  }



  // Jquery can be written directly angular method without writing in ngAfterContentInit() without $(document).ready(function ()
  testJquery() {
    $("#myh1").toggle(350);
  }


  // Load Jquery datatabletable after this hook
  public ngAfterContentInit() {
    this.loadJqueryDatatable()
  }


  viewemp(e: any) {
    // alert("view emp with id: " + e.empid);
    this.router.navigate(['/Empdetail/' + e]);
    // this.router.navigate(['/Empdetail/1']);// + data.EmpID]);
    // console.log(e);
  }

  showempeditmodal(e: any) {
    // // alert("edit emp with id: "+ e.empid);
    // this.http.get<any>(
    //   'http://localhost:5000/api/employee/' + e.empid + '',
    //   {
    //     headers: {
    //       Authorization: "Bearer " + localStorage.getItem("token"),
    //       Accept: "application/json" //the token is a variable which holds the token
    //     }
    //   },
    // )
    this.empservice.getEmployee(e).subscribe(resp => {
      console.log(resp);
      this.editData = resp; //use .data after resp for post method
    },
      error => {
        console.log(error.message);
        // this.errors = error
      });
    // if (!this.errors) {
    //   //route to new page
    // }
  }



  updateEmp() {
    this.empservice.updateEmployee(this.employeeFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnEditCloseModal").click();
      var table = $('#jquerydatatable').DataTable();
      table.ajax.reload();
    },
      error => {
        console.log(error.message);
        // this.errors = error
      });

    // if (!this.errors) {
    //   //route to new page
    // }
  }




  openAddModal(){
 
     this.editData.EmpID= 0;
     this.editData.Firstname= '';
     this.editData.Lastname= '';
     this.editData.JobTitle= 0;
     this.editData.Registration= 0;
  
     // clear form group since same group is used for edit and add
     this.employeeFormGroup.reset();
  } 
  





  addEmp(){
    this.empservice.addEmployee(this.employeeFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnAddCloseModal").click();
      var table = $('#jquerydatatable').DataTable();
      table.ajax.reload();
    },
      error => {
        console.log(error.message);
        // this.errors = error
      });

    // if (!this.errors) {
    //   //route to new page
    // }
}


  deleteEmp(e: any) {
    this.empservice.deleteEmployee(e).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      var table = $('#jquerydatatable').DataTable();
      table.ajax.reload();
    },
      error => {
        console.log(error.message);
        // this.errors = error
      });

    // if (!this.errors) {
    //   //route to new page
    // }
  }




  // Search jquery Datatable 
  searchJqueryTable() {
    var table = $('#jquerydatatable').DataTable();
    // table.destroy();
    table.ajax.reload();
    // this.loadtable();
  }


  // Clear Search params
  clearSearch() {
    this.searchFirstname = "";
    this.searchLastname = "";
    this.searchJobtitle = 0;
    this.searchRegistration = 0;
    $('#jquerydatatable').DataTable().search('').draw();//clear dt text search input
    this.searchJqueryTable();
  }


  // load jquery Datatable
  loadJqueryDatatable() {

    var that = this; // to pass params in datatable

    // $(document).ready(function () {
    $('#jquerydatatable').DataTable({
      processing: true,
      serverSide: true,
      // searching:false,
      dom: 'B1frtip',
      pageLength: 10,
      // dom: 'Bfrtip',
      ajax: {

        // url: 'http://localhost:5000/api/employee/search/angular-Jquery-datatable',
        // url: '' + that.commonService.baseUrl + '/api/employee/search/angular-Jquery-datatable',
        url: '' + that.commonService.baseUrl + '/api/employee/angular-jquery-datatable',
        
        dataType: "JSON",
        type: "post",
        // **Note must use this function format to send params in order to use "table.ajax.reload();" for search without calling table.destroy(); first
        // data: {
        // "firstname":  $('#myinput3').val(),
        // "firstname":this.searchFirstname,
        // "lastname": "",
        // "jobtitle": 0,
        // "registration": 0,        
        data: function (d: any) {
          d.Firstname = that.searchFirstname;//$("#myinput3").val();
          d.Lastname = that.searchLastname;
          d.JobTitle = that.searchJobtitle;
          d.Registration = that.searchRegistration;
          // this.loading = false;
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          Accept: "application/json" //the token is a variable which holds the token
        }
      },

      columns: [
        // { data: "EmpID" },
        // { data: "Firstname" },
        // { data: "Lastname" },
        // { data: "EmployeeID" },
        {
          render: (data: any, type: any, row: any) => {
            // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
            return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.EmployeeID + "</a> ";
          }, title: 'EmployeeID'
        },
        { data: "JobTitle" },
        { data: "Registration" },
        { data: "HireDate" },
        {
          data: "EmpID",
          title: "Edit",
          // render: function(data, type, row) {
          //   return (
          //     "<a style='cursor:pointer' onclick=$('#hiddenid').val(" +
          //     row.empid +
          //     ") ; id='empedit'>Edit</a> |   <a style='cursor:pointer' onclick=$('#hiddenid').val(" +
          //     row.empid +
          //     ") id='empdelete'>Delete</a>"
          //   );
          // }


          // https://datatables.net/forums/discussion/63497/how-to-call-a-function-on-column-render
          // https://stackoverflow.com/questions/18758997/call-angular-function-with-jquery
          // external custom.js file is used for onclick='getEditData("+data+")'
          render: (data, type, row) => {
            return "<a  id='dtview'  style='cursor: pointer'>View</a> | <a  id='dtedit' data-toggle='modal' data-target='#empeditmodal'  style='cursor: pointer'>Edit</a> | <a  id='dtdelete'  style='cursor: pointer'>Delete</a>";
            // return  "<a id='test3' onclick='DoAction()' style='cursor: pointer'>Edit</a>";
          }
        }
      ],

      // ***using rowCallback in jquery datatable to use Angular function. Click events are written here instead of render 
      // No other solution is found except external js file in which angular variables & functions cannot be called
      // https://stackoverflow.com/questions/38022763/angular-datatable-click-row-event
      // https://stackoverflow.com/questions/56797751/trying-to-add-row-click-event-in-angular-datatables-but-its-not-working

      rowCallback: (row: Node, data: any[] | Object, index: number) => {

        // Firstname col
        jQuery('a:eq(0)', row).unbind('click');
        jQuery('a:eq(0)', row).bind('click', () => { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
          self.rowFirstNameClickHandler(data);
        });
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        $('#dtview', row).unbind('click');
        $('#dtview', row).bind('click', () => {
          self.viewemp(data);
        }),
          $('#dtedit', row).unbind('click');
        $('#dtedit', row).bind('click', () => {
          self.showempeditmodal(data);
        }),
          $('#dtdelete', row).unbind('click');
        $('#dtdelete', row).bind('click', () => {
          self.deleteEmp(data);
        });

        return row;
      },
    });
    // });
  }




// Action column handlers connecting to angular methods directly from within jquatu table
rowFirstNameClickHandler(data:any) {
  this.router.navigate(['/Empdetail/' + data.EmpID]);
  // this.router.navigate(['/Empdetail/1']);// + data.EmpID]);

}





}
