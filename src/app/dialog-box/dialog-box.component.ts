//dialog-box.component.ts
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";


export interface EmployeeData {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  compensation: string
}


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})

export class DialogBoxComponent {

  action:string;
  local_data:any;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: EmployeeData) {
    console.log(data);
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }


}
