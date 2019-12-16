import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ModelService} from '../../../_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {takeUntil} from 'rxjs/operators';
import {SitebillEntity} from '../../../_models';
import {FilterService} from '../../../_services/filter.service';

@Component({
    selector: 'compose-modal',
    templateUrl: './compose-modal.component.html',
    styleUrls: ['./compose-modal.component.scss'],
    animations: fuseAnimations
})
export class ComposeModalComponent  implements OnInit {
    valid_domain_through_email: FormGroup;
    loading = false;
    show_login: boolean;
    private entity: SitebillEntity;
    form_compose_columns: any[];
    private composeForm: FormGroup;
    public compose_form_complete: boolean;
    options_storage = {};
    options_storage_titles = [];



    constructor(
        protected modelService: ModelService,
        private _formBuilder: FormBuilder,
        private filterService: FilterService,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.valid_domain_through_email = this._formBuilder.group({
            domain_checker: ['', [Validators.required, Validators.email]],
        });
        this.show_login = true;
        this.init_register_form();

    }

    init_register_form () {
        this.composeForm = this._formBuilder.group({});
    }

    ngOnInit() {
        /*
        console.log(this._data.column.model_name);
        console.log(this._data.entity);
        console.log(this._data.entity.columns_index[this._data.column.model_name]);
        console.log(this._data.entity.model[this._data.entity.columns_index[this._data.column.model_name]]);

        console.log(this._data.entity.model[this._data.entity.columns_index[this._data.column.model_name]].parameters.columns);
         */
        this.entity = this._data.entity;
        this.init_compose_form();
    }

    get_title ( column_name ) {
        return this._data.entity.model[this._data.entity.columns_index[column_name]].title;
    }

    column_defined ( column_name ) {
        if ( this._data.entity.model[this._data.entity.columns_index[column_name]] != null ) {
            return true;
        }
        return false;
    }

    get_compose_columns () {
        const compose_string = this._data.entity.model[this._data.entity.columns_index[this._data.column.model_name]].parameters.columns;
        return compose_string.split(',');
    }

    init_compose_form () {
        let compose_columns = [];
        try {
            compose_columns = this.get_compose_columns();
            if ( compose_columns.length > 0 ) {
                this.form_compose_columns = compose_columns;
                for (let i = 0; i < compose_columns.length; i++) {
                    if ( this.column_defined(compose_columns[i]) ) {
                        const form_control_item = new FormControl(compose_columns[i]);
                        form_control_item.clearValidators();
                        this.options_storage[compose_columns[i]] = [];
                        this.options_storage_titles[compose_columns[i]] = this.get_title(compose_columns[i]);
                        this.composeForm.addControl(compose_columns[i], form_control_item);
                    }
                }
                this.compose_form_complete = true;
            }
        } catch (e) {
            console.log(e);
        }
    }

    onFocus(columnName) {
        this.load_dictionary(columnName);
    }

    load_dictionary(columnName) {
        this.modelService.load_dictionary_model(this.entity.get_table_name(), columnName)
            .subscribe((result: any) => {
                this.options_storage[columnName] = result.data;
            });
    }

    apply() {
        try {
            const compose_columns = this.get_compose_columns();
            let compose_result = {};
            if (compose_columns.length > 0) {
                for (let i = 0; i < compose_columns.length; i++) {
                    if ( this.column_defined(compose_columns[i]) ) {
                        if ( this.composeForm.controls[compose_columns[i]].value !=  compose_columns[i]) {
                            //console.log(this.composeForm.controls[compose_columns[i]].value);
                            compose_result[compose_columns[i]] = this.composeForm.controls[compose_columns[i]].value;
                        }
                    }
                    //console.log(compose_columns[i]);
                }

                //console.log(compose_result);
                //console.log(this.entity);
                //console.log(this._data.column.model_name);
                this.filterService.share_data(this.entity, this._data.column.model_name, compose_result);

            }
        } catch (e) {

        }

    }
}
