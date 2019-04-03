import {Component, Inject, OnInit, isDevMode }  from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MAT_DATE_LOCALE} from "@angular/material";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup, FormControl, ValidatorFn, AbstractControl} from "@angular/forms";

import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';
import { SitebillEntity } from 'app/_models';

import { ConfirmComponent } from 'app/dialogs/confirm/confirm.component';
import { FilterService } from 'app/_services/filter.service';
import { SnackService } from 'app/_services/snack.service';
import * as moment from 'moment';

export function forbiddenNullValue(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return control.value == null || control.value == 0 ? { 'forbiddenNullValue': { value: control.value } } : null;
    };
}

@Component({
    selector: 'form-selector',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

    form: FormGroup;
    public text_area_editor_storage = {};
    public options_storage = {};
    form_submitted: boolean = false;
    rows: any[];
    tabs: any[];
    tabs_keys: any[];
    records: any[];
    api_url: string;
    render_value_string_array = ['empty','select_box','select_by_query', 'select_box_structure', 'date'];
    render_value_array = ['empty','textarea_editor', 'safe_string', 'textarea', 'primary_key'];
    square_options: any[] = [{ id: 1, value: 'range', actual: 1 }];
    galleryImages = {};

    
    private _unsubscribeAll: Subject<any>;
    loadingIndicator: boolean;

    confirmDialogRef: MatDialogRef<ConfirmComponent>;


    
    

    constructor(
        private dialogRef: MatDialogRef<FormComponent>,
        private modelSerivce: ModelService,
        private _formBuilder: FormBuilder,
        private _snackService: SnackService,
        public _matDialog: MatDialog,
        private filterService: FilterService,
        @Inject(APP_CONFIG) private config: AppConfig,
        @Inject(MAT_DIALOG_DATA) private _data: SitebillEntity
        ) {
        this.loadingIndicator = true;
        
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        if (isDevMode()) {
            this.api_url = this.config.apiEndpoint;
        } else {
            this.api_url = '';
        }

    }

    ngOnInit() {
        // Reactive Form
        this.form = this._formBuilder.group({
        });
        this.getModel();

    }

    is_date_type(type: string) {
        if (type == 'dtdatetime' || type == 'dtdate' || type == 'dttime') {
            return true;
        }
        return false;
    }

    init_form() {
        console.log(this.records);

        for (var i = 0; i < this.rows.length; i++) {
            //console.log(this.records[this.rows[i]]);
            let form_control_item = new FormControl(this.records[this.rows[i]].value);
            form_control_item.clearValidators();
            this.records[this.rows[i]].required_boolean = false;
            if (this.records[this.rows[i]].required == 'on') {
                form_control_item.setValidators(forbiddenNullValue());
                this.records[this.rows[i]].required_boolean = true;
            }

            this.form.addControl(this.rows[i], form_control_item);
            if (this.is_date_type(this.records[this.rows[i]].type) && this.records[this.rows[i]].value == "now") {
                this.form.controls[this.rows[i]].patchValue(moment());
            }

            
            if (this.records[this.rows[i]].type == 'textarea_editor') {
                this.text_area_editor_storage[this.records[this.rows[i]].name] = this.records[this.rows[i]].value;
            }
            if (this.records[this.rows[i]].type == 'select_by_query') {
                this.init_select_by_query_options(this.records[this.rows[i]].name);
                if (this.records[this.rows[i]].value == 0) {
                    this.form.controls[this.rows[i]].patchValue(null);
                }
            }
            if (this.records[this.rows[i]].type == 'select_box_structure') {
                this.init_select_by_query_options(this.records[this.rows[i]].name);
                if (this.records[this.rows[i]].value == 0) {
                    this.form.controls[this.rows[i]].patchValue(null);
                }
            }

            if (this.records[this.rows[i]].type == 'checkbox') {
                if (this.records[this.rows[i]].value != 1) {
                    this.form.controls[this.rows[i]].patchValue(false);
                }
            }


            if (this.records[this.rows[i]].type == 'uploads') {
                this.init_gallery_images(this.records[this.rows[i]].name, this.records[this.rows[i]].value);
            }
        }
    }

    init_gallery_images(field_name, images) {
        this.galleryImages[field_name] = {};
        var self = this;
        if (images) {
            this.galleryImages[field_name] = images.map(function (image: any) {

                return {
                    small: self.api_url + '/img/data/' + image.preview + '?' + new Date().getTime(),
                    medium: self.api_url + '/img/data/' + image.normal + '?' + new Date().getTime(),
                    big: self.api_url + '/img/data/' + image.normal + '?' + new Date().getTime()
                };
            });
        } else {
            this.galleryImages[field_name] = [];
        }
    }

    init_select_by_query_options(columnName) {
        this.modelSerivce.load_dictionary(columnName)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    this.options_storage[columnName] = result.data;
                }

            });

    }

    getModel(): void {
        const primary_key = this._data.primary_key;
        const key_value = this._data.key_value;
        const model_name = this._data.app_name;
        //console.log(this.modelSerivce.entity);
        this.modelSerivce.entity.app_name = model_name;
        this.modelSerivce.entity.primary_key = primary_key;
        this.modelSerivce.entity.key_value = key_value;
        

        this.modelSerivce.loadById(model_name, primary_key, key_value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    console.log(result);
                    this.records = result.data;
                    this.tabs = result.tabs;
                    this.tabs_keys = Object.keys(result.tabs);
                    this.rows = Object.keys(result.data);
                    console.log(this.rows);
                    console.log(this.tabs);
                    this.init_form();
                }

            });
    }


    delete() {
        this.confirmDialogRef = this._matDialog.open(ConfirmComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить запись?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.modelSerivce.delete(this._data.app_name, this._data.primary_key, this._data.key_value)
                    .subscribe((response: any) => {
                        console.log(response);

                        if (response.state == 'error') {
                            this._snackService.message(response.message);
                            return null;
                        } else {
                            this._snackService.message('Запись удалена успешно');
                            this.filterService.empty_share(this._data);
                            this.close();
                        }
                    });
            }
            this.confirmDialogRef = null;
        });
    }


    save() {
        console.log(this.form.controls);
        //console.log(this.modelSerivce.entity);

        
        /*
        this.editing[rowIndex + '-' + cell] = false;
        this.rows_my[rowIndex]['status_id']['value'] = event.target.value;

        const status_id = this.item_model['status_id'];
        const select_data = status_id['select_data'];

        this.rows_my[rowIndex]['status_id']['value_string'] = select_data[event.target.value];
        this.rows_my = [...this.rows_my];
        */
        //console.log('UPDATED!', this.rows[rowIndex][cell]);
        const ql_items = {};

        for (var i = 0; i < this.rows.length; i++) {
            //ql_items.push({ '123': 'test'});
            if (this.text_area_editor_storage[this.rows[i]]) {
                this.form.controls[this.rows[i]].patchValue(this.text_area_editor_storage[this.rows[i]]);
            } else if (this.records[this.rows[i]].type == 'checkbox' && this.form.controls[this.rows[i]].value == '') {
                this.form.controls[this.rows[i]].patchValue(0);
            } else if (this.records[this.rows[i]].type == 'primary_key' && this.form.controls[this.rows[i]].value == 0) {
                this.form.controls[this.rows[i]].patchValue(this.modelSerivce.entity.key_value);
            }

            ql_items[this.rows[i]] = this.form.controls[this.rows[i]].value;
        }
        this.form_submitted = true;
        if (!this.form.valid) {

            this._snackService.message('Проверьте поля формы, возможно некоторые заполнены неправильно');
            return null;
        }

        console.log(ql_items);
        //return;


        this.modelSerivce.update(this._data.app_name, this._data.key_value, ql_items)
            .subscribe((response: any) => {
                console.log(response);

                if (response.state == 'error') {
                    this._snackService.message(response.message);
                    return null;
                } else {
                    this._snackService.message('Запись сохранена успешно');
                    this.filterService.empty_share(this._data);
                    this.close();
                }
            });


    }


    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close();
    }

}

