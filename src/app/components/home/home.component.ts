import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket.service'
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [SocketService]
})
export class HomeComponent implements OnInit, OnDestroy {
  

  constructor(private socketService: SocketService, private _router: Router) { }

  tiles = [
    {text: 'Enter Timesheet', cols: 3, rows: 1, color: 'lightblue', route: '/tmsEntry'},
    {text: 'View Employees Timesheet', cols: 1, rows: 1, color: 'lightpink', route: '/tmsApproval'},
    {text: 'Enter Projects', cols: 2, rows: 1, color: '#DDBDF1',  route: '/projects'},
  ];

  ngOnInit() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (userInfo && userInfo.userId) {
         console.log("valid user");
    } else {
      this._router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
  }
  
  ontileClick (route){
   // this._router.navigate(['/tmsEntry']);
   this._router.navigate([route]);
  }
}