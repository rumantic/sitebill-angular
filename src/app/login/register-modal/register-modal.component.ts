import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import {MatDialog} from '@angular/material';
import {SitebillEntity} from '../../_models';

@Component({
    selector: 'register-modal',
    // templateUrl: '../../main/grid/form/form.component.html',
    templateUrl: './register-modal.component.html',
    styleUrls: ['./register-modal.component.scss'],
    animations: fuseAnimations
})
export class RegisterModalComponent extends FormConstructorComponent implements OnInit {
    registerForm: FormGroup;
    registerFormErrors: any;
    registerMessage: string;

    valid_domain_through_email: FormGroup;
    loading = false;
    show_register: boolean;
    show_login: boolean;



    constructor(
        protected modelService: ModelService,
        protected _snackService: SnackService,
        private authenticationService: AuthenticationService,
        protected _formBuilder: FormBuilder,
        protected _fuseNavigationService: FuseNavigationService,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        public _matDialog: MatDialog,
        protected cdr: ChangeDetectorRef
    ) {
        super(
            modelService,
            _formBuilder,
            _snackService,
            filterService,
            bitrix24Service,
            _matDialog,
            cdr,
        );

        this.valid_domain_through_email = this._formBuilder.group({
            domain_checker: ['', [Validators.required, Validators.email]],
        });
        this.show_login = true;
        this.init_register_form();

    }

    init_register_form () {
        // Set the defaults
        this.registerFormErrors = {
            domain: {},
            username: {},
            password: {},
            password_retype: {},
            agree: {},
        };
        this.form = this._formBuilder.group({
            domain: [''],
            agree: ['', Validators.required],
            username: ['', [Validators.required]],
            password: ['', Validators.required],
            password_retype: ['', Validators.required],
        });
    }

    ngOnInit() {
        this._data = new SitebillEntity();
        this._data.set_app_name('user');
        this._data.set_table_name('user');
        this._data.set_key_value('user_id');


        this._data.set_readonly(false);

        // Получить модель юзера
        if ( this.modelService.get_nobody_mode() ) {
            this.get_user_model();
        }
    }

    get_user_model () {
        this.modelService.load_only_model('user')
            .subscribe((result: any) => {
                if (result) {
                    console.log(result);
                    const columns = this.cleanup_columns(result.data.user, result.columns);
                    //const columns = result.data.user;
                    this.records = columns;
                    this.tabs = result.tabs;
                    this.tabs_keys = Object.keys(result.tabs);
                    this.rows = Object.keys(columns);
                    console.log(this.records);
                    console.log(this.rows);
                    //console.log(this.tabs);
                    this.init_form();
                    console.log(this.form);

                }
            });
    }

    cleanup_columns ( columns, columns_index ) {
        console.log(columns_index);
        console.log(columns);
        const result = [];
        for (var i = 0; i < columns_index.length; i++) {
            if ( columns[columns_index[i].name].required === 'on' && columns[columns_index[i].name].name !== 'email' && columns[columns_index[i].name].name !== 'login' ) {
                console.log(columns[columns_index[i].name]);
                result[columns_index[i].name] = columns[columns_index[i].name];
                console.log(columns[columns_index[i].name]);
            }
        }
        return result;
    }

    register() {
        this.loading = true;
        this.hide_register_complete();

        this.authenticationService.register(this.registerForm.value.username, this.registerForm.value.password, this.registerForm.value.password_retype)
            .subscribe(
                (data: any) => {
                    this.loading = false;
                    if (data.result == '0') {
                        this._snackService.message(data.msg);
                    } else {
                        let register_complete_message = 'Регистрация успешна!';
                        this._snackService.message(register_complete_message);
                        if ( data.msg !== '' ) {
                            register_complete_message = data.msg;
                        }
                        this.show_register_complete(register_complete_message);
                    }
                },
                error => {
                    this._snackService.message('Ошибка подключения к сайту');
                    this.loading = false;
                });
    }

    show_register_complete (message: string) {
        this.show_login = false;
        this.show_register = false;
        this.registerMessage = message;
        this.registerForm.controls['username'].patchValue('');
        this.registerForm.controls['password'].patchValue('');
        this.registerForm.controls['password_retype'].patchValue('');
        this.registerForm.controls['agree'].patchValue(false);
    }


    hide_register_complete () {
        this.registerMessage = null;
    }
}
