import {Component, Inject, OnInit, isDevMode, ViewEncapsulation, Input }  from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, Validators, FormGroup, FormControl} from "@angular/forms";

import { ChatService } from 'app/main/apps/chat/chat.service';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';
import { NgxGalleryImage } from 'ngx-gallery';
import { SitebillEntity } from 'app/_models';

import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material';
import { SnackBarComponent } from 'app/main/snackbar/snackbar.component';



@Component({
    selector: 'form-selector',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

    form: FormGroup;
    public text_area_editor_storage = {};
    public options_storage = {};
    rows: any[];
    records: any[];
    api_url: string;
    render_value_string_array = ['empty','select_box','select_by_query', 'select_box_structure', 'date'];
    render_value_array = ['empty','textarea_editor', 'safe_string', 'textarea', 'primary_key'];
    square_options: any[] = [{ id: 1, value: 'range', actual: 1 }];
    galleryImages = {};

    
    private _unsubscribeAll: Subject<any>;
    loadingIndicator: boolean;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    
    

    constructor(
        private dialogRef: MatDialogRef<FormComponent>,
        private _httpClient: HttpClient,
        private modelSerivce: ModelService,
        private _formBuilder: FormBuilder,
        private _chatService: ChatService,
        public snackBar: MatSnackBar,
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

    init_form() {
        for (var i = 0; i < this.rows.length; i++) {
            //console.log(this.records[this.rows[i]]);
            let form_control_item = new FormControl(this.records[this.rows[i]].value);
            if (this.records[this.rows[i]].required == 'on') {
                form_control_item.setValidators(Validators.required);
            }

            if (this.records[this.rows[i]].type == 'textarea_editor') {
                this.text_area_editor_storage[this.records[this.rows[i]].name] = this.records[this.rows[i]].value;
            }
            if (this.records[this.rows[i]].type == 'select_by_query') {
                this.init_select_by_query_options(this.records[this.rows[i]].name);
            }
            if (this.records[this.rows[i]].type == 'select_box_structure') {
                this.init_select_by_query_options(this.records[this.rows[i]].name);
            }

            if (this.records[this.rows[i]].type == 'uploads') {
                this.init_gallery_images(this.records[this.rows[i]].name, this.records[this.rows[i]].value);
            }






            this.form.addControl(this.rows[i], form_control_item);
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
        console.log(this.modelSerivce.entity);
        this.modelSerivce.entity.app_name = model_name;
        this.modelSerivce.entity.primary_key = primary_key;
        this.modelSerivce.entity.key_value = key_value;
        

        this.modelSerivce.loadById(model_name, primary_key, key_value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    this.records = result.data;
                    this.rows = Object.keys(result.data);
                    this.init_form();
                }

            });
    }



    save() {
        console.log(this.modelSerivce.entity);

        
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
            } else if (this.records[this.rows[i]].type == 'primary_key' && this.form.controls[this.rows[i]].value == 0) {
                this.form.controls[this.rows[i]].patchValue(this.modelSerivce.entity.key_value);
            }

            ql_items[this.rows[i]] = this.form.controls[this.rows[i]].value;
        }
        console.log(ql_items);
        //return;


        this.modelSerivce.update(this._data.app_name, this._data.key_value, ql_items)
            .subscribe((response: any) => {
                if (response.state == 'error') {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 3000,
                        announcementMessage: 'some test',
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                    });
                    /*
                    this.snackBar.open(response.message, 'Закрыть', {
                        duration: 3000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                    });
                    */
                }


                console.log(response);
            });


        //this.dialogRef.close(this.form.value);
    }

    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close();
    }

}

