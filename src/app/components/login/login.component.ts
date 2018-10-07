import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket.service'
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import * as $ from 'jquery';
declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [SocketService]
})
export class LoginComponent implements OnInit, OnDestroy {
  hide = true;
  public userControl = new FormControl('', [
    Validators.required
  ]);
  public passwordControl = new FormControl('', [
    Validators.required
  ]);
  private connection;
  private message = {};
  private processing: Boolean = false;

  constructor(private socketService: SocketService, private _router: Router) { }

  sendMessage(message) {
    this.socketService.sendMessage(message);
  }

  validateLogin() {
     if (this.userControl.value && this.passwordControl.value) {
      this.processing = true;
      let msg = {
        type: "loginInfo",
        username: this.userControl.value,
        password: this.passwordControl.value
      };  
      this.sendMessage(msg);
     }
  }
  ngAfterViewInit() {
    $("body").addClass("login");
    $("header").addClass("hide");
    $("footer").addClass("hide");
 }

  ngOnInit() {
    this.connection = this.socketService.getMessages().subscribe(data => {
      console.log(data);
      if (data) {
        let actualMessage;
        actualMessage = data;
        let modData = JSON.parse(actualMessage);
          if (modData && modData.length > 0 && modData[0].type === "loginInfo") {
              console.log("login successful");
              this.onLoginSuccess(modData[0]);
          } else if (modData && modData.length > 0 && modData[0].type !== "loginInfo") {
              console.log("message not understood");
          } else if (modData.type === "loginInfoFailed") {
              this.onLoginFail();
          }
      }  
     
    })
  }

  onCreateTable() {
    let msg = {
      type: "createTable",
      tableName: sessionStorage.getItem("tableName")
    };  
    this.sendMessage(msg);
  }

  onLoginSuccess (data) {
      var userInfo;
      this.processing = false;
      this.onHideErrMsg();
      sessionStorage.setItem("userInfo", JSON.stringify(data));
      userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      sessionStorage.setItem("tableName", userInfo.username + userInfo.userId);
      this.onCreateTable();
      this._router.navigate(['/about']);
  }

  onLoginFail () {
    this.processing = false;
    $('.errorMsg').removeClass("hide");
  }

  onHideErrMsg() {
    $('.errorMsg').addClass("hide");
  }

  ngOnDestroy() {
    this.processing = false;
    $("body").removeClass("login");
    $("header").removeClass("hide");
    $("footer").removeClass("hide");
    this.connection.unsubscribe();
  }

  onRegister () {
    this._router.navigate(['/register']);
  }
}