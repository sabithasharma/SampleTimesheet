import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { SocketService } from '../../services/socket.service'
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute  } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
//import * as $ from 'jquery';
declare var $: any;
@Component({
    selector: 'tms_approval',
    templateUrl: './tmsApproval.component.html',
    styleUrls: ['./tmsApproval.component.css'],
    providers: [SocketService]
})
export class TMSApprovalComponent implements OnInit, OnDestroy, AfterViewInit {
    constructor(private route: ActivatedRoute, private socketService: SocketService, private _router: Router) { }
    connection;
    userTimesheetData;
    ELEMENT_DATA: Element[] = this.userTimesheetData || [];
    displayedColumns = ['userId', 'dates', 'dateValue', 'project'];
    dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    returnUrl: string;

    showTimesheet:boolean = false;
    EmployeeList = [];

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }


    ngOnInit() {
        var self = this;
        /*if (!sessionStorage.getItem("userInfo")) {
            let arr = window.location.href.split('tmsApproval/');
            let tableName = arr[1]
            this._router.navigate(['/login' + '/' + 'tableName']);
        }*/
        this.connection = this.socketService.getMessages().subscribe(data => {
            console.log(data);
            if (data) {
                let actualMessage;
                actualMessage = data;
                let modData = JSON.parse(actualMessage);
                if (modData && modData.length > 0 && modData[0].type === "fetchTimesheet") {
                    delete modData[0]["type"];
                    console.log("fetch timesheet successful");
                    this.userTimesheetData = modData;
                    this.ELEMENT_DATA = this.userTimesheetData;
                    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
                    this.fillTable(modData);
                } else if (modData && modData.length > 0 && modData[0].type === "fetchEmployeeListSuccess") {
                    delete modData[0]["type"];
                    console.log("fetch Employee List successful");
                    this.displayEmployeeList(modData);
                } else {
                    console.log("msg not unserstood in timesheet component");
                }
            }
        });
    }

    displayTimesheet(data) {
        var tableName = data.username + data.userId;
        this.showTimesheet = true;
        console.log(data);
        this.fetchTimesheet(tableName, data.userId);
    }

    fillTable(data) {

    }

    ngAfterViewInit() {
        this.fetchEmployeeList();
    }

    displayEmployeeList(data) {
         this.EmployeeList = data;
    }
    

    fetchEmployeeList() {
        let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        let msg = {
            type: "fetchEmployeeList",
            managerEmail : "sabithadummy@gmail.com"
        };
        this.sendMessage(msg);
    }

    fetchTimesheet(tableName, userId) {    
        let msg = {
            type: "fetchTimesheet",
            userId: userId,
            tableName: tableName,
        };
        this.sendMessage(msg);
    }

    sendMessage(message) {
        this.socketService.sendMessage(message);
    }

    ngOnDestroy() {

    }
}

export interface Element {
    userId: number;
    dates: string;
    dateValue: number;
    project: string;
}

     /* const ELEMENT_DATA: Element[] = [
        {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
        {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
        {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
        {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
        {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
        {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
        {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
        {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
        {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
        {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
        {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
        {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
        {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
        {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
        {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
        {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
        {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
        {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
        {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
        {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
      ];*/