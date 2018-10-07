import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket.service'
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'home',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [SocketService]
})
export class AboutComponent implements OnInit, OnDestroy {
  

  constructor(private socketService: SocketService, private _router: Router) { }


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
}