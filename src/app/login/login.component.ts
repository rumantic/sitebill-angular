import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

import {AlertService, AuthenticationService} from '../_services/index';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: fuseAnimations
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    loginForm: FormGroup;
    loginFormErrors: any;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';



    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _fuseConfigService: FuseConfigService,
        public snackBar: MatSnackBar,
        private alertService: AlertService) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };

        // Set the defaults
        this.loginFormErrors = {
            domain: {},
            username: {},
            password: {}
        };

    }

    ngOnInit() {
        // reset login status
        this.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/grid/data/';
        /*
        this.loginForm = this._formBuilder.group({
            domain: ['', [Validators.required]],
            username: ['', [Validators.required]],
            password: ['', Validators.required]
        });
        */

        this.loginForm = this._formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }

    logout() {
        //console.log('logout');
        localStorage.removeItem('currentUser');
        localStorage.clear();
        this.authenticationService.logout()
            .subscribe(
                data => {
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    login() {
        this.loading = true;
        //console.log(this.loginForm.value);
        //return;

        this.authenticationService.login(this.loginForm.value.domain, this.loginForm.value.username, this.loginForm.value.password)
            .subscribe(
                data => {
                    if (data.state == 'error') {
                        this.alertService.error(data.error);
                        this.loading = false;
                        this.snackBar.open(data.error, 'ok', {
                            duration: 2000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });

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
