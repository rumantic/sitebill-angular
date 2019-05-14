import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

import {AlertService, AuthenticationService} from '../_services/index';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { navigation } from 'app/navigation/navigation';
import { ModelService } from 'app/_services/model.service';

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
        private modelSerivce: ModelService,
        protected _fuseNavigationService: FuseNavigationService,
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
            domain: [''],
            username: ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }

    disable_menu() {
        //console.log('disable menu');
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
    }

    logout() {
        this.disable_menu();
        //console.log('logout');
        this.authenticationService.logout()
            .subscribe(
            data => {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('api_url');
                localStorage.clear();

            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }


    login() {
        this.disable_menu();
        this.loading = true;
        if (this.loginForm.value.domain != '' && this.loginForm.value.domain != null) {
            this.modelSerivce.set_api_url(this.loginForm.value.domain);
        } else {
            this.modelSerivce.set_api_url('http://estate.sitebill.ru');
        }

        //console.log(this.loginForm.value.domain);
        //return;

        this.authenticationService.login(this.loginForm.value.domain, this.loginForm.value.username, this.loginForm.value.password)
            .subscribe(
                data => {
                    //console.log(data);

                    if (data.state == 'error') {
                        this.alertService.error(data.error);
                        this.loading = false;
                        this.snackBar.open(data.error, 'ok', {
                            duration: 2000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });

                    } else {
                        if (data.admin_panel_login == 1) {

                            this._fuseNavigationService.unregister('main');
                            this._fuseNavigationService.register('main', navigation);
                            this._fuseNavigationService.setCurrentNavigation('main');

                            this.router.navigate([this.returnUrl]);
                        } else if (data.success == 1) {
                            this.router.navigate(['/public/lead/']);
                        } else {
                            let error = 'Доступ запрещен';
                            this.alertService.error(error);
                            this.loading = false;
                            this.snackBar.open(error, 'ok', {
                                duration: 2000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                            });
                        }
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
