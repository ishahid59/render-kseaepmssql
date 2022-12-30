import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../services/common.service';


@Injectable({
  providedIn: 'root'
})


export class EmployeeService {
  // http://localhost:5000  http://localhost:5000
  constructor(private http: HttpClient, private commonService: CommonService) {
  }


  getEmployee(item: any) {
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/employee/' + item.EmpID + ''

    return this.http.get<any>(url,
      {
        // now headers filled by auth.interceptor
        // headers: {
        //   Authorization: "Bearer " + localStorage.getItem("token"),
        //   Accept: "application/json" //the token is a variable which holds the token
        // }
      },
    )
  }
  getEmpdetail(empid: any) {
    // var url='http://localhost:5000/api/employee/empdetails/' + empid + ''
    var url = '' + this.commonService.baseUrl + '/api/employee/empdetails/' + empid + ''
    return this.http.get<any>(url,
      {
        // now headers filled by auth.interceptor
        // headers: {
        //   Authorization: "Bearer " + localStorage.getItem("token"),
        //   Accept: "application/json" //the token is a variable which holds the token
        // }
      },
    )
  }

  updateEmployee(data: any) {
    // var url='http://localhost:5000/api/employee/update'
    var url = '' + this.commonService.baseUrl + '/api/employee/update'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  addEmployee(data: any) {
    // var url='http://localhost:5000/api/employee/'
    var url = '' + this.commonService.baseUrl + '/api/employee/add/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  deleteEmployee(item: any) {
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/employee/' + item.EmpID + ''
    return this.http.delete<any>(url,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }

  getCmbEmpJobtitle() {
    // var url='http://localhost:5000/api/empjobtitle/'
    var url = '' + this.commonService.baseUrl + '/api/empjobtitle/'
    return this.http.get<any>(url,
      {
        // now headers filled by auth.interceptor
        // headers: {
        //   Authorization: "Bearer " + localStorage.getItem("token"),
        //   Accept: "application/json" //the token is a variable which holds the token
        // }
      },
    )
  }


  getCmbEmpRegistration() {
    // var url = 'http://localhost:5000/api/empregistration/'
    var url = '' + this.commonService.baseUrl + '/api/empregistration/'
    return this.http.get<any>(url)
  }

  // getCmbEmp() {
  //   // var url = 'http://localhost:5000/api/employee/all/'
  //   var url = '' + this.commonService.baseUrl + '/api/employee/all/'
  //   return this.http.get<any>(url)
  // }
  getCmbEmp() {
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/employeeid/'
    return this.http.get<any>(url)
  }

  getCmbEmpListAll() {
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/emp/'
    return this.http.get<any>(url)
  }
  

  // getCmbEmpListAll() {
  //   // var url = 'http://localhost:5000/api/employee/all/'
  //   var url = '' + this.commonService.baseUrl + '/api/empcombo/employeeid/'
  //   return this.http.get<any>(url)
  // }


  // should move to project service later. For testing here
  fillimagegallerylist(item:any){
    var url = '' + this.commonService.baseUrl + '/api/prophoto/apiprophotogetimagedata/242'; // + item.ProjectID + ''
    return this.http.get<any>(url);
  }



}
