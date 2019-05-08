import {Component, Inject, OnInit, isDevMode }  from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MAT_DATE_LOCALE} from "@angular/material";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup, FormControl, ValidatorFn, AbstractControl, Validators} from "@angular/forms";

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
    latitude: any;
    longitude: any;
    lat: any;
    lng: any;
    lat_center: any;
    lng_center: any;

    
    private _unsubscribeAll: Subject<any>;
    loadingIndicator: boolean;

    confirmDialogRef: MatDialogRef<ConfirmComponent>;

    quillConfig = {
        toolbar: {
    container:
    [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                    // remove formatting button

    ],
},
        // toolbar: {
        //   container: [
        //     ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        //     ['code-block'],
        //     [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        //     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        //     //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        //     //[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        //     //[{ 'direction': 'rtl' }],                         // text direction

        //     //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        //     //[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        //     //[{ 'font': [] }],
        //     //[{ 'align': [] }],

        //     ['clean'],                                         // remove formatting button

        //     ['link'],
        //     //['link', 'image', 'video']  
        //     ['emoji'], 
        //   ],
        //   handlers: {'emoji': function() {}}
        // },
    };

    editorOptions = {
        theme: 'snow',
        modules: {
            toolbar: {
                container:
                    [
                        [{ 'placeholder': ['[GuestName]', '[HotelName]'] }], // my custom dropdown
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],

                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                        [{ 'direction': 'rtl' }],                         // text direction

                        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        [{ 'font': [] }],
                        [{ 'align': [] }],

                        ['clean']                                    // remove formatting button

                    ],
                handlers: {
                    "placeholder": function (value) {
                        if (value) {
                            const cursorPosition = this.quill.getSelection().index;
                            this.quill.insertText(cursorPosition, value);
                            this.quill.setSelection(cursorPosition + value.length);
                        }
                    }
                }
            }
        }
    };    
    

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
        this.lat_center = 55.76;
        this.lng_center = 37.64;
    }

    ngOnInit() {
        // Reactive Form
        this.form = this._formBuilder.group({
        });
        this.getModel();

    }

    is_date_type(type: string) {
        if (type == 'dtdatetime' || type == 'dtdate' || type == 'dttime' || type == 'date') {
            return true;
        }
        return false;
    }

    apply_topic_activity() {
        //commercial_subtype
        //console.log(this.form.controls['commercial_subtype']);
        //this.form.controls['commercial_subtype'].clearValidators();
        //this.form.controls['commercial_subtype'].updateValueAndValidity();

        let current_topic_id = this.form.controls['topic_id'].value;
        console.log('current_topic_id = ' + current_topic_id);

        for (var i = 0; i < this.rows.length; i++) {
            if (this.records[this.rows[i]].active_in_topic != '0') {
                if (this.records[this.rows[i]].active_in_topic_array.indexOf(current_topic_id) == -1) {
                    this.form.get(this.rows[i]).clearValidators();
                    this.form.get(this.rows[i]).updateValueAndValidity();
                    this.records[this.rows[i]].required_boolean = false;
                    this.records[this.rows[i]].hidden = true;

                    console.log(this.records[this.rows[i]].name);
                    console.log(this.records[this.rows[i]].active_in_topic_array);
                } else {
                    this.records[this.rows[i]].hidden = false;
                    if (this.records[this.rows[i]].required == 'on') {
                        this.records[this.rows[i]].required_boolean = true;
                        this.form.get(this.rows[i]).setValidators(forbiddenNullValue());
                        this.form.get(this.rows[i]).updateValueAndValidity();

                    }

                }
            }

        }


        //console.log(this.form.controls['commercial_subtype']);

    }

    init_form() {
        console.log(this.records);

        //Сначала нужно получить значение topic_id
        //В цикле, есть есть совпадения с active_in_topic, тогда применяем правила ОБЯЗАТЕЛЬНОСТИ
        //При смене типа в форме, надо перезапускать процесс показа/валидации элементов

        for (var i = 0; i < this.rows.length; i++) {
            //console.log(this.records[this.rows[i]].type);
            let form_control_item = new FormControl(this.records[this.rows[i]].value);
            form_control_item.clearValidators();
            this.records[this.rows[i]].required_boolean = false;
            this.records[this.rows[i]].hidden = false;
            if (this.records[this.rows[i]].active_in_topic != '0') {
                this.records[this.rows[i]].active_in_topic_array = this.records[this.rows[i]].active_in_topic.split(',');
            } else {
                this.records[this.rows[i]].active_in_topic_array = null;
            }

            if (this.records[this.rows[i]].required == 'on') {
                form_control_item.setValidators(forbiddenNullValue());
                this.records[this.rows[i]].required_boolean = true;
            }
            if (this.records[this.rows[i]].name == 'email') {
                form_control_item.setValidators(Validators.email);
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

            if (this.records[this.rows[i]].type == 'date') {
                //this.form.controls[this.rows[i]].patchValue();
                //console.log(this.records[this.rows[i]]);
                if (this.records[this.rows[i]].value_string != '') {
                    this.form.controls[this.rows[i]].patchValue(moment(this.records[this.rows[i]].value_string, "DD.MM.YYYY"));
                } else {
                    this.form.controls[this.rows[i]].patchValue(null);
                }
            }

            if (this.records[this.rows[i]].type == 'dttime') {
                this.form.controls[this.rows[i]].patchValue(this.records[this.rows[i]].value.slice(10, 16));
            }

            if (this.records[this.rows[i]].type == 'select_box') {
                this.init_select_box_options(this.records[this.rows[i]].name);
                if (this.records[this.rows[i]].value_string == '') {
                    this.form.controls[this.rows[i]].patchValue(null);
                }

            }


            if (this.records[this.rows[i]].type == 'checkbox') {
                if (this.records[this.rows[i]].value != 1) {
                    this.form.controls[this.rows[i]].patchValue(false);
                }
            }

            if (this.records[this.rows[i]].type == 'geodata') {
                this.init_geodata(this.records[this.rows[i]].name);
            }

            if (this.records[this.rows[i]].type == 'photo') {
                this.init_photo_image(this.records[this.rows[i]].name, this.records[this.rows[i]].value);
            }


            if (this.records[this.rows[i]].type == 'uploads') {
                this.init_gallery_images(this.records[this.rows[i]].name, this.records[this.rows[i]].value);
            }
        }
        this.apply_topic_activity();
    }

    init_geodata(columnName) {
        try {
            //console.log(parseFloat(this.records[columnName].value.lat));
            if (parseFloat(this.records[columnName].value.lat)) {
                this.lat = parseFloat(this.records[columnName].value.lat);
                this.lat_center = this.lat;
            } else {
                this.lat = '';
            }
            if (parseFloat(this.records[columnName].value.lng)) {
                this.lng = parseFloat(this.records[columnName].value.lng);
                this.lng_center = this.lng;
            } else {
                this.lng = '';
            }
        } catch {
        }
        
    }

    init_photo_image(field_name, image) {
        this.galleryImages[field_name] = [];
        var self = this;
        if (image != '') {
            let item = {
                small: self.api_url + '/img/data/user/' + image + '?' + new Date().getTime(),
                medium: self.api_url + '/img/data/user/' + image + '?' + new Date().getTime(),
                big: self.api_url + '/img/data/user/' + image + '?' + new Date().getTime()
            };
            this.galleryImages[field_name][0] = item;
        } else {
            this.galleryImages[field_name] = [];
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
        //console.log(this.galleryImages[field_name]);
    }

    init_select_box_options(columnName) {
        this.options_storage[columnName] = this.records[columnName].select_data_indexed;
        try {
            this.options_storage[columnName].forEach((row, index) => {
                row.id = row.id.toString();
                row.value = row.value.toString();
            });
        } catch {
        }
    }


    init_select_by_query_options(columnName) {
        this.modelSerivce.load_dictionary_model_all(this._data.get_table_name(), columnName)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    //console.log(result);
                    this.options_storage[columnName] = result.data;
                }

            });

    }

    getModel(): void {
        const primary_key = this._data.primary_key;
        const key_value = this._data.get_key_value();
        const model_name = this._data.get_table_name();
        //console.log(this.modelSerivce.entity);
        this.modelSerivce.entity.set_app_name(this._data.get_app_name());
        this.modelSerivce.entity.set_table_name(this._data.get_table_name());
        this.modelSerivce.entity.primary_key = primary_key;
        this.modelSerivce.entity.key_value = key_value;
        

        this.modelSerivce.loadById(model_name, primary_key, key_value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    if (result.state == 'error') {
                        this._snackService.message(result.message);
                        this.close();
                        return false;
                    } else {
                        //console.log(result);
                        this.records = result.data;
                        this.tabs = result.tabs;
                        this.tabs_keys = Object.keys(result.tabs);
                        this.rows = Object.keys(result.data);
                        //console.log(this.rows);
                        //console.log(this.tabs);
                        this.init_form();
                    }
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
                this.modelSerivce.delete(this._data.get_table_name(), this._data.primary_key, this._data.key_value)
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
        //console.log(this.form.controls);
        const ql_items = {};

        for (var i = 0; i < this.rows.length; i++) {
            //ql_items.push({ '123': 'test'});
            if (this.text_area_editor_storage[this.rows[i]]) {
                this.form.controls[this.rows[i]].patchValue(this.text_area_editor_storage[this.rows[i]]);
            } else if (this.records[this.rows[i]].type == 'checkbox' && this.form.controls[this.rows[i]].value == '') {
                this.form.controls[this.rows[i]].patchValue(null);
            } else if (this.records[this.rows[i]].type == 'dtdate') {
                console.log(this.form.controls[this.rows[i]].value);
            } else if (this.records[this.rows[i]].type == 'geodata') {
                this.form.controls[this.rows[i]].patchValue({ lat: this.lat, lng: this.lng });
            } else if (this.records[this.rows[i]].type == 'primary_key' && this.form.controls[this.rows[i]].value == 0) {
                this.form.controls[this.rows[i]].patchValue(this.modelSerivce.entity.key_value);
            }

            ql_items[this.rows[i]] = this.form.controls[this.rows[i]].value;
        }
        this.form_submitted = true;
        //console.log(this._data.key_value);

        if (!this.form.valid) {

            this._snackService.message('Проверьте поля формы, возможно некоторые заполнены неправильно');
            return null;
        }

        //console.log(ql_items);
        //return;

        if (this._data.key_value == null) {
            this.modelSerivce.native_insert(this._data.get_table_name(), ql_items)
                .subscribe((response: any) => {
                    //console.log(response);

                    if (response.state == 'error') {
                        this._snackService.message(response.message);
                        return null;
                    } else {
                        this._snackService.message('Запись создана успешно');
                        this.filterService.empty_share(this._data);
                        this.close();
                    }
                });
        } else {
            this.modelSerivce.native_update(this._data.get_table_name(), this._data.key_value, ql_items)
                .subscribe((response: any) => {
                    //console.log(response);

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


    }

    mapClick(event) {
        //console.log('map click');
        //console.log(event);
        if (event.coords) {
            this.lat = event.coords.lat;
            this.lng = event.coords.lng;
        } else {
            this.lat = event.lat;
            this.lng = event.lng;
        }
    }


    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close();
    }

}

