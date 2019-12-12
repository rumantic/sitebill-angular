import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ModelService} from '../../../_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {takeUntil} from 'rxjs/operators';
import {SitebillEntity} from '../../../_models';

@Component({
    selector: 'compose-modal',
    templateUrl: './compose-modal.component.html',
    styleUrls: ['./compose-modal.component.scss'],
    animations: fuseAnimations
})
export class ComposeModalComponent  implements OnInit {
    registerForm: FormGroup;
    registerFormErrors: any;
    options_storage = {};


    codeForm: FormGroup;
    codeFormErrors: any;

    registerMessage: string;

    valid_domain_through_email: FormGroup;
    loading = false;
    show_register: boolean;
    show_login: boolean;
    show_input_remind_code: boolean;
    street_id_select: any;
    private focus_complete: boolean;
    private entity: SitebillEntity;



    constructor(
        protected modelService: ModelService,
        protected _snackService: SnackService,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any
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
        this.codeFormErrors = {
            code: {},
        };


        this.registerForm = this._formBuilder.group({
            username: [''],
            street_id: [''],
        });

        this.codeForm = this._formBuilder.group({
            code: ['', [Validators.required]],
        });
    }

    ngOnInit() {
        console.log(this._data);
        this.entity = this._data.entity;
        this.show_input_remind_code = false;
        this.load_dictionary('street_id');
        this.load_dictionary('city_id');
    }

    onFocus(columnName) {
        console.log(columnName);
        if (!this.focus_complete) {
            /*
            if (this.columnObject.type == 'price') {
                this.get_max(this.entity, this.columnObject.model_name);
            } else {
                this.load_dictionary(this.columnObject.model_name);
            }
             */
            this.load_dictionary(columnName);
            
            this.focus_complete = true;
        }
    }

    load_dictionary(columnName) {

        this.modelService.load_dictionary_model(this.entity.get_table_name(), columnName)
            .subscribe((result: any) => {
                //console.log(columnName);
                console.log(result);
                /*
                if (this.filterService.share_array[this.entity.get_app_name()] != undefined) {
                    this.selectedFilter = this.filterService.share_array[this.entity.get_app_name()][columnName];
                }
                 */
                this.options_storage[columnName] = result.data;
                console.log(this.options);
            });

    }



}
