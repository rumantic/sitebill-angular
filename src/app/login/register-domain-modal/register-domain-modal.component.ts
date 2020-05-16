import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit} from '@angular/core';
import {ModelService} from '../../_services/model.service';
import {SnackService} from '../../_services/snack.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../@fuse/animations';
import {FuseNavigationService} from '../../../@fuse/components/navigation/navigation.service';
import {AuthenticationService} from '../../_services';
import {takeUntil} from 'rxjs/operators';
import * as moment from 'moment';
import {forbiddenNullValue, FormConstructorComponent} from '../../main/grid/form/form-constructor.component';
import {FilterService} from '../../_services/filter.service';
import {Bitrix24Service} from '../../integrations/bitrix24/bitrix24.service';
import {MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material';
import {SitebillEntity} from '../../_models';
import {HttpClient} from '@angular/common/http';
import {DOCUMENT} from '@angular/platform-browser';
import {FuseConfigService} from '../../../@fuse/services/config.service';
import {APP_CONFIG, AppConfig} from '../../app.config.module';
import {FuseTranslationLoaderService} from '../../../@fuse/services/translation-loader.service';
import {locale as english} from './i18n/en';
import {locale as russian} from './i18n/ru';

export interface Progress {
    progress: string;
    message: string;
}

@Component({
    selector: 'register-domain-modal',
    // templateUrl: '../../main/grid/form/form.component.html',
    templateUrl: './register-domain-modal.component.html',
    styleUrls: ['./register-domain-modal.component.scss'],
    animations: fuseAnimations
})
export class RegisterDomainModalComponent
{
    loginForm: FormGroup;
    loginFormErrors: any;
    valid_domain_through_email: FormGroup;
    loading = false;
    register_success = false;
    hide_domain: boolean = false;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    public source: any;
    progress: any;
    private domain: any;
    wait_message: any;
    progress_mode: any;


    /**
     * Constructor
     *
     */
    constructor(
        private http: HttpClient,
        private elRef: ElementRef,
        private modelSerivce: ModelService,
        private _formBuilder: FormBuilder,
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        @Inject(APP_CONFIG) private config: AppConfig,
        public snackBar: MatSnackBar,
        protected _snackService: SnackService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this.progress = 0;
        this.progress_mode = 'determinate';

        // Set the defaults
        this.loginFormErrors = {
            name: {},
            email: {},
            password: {}
        };

    }
    ngOnInit() {
        this.init_input_parameters();
        this.loginForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
        this.valid_domain_through_email = this._formBuilder.group({
            domain_checker: ['', [Validators.required, Validators.email]],
        });
    }

    whmcs_create(fullname, lastname, email, password) {
        const request = { action: 'addclient', fullname: fullname, lastname: '', email: email, password: password, source: this.source };
        console.log(request);
        // return this.http.post(`https://www.sitebill.ru/whmcs_cpanel1_dump.php`, request);
        return this.http.post(`https://www.sitebill.ru/whmcs_cpanel1.php`, request);
    }

    get_progress(domain_name) {
        return this.http.get('http://' + domain_name + '/progress.php');
    }



    register() {
        this.loading = true;
        this.whmcs_create(this.loginForm.value.name, '', this.loginForm.value.email, this.loginForm.value.password)
            .subscribe(
                (data: any) => {
                    this.loading = false;
                    //console.log(data);
                    if ( data.RESULT == 'error' ) {
                        this.snackBar.open(data.MESSAGE, 'ok', {
                            duration: 2000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });
                    } else {
                        this.register_success = true;
                        this.modelSerivce.set_install_mode(true);
                        this.progress_mode = 'determinate';
                        this.wait_message = 'Пожалуйста, подождите ... ';
                        this.show_progress(data.domain);
                    }
                }
            );
    }

    show_progress ( domain = null ) {
        // console.log('progress');
        // domain = 'api.sitebill.ru';
        if ( domain !== null ) {
            this.domain = domain;
        }

        const refreshIntervalId = setInterval(() => {
            this.get_progress(this.domain).subscribe( (data: Progress) => {
                console.log(data);
                if ( data.progress !== null ) {
                    this.progress_mode = 'determinate';
                    this.progress = data.progress;
                }
                if ( data.progress == '100' ) {
                    clearInterval(refreshIntervalId);
                    this.run_autologin();
                }
            });

        }, 1000);

    }


    init_input_parameters() {
        let app_root_element;
        if (this.document.getElementById('angular_search')) {
            app_root_element = this.document.getElementById('angular_search');
        } else if (this.document.getElementById('angular_search_ankonsul')) {
            app_root_element = this.document.getElementById('angular_search_ankonsul');
        } else if (this.document.getElementById('app_root')) {
            app_root_element = this.document.getElementById('app_root');
        }

        if (app_root_element.getAttribute('source') !== undefined ) {
            this.source = app_root_element.getAttribute('source');
        } else {
            this.source = 'native';
        }
    }



    show_login_form() {

    }

    private run_autologin() {
        this.wait_message = 'Готово';
        console.log('run autologin');

    }
}
