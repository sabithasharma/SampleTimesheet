import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { SocketService } from '../../services/socket.service'
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { MenuItem } from 'primeng/api';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
//import * as $ from 'jquery';
declare var $: any;
const URL = 'http://localhost:3000/fileupload';
@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    providers: [SocketService]
})
export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {
    constructor(private socketService: SocketService, private _router: Router, private http: Http, private el: ElementRef) { }

    private connection;
    private myfile;
    hide = true;
    userId = "sabitha";

    public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: this.userId });

    public userControl = new FormControl('', [Validators.required]);
    public passwordControl = new FormControl('', [Validators.required]);
    public firstnameControl = new FormControl('', [Validators.required]);
    public lastnameControl = new FormControl('', [Validators.required]);
    public birthdayControl = new FormControl('', [Validators.required]);
    public phoneControl = new FormControl('', [Validators.required]);
    public emergencyControl = new FormControl('', [Validators.required]);
    public addressControl = new FormControl('', [Validators.required]);




    ngOnInit() {
        let self = this;
        var registrationForm = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            birthday: '',
            phoneNumber: '',
            address: '',
            emergencyContact: ''
        }

        this.connection = this.socketService.getMessages().subscribe(data => {
            console.log(data);
            if (data) {
                let actualMessage;
                actualMessage = data;
                let modData = JSON.parse(actualMessage);
                if (modData && modData.length > 0 && modData[0].type === "saveProjectSuccess") {

                } else if (modData && modData.length > 0 && modData[0].type === "fetchProjectSuccess") {

                }
            }
        });
        this.uploader.onAfterAddingFile = (file) => {
        file.withCredentials = false;
            console.log(file);
        };
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            alert("image uploaded");
            console.log("ImageUpload:uploaded:", item, status, response);
        };
    }

    ngAfterViewInit() {
        $("header").addClass("hide");
        $("footer").addClass("hide");
    }

    ngOnDestroy() {
        $("header").removeClass("hide");
        $("footer").removeClass("hide");
        this.connection.unsubscribe();
    }

    myUploader(event) {
        console.log(event);
        this.myfile = event.files[0];
        console.log(this.myfile);
        let msg = {
            type: "imageUpload",
            file: this.myfile,
            fileName: this.myfile.name,
            fileSize: this.myfile.size,
            fileType: this.myfile.type,
            filePath: this.myfile.objectURL.changingThisBreaksApplicationSecurity
        };
        // this.sendMessage(msg);
    }
    sendMessage(message) {
        this.socketService.sendMessage(message);
    }

    onUpload() {
        let items = this.uploader.getNotUploadedItems();
        let lastItem = items[items.length - 1];
        let imageName = "111" + "." + lastItem.file.name.split('.')[1];
        //lastItem.file.rawFile.name = imageName;
        lastItem.file['imageName'] = imageName;
        //  lastItem.file['imageName'] = imageName;
        // lastItem.file.name = imageName;
        this.uploader.uploadItem(lastItem);
        // this.uploader.uploadAll();
    }

    onHideErrMsg () {
        $(".register-form .errorMsg").addClass("hide");
    }

    validateRegistration() {
        if (!this.userControl.value || !this.passwordControl.value || !this.firstnameControl.value
            || !this.lastnameControl.value || !this.birthdayControl.value || !this.phoneControl.value
            || !this.emergencyControl.value || !this.addressControl.value) {
            $(".register-form .errorMsg").removeClass("hide");
            return;
        }

    }

}