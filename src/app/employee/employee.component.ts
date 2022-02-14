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

  // private directReportsList() {
  //   if (this.employee.directReports) {
  //     this.employee.directReports.forEach(element => {
  //       this.employeeService.get(element).subscribe(restItem => {
  //         console.log(typeof (restItem));
  //         this.reports.push(restItem)
  //       })
  //     })
  //   } else {
  //     return []
  //   }
  // }


  // private directReportsList() {
  //   if (this.employee.directReports) {
  //     for (let element of this.employee.directReports) {
  //       this.employeeService.get(element).subscribe(restItem => {
  //         this.reports.push(restItem)
  //       })
  //     }
  //     this.dataSource = this.reports
  //     console.log(this.dataSource)
  //   } else {
  //     return []
  //   }
  // }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
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


  ngOnInit(): void {
    if (this.employee.directReports) {
      for (let element of this.employee.directReports) {
        this.employeeService.get(element).subscribe(restItem => {
          this.reports.push(restItem)
        })
      }
      this.dataSource = this.dataSource.sort()
    } else {
      return
    }
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employee data';
  }
}
