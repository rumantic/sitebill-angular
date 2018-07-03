import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

import {AlertService, AuthenticationService} from '../_services/index';

@Component({
    selector   : 'login',
    templateUrl: 'login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    loginForm: FormGroup;
    loginFormErrors: any;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private alertService: AlertService) {
            // Set the defaults
            this.loginFormErrors = {
                username   : {},
                password: {}
            };
            
        }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        
        this.loginForm = this._formBuilder.group({
            username   : ['', [Validators.required]],
            password: ['', Validators.required]
        });

        
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
            data => {
                if (data.error) {
                    this.alertService.error(data.error);
                    this.loading = false;
                } else {
                    this.router.navigate([this.returnUrl]);
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
}
