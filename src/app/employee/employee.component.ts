import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  compensation: number;
  @Input() employee: Employee;
  reports = [];
  dataSource = this.reports;
  displayedColumns: string[] = ["id", "firstName", "lastName", "position", "action"]
  errorMessage: string;

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  constructor(private employeeService: EmployeeService, public dialog: MatDialog) {
  }

  private totalReports(ids) {
    if (ids !== undefined) {
      let numReports = ids.length
      return numReports
    } else {
      return 0
    }
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '275px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

  //Need to figure out why running this functions loads all the rows in the mat-table
  updateRowData(row_obj){
    this.dataSource = this.dataSource.filter((value,key)=>{
      if(value.id == row_obj.id){
        value.firstName = row_obj.firstName;
        value.lastName = row_obj.lastName;
        value.position = row_obj.position;
        value.compensation = row_obj.compensation;
      }
      return true;
    });
  }

  deleteRowData(row_obj){
    this.dataSource = this.dataSource.filter((value,key)=>{
      return value.id != row_obj.id;
    });
  }

 // Need to figure out why this only renders the first row on page load
  ngOnInit(): void {
    if (this.employee.directReports) {
      for (let element of this.employee.directReports) {
        this.employeeService.get(element).subscribe(restItem => {
          this.reports.push(restItem)
        })
      }
    } else {
      return
    }
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employee data';
  }
}
