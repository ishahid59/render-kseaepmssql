import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { EmployeeService } from '../services/employee.service';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element



@Component({
  selector: 'app-emp-degree',
  templateUrl: './emp-degree.component.html',
  styleUrls: ['./emp-degree.component.css']
})
export class EmpDegreeComponent {

  constructor(private http: HttpClient, private empservice: EmployeeService, public datePipe: DatePipe, private router: Router,public activatedRoute: ActivatedRoute,private commonService: CommonService) {
  }

  @Input() childempid:any;

  // dtOptions: DataTables.Settings = {};
   dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

   // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  empDegreeData: any = []; // in angular should ([]) for array
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;

  ngOnInit() {
    // this.loadDatatableEmpDegree();

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      this.loadDatatableEmpDegree(); //loadDatatableEmpDegree() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
      this.componentLoaded = false;
    }


    // // following observer code moved from ngOnInit() to ngAfterViewInit() since datatable instance is not created yet to be refreshed
      // this.activatedRoute.paramMap.subscribe((param) => {
      //   this.childempid = param.get('id')
      //   this.refreshDatatableEmpDegree();// refresh instance of angular-datatable
      // })



  }

  

  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if (that.empDegreeData.length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });

    
    // // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // // following observer code moved from ngOnInit() to here ngAfterViewInit()
    this.activatedRoute.paramMap.subscribe((param) => {
      this.childempid = param.get('id')
      this.refreshDatatableEmpDegree();// refresh instance of angular-datatable
    })

  }


  // RELOAD/REFRESH Angular-Datatable. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshDatatableEmpDegree() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }




  loadDatatableEmpDegree() {

    var that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      serverSide: true,// server side processing
      searching: false,
      lengthChange: false,
      lengthMenu: [ 10, 25, 50, 75, 100 ],
      // dom: 'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // // //"any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      // buttons: [
      //     'lengthChange','copy', 'csv', 'excel', 'pdf', 'print'
      // ],

      ajax: (dataTablesParameters: any, callback:any) => {
        // this.http.post<any>(
          this.http.post<any>(
          // 'http://localhost:5000/api/empdegree/empdegree-angular-datatable/' + 145 + '',
          // 'http://localhost:5000/api/empdegree/empdegree-angular-datatable',
          // '' + that.commonService.baseUrl + '/api/empdegree/empdegree-angular-datatable',
          '' + that.commonService.baseUrl + '/api/empdegree/'+this.childempid,

          Object.assign(dataTablesParameters,
            {
              //  token: '',
              empid: this.childempid,//this.id, 
            }),
          // {
          //  // ** Header is now coming from Auth.Inceptor file
          //   headers: {
          //   Authorization: "Bearer " + localStorage.getItem("token"),
          //   Accept: "application/json" //the token is a variable which holds the token
          //   }
          // },
        ).subscribe(resp => {
          this.empDegreeData = resp.data; //use .data after resp for post method
          // that.empDegreeData = resp; // for MSSQL;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
             data: []
            // //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            //  data:  resp.data  // set data
          });
        });
      },
      columnDefs: [{
        "orderable": false,
        // "targets": '_all'
        "targets": 7,
      }],
      columns: [
        // { data: '', title: "id" }, 
        // { data: 'EmpID', title: "EmpID", width: "200px" },
        { data: 'disDegree', title: "Degree", width: "100px" },
        { data: 'DegreeField', title: "Degree Field", width: "300px" },
        { data: 'Institution', title: "Institution", width: "500px" },
        { data: 'YearDegreeEarned', title: "Year", width: "80px" },
        { data: 'disState', title: "State", width: "80px" },
        { data: 'disCountry', title: "Country", width: "150px" },
        { data: 'Notes', title: "Notes", width: "300px" },
        { data: '', title: "Action", width: "200px" },
      ]
    };
  }







}
