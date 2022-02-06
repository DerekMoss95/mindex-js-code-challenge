import { Component, Input, OnInit } from '@angular/core';
import { catchError, map, reduce } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table'
import { Employee } from '../employee';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { EmployeeService } from '../employee.service';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  compensation: number;
  @Input() employee: Employee;
  reports = [];
  table: any;
  headers = ["firstName", "lastName", "position"]
  errorMessage: string;



  constructor(private employeeService: EmployeeService) {
  }

  private totalReports(ids) {
    if (ids !== undefined) {
      let numReports = ids.length
      return numReports
    } else {
      return 0
    }
  }

  private directReportsList() {
    if (this.employee.directReports) {
      this.employee.directReports.forEach(element => {
        this.employeeService.get(element).subscribe(restItems => {
          this.reports.push(restItems)
        })
      })
    } else {
      return
    }
  }


  ngOnInit(): void {
    this.directReportsList()
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employee data';
  }
}
