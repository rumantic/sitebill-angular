import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

import {AlertService, AuthenticationService} from '../_services/index';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { navigation } from 'app/navigation/navigation';
import { ModelService } from 'app/_services/model.service';
import { DOCUMENT } from '@angular/platform-browser';
import {SnackService} from '../_services/snack.service';
import {toASCII, decode} from 'punycode';
@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: fuseAnimations
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    hide_domain: boolean = true;
    returnUrl: string;
    valid_domain_through_email: FormGroup;

    loginForm: FormGroup;
    loginFormErrors: any;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    show_register: boolean;
    show_login: boolean;
    registerMessage: string;
    show_remind: boolean;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _fuseConfigService: FuseConfigService,
        public snackBar: MatSnackBar,
        protected _snackService: SnackService,
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
        this.show_login = true;

    }

    ngOnInit() {
        this.hide_domain = true;

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
        this.valid_domain_through_email = this._formBuilder.group({
            domain_checker: ['', [Validators.required, Validators.email]],
        });

        this.init_input_parameters();
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
                this.router.navigate(['/login/']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    convert_to_https_domain(data:string) {
        let hostname;
        if ( data.match(/http/i) ) {
            let a = this.document.createElement('a');
            a.href = data;
            hostname =  'https://' + a.hostname;
        } else {
            hostname =  'https://' + data;
        }

        return hostname;
    }


    login() {
        this.disable_menu();
        this.loading = true;


        if (this.loginForm.value.domain != '' && this.loginForm.value.domain != null) {
            let domain = toASCII(this.loginForm.value.domain);
            let https_replace = 'https://';
            let http_replace = 'http://';
            domain = domain.replace(https_replace, '');
            domain = domain.replace(http_replace, '');

            if (!/\./.test(domain)) {
                this._snackService.message('Сайт указан неверно');
                this.loading = false;
                return false;
            }
            this.valid_domain_through_email.controls['domain_checker'].patchValue('test@'+domain);
            this.valid_domain_through_email.controls['domain_checker'].updateValueAndValidity();
            if (!this.valid_domain_through_email.controls['domain_checker'].valid) {
                this._snackService.message('Сайт указан неверно');
                this.loading = false;
                return false;
            }

            this.modelSerivce.set_api_url(this.convert_to_https_domain(domain));
        } else {
            this.modelSerivce.set_api_url('');
        }

        //console.log(this.loginForm.value.domain);
        //return;


        this.authenticationService.login(this.loginForm.value.domain, this.loginForm.value.username, this.loginForm.value.password)
            .subscribe(
                (data: any) => {
                    if (data.state == 'error') {
                        //this.alertService.error(data.error);
                        this.loading = false;
                        this._snackService.message('Логин или пароль указаны неверно');
                    } else {
                        if (data.admin_panel_login == 1) {

                            this._fuseNavigationService.unregister('main');
                            this._fuseNavigationService.register('main', navigation);
                            this._fuseNavigationService.setCurrentNavigation('main');
                            this.after_success_login();

                            this.router.navigate([this.returnUrl]);
                        } else if (data.success == 1) {
                            this.after_success_login();
                            this.router.navigate(['/']);
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
                    this._snackService.message('Ошибка подключения к сайту');
                    this.loading = false;
                });
    }

    after_success_login () {
        this._snackService.message('Авторизация успешна!');
        this.modelSerivce.disable_nobody_mode();
        this.modelSerivce.load_current_user_profile();
        this.modelSerivce.init_config();
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
                this.loginForm.controls['domain'].setValidators([Validators.required]);
                this.hide_domain = false;
            }
        }

    }

    show_login_form() {
        this.show_login = true;
        this.show_register = false;
        this.show_remind = false;
        this.hide_register_complete();
    }

    show_register_form() {
        this.show_login = false;
        this.show_register = true;
        this.show_remind = false;
        this.hide_register_complete();
    }

    hide_register_complete () {
        this.registerMessage = null;
    }

    show_remind_form() {
        this.show_login = false;
        this.show_register = false;
        this.show_remind = true;

    }
}

