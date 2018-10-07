import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { SocketService } from '../../services/socket.service'
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import * as $ from 'jquery';
declare var $: any;
@Component({
    selector: 'projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css'],
    providers: [SocketService]
})
export class ProjectsComponent implements OnInit, OnDestroy, AfterViewInit {
    constructor(private socketService: SocketService, private _router: Router) { }

    public projectControl = new FormControl('', [
        Validators.required
    ]);

    private connection;
    private projectsList: any = [];
    selected;

    ngOnInit() {
        let self = this;
        this.connection = this.socketService.getMessages().subscribe(data => {
            console.log(data);
            if (data) {
                let actualMessage;
                actualMessage = data;
                let modData = JSON.parse(actualMessage);
                if (modData && modData.length > 0 && modData[0].type === "saveProjectSuccess") {
                    self.fetchProjectsList()
                } else if (modData && modData.length > 0 && modData[0].type === "fetchProjectSuccess") { 
                    if (modData[0].hasOwnProperty("projects")) {
                        let userInfo = JSON.parse(sessionStorage.userInfo)
                        userInfo.projects = modData[0].projects;
                        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
                        self.projectsList = modData[0].projects.split(',');
                        self.updateProjectList(modData);
                    }
                }
            }
        })
    }

    ngAfterViewInit() {
        this.fetchProjectsList();
      }

    ngOnDestroy() {

    }
    sendMessage(message) {
        this.socketService.sendMessage(message);
    }

    fetchProjectsList () {
        let userInfo = JSON.parse(sessionStorage.userInfo);
        let msg = {
            type: "fetchProjectList",
            userId: userInfo.userId
        };
        this.sendMessage(msg);
    }

    updateProjectList(data) {
        console.log("latest project list = " + data[0].projects);
    }
    

    onSave() {
        let userInfo = JSON.parse(sessionStorage.userInfo);
        let projects = userInfo.projects.split(",");
        if (projects) {
            if (this.projectControl.value) {
                projects = projects + "," + this.projectControl.value
            }
        }
        if (this.projectControl.value) {
            let msg = {
                type: "saveProject",
                projects: projects,
                userId: userInfo.userId
            };
            this.sendMessage(msg);
        }
    }
}

