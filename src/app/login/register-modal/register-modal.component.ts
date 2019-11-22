import {Component, OnInit} from '@angular/core';
import {ModelService} from '../../_services/model.service';
import {SnackService} from '../../_services/snack.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../@fuse/animations';
import {FuseNavigationService} from '../../../@fuse/components/navigation/navigation.service';
import {AuthenticationService} from '../../_services';

@Component({
    selector: 'register-modal',
    templateUrl: './register-modal.component.html',
    styleUrls: ['./register-modal.component.scss'],
    animations: fuseAnimations
})
export class RegisterModalComponent  implements OnInit {
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
        private _formBuilder: FormBuilder,
        protected _fuseNavigationService: FuseNavigationService,
    ) {
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
        this.registerForm = this._formBuilder.group({
            domain: [''],
            agree: ['', Validators.required],
            username: ['', [Validators.required]],
            password: ['', Validators.required],
            password_retype: ['', Validators.required]
        });
    }

    ngOnInit() {
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
