import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material';
import {FormComponent} from '../../main/grid/form/form.component';
import {ModelService} from '../../_services/model.service';
import {SnackService} from '../../_services/snack.service';
import {APP_CONFIG, AppConfig} from '../../app.config.module';
import {SitebillEntity} from '../../_models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../@fuse/animations';
import {DOCUMENT} from '@angular/platform-browser';
import {toASCII} from "punycode";
import {navigation} from '../../navigation/navigation';
import {FuseNavigationService} from '../../../@fuse/components/navigation/navigation.service';
import {AlertService, AuthenticationService} from '../../_services';

@Component({
    selector: 'login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.scss'],
    animations: fuseAnimations
})
export class LoginModalComponent  implements OnInit {
    loginForm: FormGroup;
    loginFormErrors: any;
    valid_domain_through_email: FormGroup;
    hide_domain: boolean = true;
    loading = false;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';



    constructor(
        protected dialogRef: MatDialogRef<FormComponent>,
        protected modelService: ModelService,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        private authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private modelSerivce: ModelService,
        private alertService: AlertService,
        public snackBar: MatSnackBar,
        protected _fuseNavigationService: FuseNavigationService,
        @Inject(APP_CONFIG) protected config: AppConfig,
        @Inject(DOCUMENT) private document: any,
        @Inject(MAT_DIALOG_DATA) public _data: SitebillEntity
    ) {
        // Set the defaults
        this.loginFormErrors = {
            domain: {},
            username: {},
            password: {}
        };
    }

    ngOnInit() {
        this.init_input_parameters();

        this.loginForm = this._formBuilder.group({
            domain: [''],
            username: ['', [Validators.required]],
            password: ['', Validators.required]
        });
        this.valid_domain_through_email = this._formBuilder.group({
            domain_checker: ['', [Validators.required, Validators.email]],
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
                        } else if (data.success == 1) {
                            this.after_success_login();
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
        this.modelService.disable_nobody_mode();
        this.dialogRef.close();
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

}
