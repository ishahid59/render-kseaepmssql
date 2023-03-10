// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { EmployeeService } from '../services/employee.service';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-pro-photo',
  templateUrl: './pro-photo.component.html',
  styleUrls: ['./pro-photo.component.css']
})
export class ProPhotoComponent {

  constructor(private http: HttpClient, private empservice: EmployeeService, public datePipe: DatePipe, private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService, private _lightbox: Lightbox) {
  }







  @Input() childempid: any;

  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  proPhotoData: any = []; // in angular should ([]) for array
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;

  dynamicimagepath: any = "";
  imageGalleryList: any = [];
  imageGalleryListWithPath: any = [];

  _albums: any = [];
  clickedIndexOfDt: any = 0;



  // *****************************************************************************************************
  // IMAGE RELATED using ngx-lightbox for gallery: https://www.npmjs.com/package/ngx-lightbox
  // ***************************************************************************************************** 

  openLightbox(index: number): void {

    // open lightbox
      if (this.proPhotoData.length>0) {
        this._lightbox.open(this._albums, index);
      }
    
  }


  closeLightbox(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }


  // fill fillimagegallerylist to use for photogallery
  fillimagegallerylist(item: any) {
    this.empservice.fillimagegallerylist(item).subscribe(resp => {
      this.imageGalleryList = resp;
      // fill imageGalleryListWithPath from imageGalleryList to use in photo gallery
      var a = [];
      for (var i = 0; i < this.imageGalleryList.length; i++) {
        a.push(this.commonService.baseUrl + '/img/prophoto/' + this.imageGalleryList[i].ImageData);
      }
      this.imageGalleryListWithPath = a;
    },
      err => {
        if (err.status === 422 || err.status === 400) { // For Validation errors
          this.formErrors = err.error.errors;
        }
        else {
          alert(err.message);
        }
      });
  }



  //for gallery https://www.youtube.com/watch?v=WVkbpfux13E&list=PL5RuyRApxAq4yFHaf8nz2rLBSN3_Ihott&index=54&t=34s
  loadImageOnClick(item: any, index: any) {
    // this.dynamicimagepath = this.$host + "img/prophoto/" + this.formdata.ImageData
    this.dynamicimagepath = '' + this.commonService.baseUrl + '/img/prophoto/' + item;
    // this.open(index-1);
    this.clickedIndexOfDt = index;//-1; // save the clicked index to use by right photo to open current image in gallery
  }

  // *****************************************************************************************************
  // END IMAGE RELATED 
  // ***************************************************************************************************** 




  ngOnInit() {

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      this.loadDatatableProPhoto(); //loadDatatableProPhoto() has to be called for first time only. Then refreshDatatableProPhoto() is called everytime
      this.componentLoaded = false;
    }
    // // following observer code moved from ngOnInit() to ngAfterViewInit() since datatable instance is not created yet to be refreshed
    // this.activatedRoute.paramMap.subscribe((param) => {
    //   this.childempid = param.get('id')
    //   this.refreshDatatableProPhoto();// refresh instance of angular-datatable
    // })
    this.fillimagegallerylist(242)
  }




  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if (that.proPhotoData.length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });


    // **FIRST PHOTO LOAD Code is moved in datatable code to work


    // // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // // following observer code moved from ngOnInit() to here ngAfterViewInit()
    this.activatedRoute.paramMap.subscribe((param) => {
      this.childempid = param.get('id')
      this.refreshDatatableProPhoto();// refresh instance of angular-datatable
    })
  }




  // Refresh/reload Angular-Datatable. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshDatatableProPhoto() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }



  loadDatatableProPhoto() {
    var that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      serverSide: true,// server side processing
      searching: false,
      lengthChange: false,
      lengthMenu: [10, 25, 50, 75, 100],
      ajax: (dataTablesParameters: any, callback: any) => {
        this.http.post<any>(
          // '' + that.commonService.baseUrl + '/api/empdegree/empdegree-angular-datatable',
          // '' + that.commonService.baseUrl + '/api/empdegree/'+this.childempid,
          '' + that.commonService.baseUrl + '/api/prophoto/242',//242',241',//+this.childempid,

          Object.assign(dataTablesParameters,
            {
              //  token: '',
              empid: this.childempid,//this.id, 
            }),
          // {
          //   ** Header is now coming from Auth.Inceptor file
          //   headers: {
          //   Authorization: "Bearer " + localStorage.getItem("token"),
          //   Accept: "application/json" //the token is a variable which holds the token
          //   }
          // },
        ).subscribe(resp => {
          this.proPhotoData = resp.data; //use .data after resp for post method
          // that.proPhotoData = resp; // for MSSQL;



          // ******************************************************************************************
          // PHOTO RELATED
          // ******************************************************************************************

          //  load the initial Photo before click in datatable to work. moved here from ngoninit to work
          if (this.proPhotoData.length > 0) {
            // this.dynamicimagepath = '' + this.commonService.baseUrl + '/img/prophoto/1990-0238/Photo1_1569500048.jpg'
            this.dynamicimagepath = '' + this.commonService.baseUrl + '/img/prophoto/' + this.proPhotoData[0].ImageData;
          }
          // console.log(this.proPhotoData);
          // console.log(this.proPhotoData.length);
          // Create  the Album for Lightbox gallery
          // for (let i = 1; i <= this.proPhotoData.length-1; i++) {

          this._albums=[];
          for (let i = 0; i <= this.proPhotoData.length - 1; i++) {
            const src = this.commonService.baseUrl + '/img/prophoto/' + this.proPhotoData[i].ImageData;
            // const caption = 'Image ' + i + ' caption here';
            const caption = this.proPhotoData[i].PhotoName + ',   Description: ' + this.proPhotoData[i].Description;
            const thumb = this.commonService.baseUrl + '/img/prophoto/' + this.proPhotoData[i].ImageData;
            const album = {
              src: src,
              caption: caption,
              thumb: thumb
            };
            this._albums.push(album);
          }
          
          console.log(this._albums);

          // ******************************************************************************************
          // End
          // ******************************************************************************************



          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
            // //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            //  data:  resp.data  // set data
          });
        });
      },


      // columnDefs: [{
      //   "orderable": false,
      //   "targets": '_all'
      // }],
      columns: [
        { data: 'ProjectID', title: "ProjectID", "visible": false },
        { data: 'ID', title: "ID", "visible": false },
        { data: 'PhotoName', title: "PhotoName", width: "50px" },
        { data: 'ImageData', title: "ImageData", "visible": false },
        { data: 'CreatedBy', title: "CreatedBy", "visible": false },
        { data: 'LastModifiedBy', title: "LastModifiedBy", "visible": false },
        { data: 'Description', title: "Description", width: "600px" },
        { data: '', title: "Action", width: "350px" },
      ]

    };

  }


}
