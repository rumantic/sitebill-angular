import {Component, OnInit} from '@angular/core';
import {ModelService} from '../../_services/model.service';
import {SnackService} from '../../_services/snack.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../@fuse/animations';
import {FuseNavigationService} from '../../../@fuse/components/navigation/navigation.service';
import {AuthenticationService} from '../../_services';

@Component({
    selector: 'remind-modal',
    templateUrl: './remind-modal.component.html',
    styleUrls: ['./remind-modal.component.scss'],
    animations: fuseAnimations
})
export class RemindModalComponent  implements OnInit {
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
            username: {},
        };
        this.registerForm = this._formBuilder.group({
            username: ['', [Validators.required]],
        });
    }

    ngOnInit() {
    }

    remind() {
        this.loading = true;
        this.hide_register_complete();

        this.authenticationService.remind(this.registerForm.value.username)
            .subscribe(
                (data: any) => {
                    this.loading = false;
                    if (data.state != 'success') {
                        this._snackService.message(data.error);
                    } else {
                        let register_complete_message = data.message;
                        this._snackService.message(register_complete_message);
                        if ( data.message !== '' ) {
                            register_complete_message = data.message;
                        }
                        this.show_remind_complete(register_complete_message);
                    }
                },
                error => {
                    this._snackService.message('Ошибка подключения к сайту');
                    this.loading = false;
                });
    }

    show_remind_complete (message: string) {
        this.show_login = false;
        this.show_register = false;
        this.registerMessage = message;
        this.registerForm.controls['username'].patchValue('');
    }


    hide_register_complete () {
        this.registerMessage = null;
    }
}
