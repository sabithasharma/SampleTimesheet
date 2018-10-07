import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { SocketService } from '../../services/socket.service'
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import * as $ from 'jquery';
declare var $: any;
@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers: [SocketService]
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
    constructor(private socketService: SocketService, private _router: Router) { }
    
    connection;
    userInfo = JSON.parse(sessionStorage.userInfo);
    
    ngOnInit (){
        let self = this;
        this.connection = this.socketService.getMessages().subscribe(data => {
            console.log(data);
            if (data) {
                
            }
        })
    }

    ngOnDestroy () {

    }

    ngAfterViewInit () {

    }
}