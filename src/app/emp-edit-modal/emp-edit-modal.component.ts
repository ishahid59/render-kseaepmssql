import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-emp-edit-modal',
  templateUrl: './emp-edit-modal.component.html',
  styleUrls: ['./emp-edit-modal.component.css']
})
export class EmpEditModalComponent {

 @Input() empid:any=null;

  // https://stackoverflow.com/questions/43323272/angular-4-call-parent-method-in-a-child-component
  //to use seperate child component for modal and call it from parent
  @Output() refreshEmployeeDatatable = new EventEmitter<string>();
  @Output() refreshEmpDetail = new EventEmitter<string>();

  saveEmp(): void { // save btn click will call parents refreshEmployeeDatatable() method after save
    this.refreshEmployeeDatatable.next('somePhone'); 
     this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
    $("#btnEmpEditModalClose").click();  //close bootstrap modal
  }

  showChildModal() {
    $('#btnEmpEditModalShow').click(); 
  }



}
