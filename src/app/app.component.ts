import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet} from "@angular/router";
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'my-app',
    templateUrl:'app.component.html'
})
export class AppComponent {
	options: FormGroup;
    constructor(private _router:Router, fb: FormBuilder){
        //this.router.navigate(["/login"]);
        this.options = fb.group({
      		'fixed': false,
      		'top': 0,
      		'bottom': 0,
    	});
    }

    onLogout () {
        this.clearSessionStorage();
        this._router.navigate(['/home']);
    }

    clearSessionStorage() {
        sessionStorage.clear();
    }

    onProfile() {
        this._router.navigate(['/profile']);
    }
}