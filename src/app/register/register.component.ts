import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

import {AlertService, AuthenticationService} from '../_services/index';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { navigation } from 'app/navigation/navigation';
import { ModelService } from 'app/_services/model.service';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
    selector: 'register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.scss'],
    animations: fuseAnimations
})

export class RegisterComponent implements OnInit {
    model: any = {};
    loading = false;
    hide_domain: boolean = true;
    returnUrl: string;

    registerForm: FormGroup;
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
        @Inject(DOCUMENT) private document: any,
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
        this.hide_domain = true;
        //this.init_input_parameters();

        // reset login status
        //this.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/grid/data/';
        /*
        this.loginForm = this._formBuilder.group({
            domain: ['', [Validators.required]],
            username: ['', [Validators.required]],
            password: ['', Validators.required]
        });
        */

        this.registerForm = this._formBuilder.group({
            domain: [''],
            name: [''],
            email: [''],
            passwordConfirm: [''],
            terms: [''],
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



    init_input_parameters() {
        let app_root_element;
        let elements = [];
        if (this.document.getElementById('angular_search')) {
            app_root_element = this.document.getElementById('angular_search');
        } else if (this.document.getElementById('angular_search_ankonsul')) {
            app_root_element = this.document.getElementById('angular_search_ankonsul');
        } else if (this.document.getElementById('app_root')) {
            app_root_element = this.document.getElementById('app_root');
        }
        if (app_root_element.getAttribute('enable_domain_auth')) {
            if (app_root_element.getAttribute('enable_domain_auth') == 'true' ) {
                this.hide_domain = false;
            }
        }

    }

}
