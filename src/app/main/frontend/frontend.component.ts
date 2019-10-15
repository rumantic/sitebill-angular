import {Component, isDevMode, ElementRef, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import {DOCUMENT} from '@angular/platform-browser';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';


import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material';
import {SnackService} from '../../_services/snack.service';
import {fuseAnimations} from '../../../@fuse/animations';

@Component({
    selector   : 'frontend',
    templateUrl: './frontend.component.html',
    styleUrls  : ['./frontend.component.scss'],
    animations: fuseAnimations
})
export class FrontendComponent
{
    loginForm: FormGroup;
    loginFormErrors: any;
    valid_domain_through_email: FormGroup;
    loading = false;
    register_success = false;
    hide_domain: boolean = false;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';



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
            name: {},
            email: {},
            password: {}
        };

    }
    ngOnInit() {
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
        const request = { action: 'addclient', fullname: fullname, lastname: '', email: email, password: password };
        return this.http.post(`https://www.sitebill.ru/whmcs_cpanel1.php`, request);
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
                    }
                }
            );
    }

    
    init_input_parameters () {
        let app_root_element;
        if (this.document.getElementById('calculator_mini_root')) {
            app_root_element = this.document.getElementById('calculator_mini_root');
        } else if (this.document.getElementById('app_root').getAttribute('realty_price') > 0) {
            app_root_element = this.document.getElementById('app_root');
        }
    }
    
    
}
