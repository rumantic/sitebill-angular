import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ModelService} from '../../../_services/model.service';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {SnackService} from '../../../_services/snack.service';
import {takeUntil} from 'rxjs/operators';
import {FormType, SitebillEntity} from '../../../_models';
import {Subject} from 'rxjs';
import * as moment from 'moment';
import {ConfirmComponent} from '../../../dialogs/confirm/confirm.component';
import {FilterService} from '../../../_services/filter.service';
import {Bitrix24Service} from '../../../integrations/bitrix24/bitrix24.service';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';

export function forbiddenNullValue(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return control.value == null || control.value == 0 ? {'forbiddenNullValue': {value: control.value}} : null;
    };
}

@Component({
    selector: 'form-selector',
    templateUrl: './form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./form.component.css']
})
export class FormConstructorComponent implements OnInit {
    form: FormGroup;
    public _data: SitebillEntity;
    protected _unsubscribeAll: Subject<any>;

    public text_area_editor_storage = {};
    public options_storage = {};
    form_submitted: boolean = false;
    form_inited: boolean = false;
    rows: any[];
    tabs: any[];
    tabs_keys: any[];
    records: any[];
    api_url: string;
    render_value_string_array = ['empty', 'select_box', 'select_by_query', 'select_box_structure', 'date'];
    render_value_array = ['empty', 'textarea_editor', 'safe_string', 'textarea', 'primary_key'];
    square_options: any[] = [{id: 1, value: 'range', actual: 1}];
    galleryImages = {};
    latitude: any;
    longitude: any;
    lat: any;
    lng: any;
    lat_center: any;
    lng_center: any;
    form_title: string;


    loadingIndicator: boolean;
    confirmDialogRef: MatDialogRef<ConfirmComponent>;

    disable_delete: boolean;
    disable_form_title_bar: boolean;

    quillConfig = {
        toolbar: {
            container:
                [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{'header': 1}, {'header': 2}],               // custom button values
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                    [{'direction': 'rtl'}],                         // text direction

                    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                    [{'header': [1, 2, 3, 4, 5, 6, false]}],

                    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                    [{'font': []}],
                    [{'align': []}],

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
                        [{'placeholder': ['[GuestName]', '[HotelName]']}], // my custom dropdown
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],

                        [{'header': 1}, {'header': 2}],               // custom button values
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                        [{'direction': 'rtl'}],                         // text direction

                        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                        [{'header': [1, 2, 3, 4, 5, 6, false]}],

                        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                        [{'font': []}],
                        [{'align': []}],

                        ['clean']                                    // remove formatting button

                    ],
                handlers: {
                    'placeholder': function (value) {
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


    constructor (
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
        protected _snackService: SnackService,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        public _matDialog: MatDialog,
        protected cdr: ChangeDetectorRef
    ) {
        this._unsubscribeAll = new Subject();
        this.loadingIndicator = true;

        // Set the private defaults
        this.api_url = this.modelService.get_api_url();
        this.lat_center = 55.76;
        this.lng_center = 37.64;
    }

    ngOnInit() {
        // Reactive Form
        this.form = this._formBuilder.group({});
        this._data.set_readonly(false);
        this.getModel();

    }

    getModel(): void {
        const primary_key = this._data.primary_key;
        const key_value = this._data.get_key_value();
        const model_name = this._data.get_table_name();
        //console.log(this.modelService.entity);
        this.modelService.entity.set_app_name(this._data.get_app_name());
        this.modelService.entity.set_table_name(this._data.get_table_name());
        this.modelService.entity.primary_key = primary_key;
        this.modelService.entity.key_value = key_value;


        this.modelService.loadById(model_name, primary_key, key_value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    if (result.state == 'error') {
                        this._snackService.message(result.message);
                        this.close();
                        return false;
                    } else {
                        // console.log(result);
                        this.records = result.data;
                        this.tabs = result.tabs;
                        this.tabs_keys = Object.keys(result.tabs);
                        this.rows = Object.keys(result.data);
                        //console.log(this.rows);
                        //console.log(this.tabs);
                        this.init_form();
                    }
                    this.cdr.markForCheck();
                }

            });
    }

    init_form() {
        //console.log(this.records);

        //Сначала нужно получить значение topic_id
        //В цикле, есть есть совпадения с active_in_topic, тогда применяем правила ОБЯЗАТЕЛЬНОСТИ
        //При смене типа в форме, надо перезапускать процесс показа/валидации элементов

        for (var i = 0; i < this.rows.length; i++) {
            //console.log(this.records[this.rows[i]].type);
            let form_control_item = new FormControl(this.records[this.rows[i]].value);
            form_control_item.clearValidators();
            this.records[this.rows[i]].required_boolean = false;
            if ( this._data.get_hidden_column_edit(this.rows[i]) ) {
                this.records[this.rows[i]].hidden = true;
            } else {
                this.records[this.rows[i]].hidden = false;
            }
            if (this.records[this.rows[i]].active_in_topic != '0' && this.records[this.rows[i]].active_in_topic != null) {
                this.records[this.rows[i]].active_in_topic_array = this.records[this.rows[i]].active_in_topic.split(',');
            } else {
                this.records[this.rows[i]].active_in_topic_array = null;
            }

            if (this.records[this.rows[i]].required == 'on') {
                if (!this.records[this.rows[i]].hidden) {
                    form_control_item.setValidators(forbiddenNullValue());
                    this.records[this.rows[i]].required_boolean = true;
                }
            }
            if (this.records[this.rows[i]].name == 'email') {
                form_control_item.setValidators(Validators.email);
            }
            //console.log(this.rows[i]);
            //console.log(form_control_item);

            this.form.addControl(this.rows[i], form_control_item);

            if (this.is_date_type(this.records[this.rows[i]].type) && this.records[this.rows[i]].value == 'now') {
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
                if (this.records[this.rows[i]].value_string != '' && this.records[this.rows[i]].value_string != null) {
                    this.form.controls[this.rows[i]].patchValue(moment(this.records[this.rows[i]].value_string, 'DD.MM.YYYY'));
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

            if (this.records[this.rows[i]].parameters != null) {
                if (this.records[this.rows[i]].parameters.dadata == 1) {
                    this.hide_dadata(this.rows[i]);
                }

            }
        }


        this.apply_topic_activity();
        this.form_inited = true;
        this.after_form_inted();
        //console.log(this.records);

    }

    hide_dadata(row) {
        this.records[row].hidden = true;
        this.records[row].type = 'hidden';
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
                if (image.remote === 'true') {
                    return {
                        small: image.preview + '?' + new Date().getTime(),
                        medium: image.normal + '?' + new Date().getTime(),
                        big: image.normal + '?' + new Date().getTime()
                    };
                } else {
                    return {
                        small: self.api_url + '/img/data/' + image.preview + '?' + new Date().getTime(),
                        medium: self.api_url + '/img/data/' + image.normal + '?' + new Date().getTime(),
                        big: self.api_url + '/img/data/' + image.normal + '?' + new Date().getTime()
                    };
                }
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
        // console.log(this._data.get_default_params());
        this.modelService.load_dictionary_model_with_params(this._data.get_table_name(), columnName, this.get_ql_items_from_form(), true)
        // this.modelService.load_dictionary_model_all(this._data.get_table_name(), columnName)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    // console.log(result);
                    this.options_storage[columnName] = result.data;
                    this.cdr.markForCheck();
                }

            });

    }
    is_date_type(type: string) {
        if (type == 'dtdatetime' || type == 'dtdate' || type == 'dttime' || type == 'date') {
            return true;
        }
        return false;
    }

    apply_topic_activity() {
        let current_topic_id = 0;
        if (this.form.controls['topic_id'] != null) {
            if ( this.form.controls['topic_id'].value != null ) {
                current_topic_id = this.form.controls['topic_id'].value;
            }
        }

        if (current_topic_id != null) {
            for (var i = 0; i < this.rows.length; i++) {
                if (this.records[this.rows[i]].active_in_topic != '0' && this.records[this.rows[i]].active_in_topic != null) {
                    if (this.records[this.rows[i]].active_in_topic_array.indexOf(current_topic_id) == -1) {
                        this.form.get(this.rows[i]).clearValidators();
                        this.form.get(this.rows[i]).updateValueAndValidity();
                        this.records[this.rows[i]].required_boolean = false;
                        this.records[this.rows[i]].hidden = true;
                    } else {
                        this.records[this.rows[i]].hidden = false;
                        if (this.records[this.rows[i]].required == 'on') {
                            this.records[this.rows[i]].required_boolean = true;
                            this.form.get(this.rows[i]).setValidators(forbiddenNullValue());
                            this.form.get(this.rows[i]).updateValueAndValidity();
                        }
                    }
                }
                if (this.records[this.rows[i]].parameters != null) {
                    if (this.records[this.rows[i]].parameters.dadata == 1) {
                        this.hide_dadata(this.rows[i]);
                    }
                }
                if (this.records[this.rows[i]].type === 'compose') {
                    this.hide_dadata(this.rows[i]);
                }

            }
        }
    }
    after_form_inted() {
        this.form_title = this.get_title();
        this.cdr.markForCheck();
    }

    get_title() {
        //@todo нужно будет сделать генератор заголовков для всхе сущностей (не только data)
        let title_items = ['topic_id', 'city_id', 'district_id', 'street_id', 'number', 'price'];
        let final_title_items = [];
        let final_title = '';
        let title_length = 60;

        title_items.forEach((row, index) => {
            if (this.records[row] != null) {
                if (this.records[row].value_string != '' && this.records[row].value_string != null) {
                    final_title_items.push(this.records[row].value_string);
                } else if (this.records[row].value != 0) {
                    final_title_items.push(this.records[row].value);
                }
            }
        });
        final_title = final_title_items.join(', ');
        if (final_title.length > title_length) {
            final_title = final_title.substr(0, title_length) + '...';
        }


        return final_title;
    }

    delete() {
        this.confirmDialogRef = this._matDialog.open(ConfirmComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить запись?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.modelService.delete(this._data.get_table_name(), this._data.primary_key, this._data.key_value)
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
        this.form_submitted = true;

        if (!this.form.valid) {
            const required_fields = [];
            this.rows.forEach((row) => {
                const control = this.form.controls[row];
                if ( control.status === 'INVALID' ) {
                    required_fields.push(this.records[row].title);
                }
            });
            this._snackService.message('Проверьте поля формы, возможно некоторые заполнены неправильно: ' + required_fields.join(', '));
            return;
        }

        let ql_items = {};
        ql_items = this.get_ql_items_from_form();


        if (this._data.key_value == null) {
            this.modelService.native_insert(this._data.get_table_name(), ql_items)
                .subscribe((response: any) => {
                    if (response.state === 'error') {
                        this._snackService.message(response.message);
                        return null;
                    } else {
                        this._snackService.message('Запись создана успешно');
                        if (this._data.get_hook() === 'add_to_collections') {
                            this.add_to_collections(response.data['new_record_id'], response.data['items']);
                        } else {
                            this.filterService.empty_share(this._data);
                            this.close();
                        }
                    }
                });
        } else {
            this.modelService.native_update(this._data.get_table_name(), this._data.key_value, ql_items)
                .subscribe((response: any) => {
                    if (response.state === 'error') {
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

    get_ql_items_from_form () {
        const ql_items = {};
        const now = moment();


        this.rows.forEach((row) => {
            const type = this.records[row].type;
            const control = this.form.controls[row];
            if ( control !== undefined && control !== null) {
                if (this.text_area_editor_storage[row]) {
                    ql_items[row] = this.text_area_editor_storage[row];
                } else if (type === 'checkbox' && !control.value) {
                    ql_items[row] = null;
                } else if (type === 'date' && moment.isMoment(control.value)) {
                    ql_items[row] = control.value.format('DD.MM.YYYY');
                } else if (type === 'dtdatetime' && moment.isMoment(control.value)) {
                    ql_items[row] = control.value.set({
                        hour: now.get('hour'),
                        minute: now.get('minute'),
                        second: now.get('second'),
                    }).toISOString(true);
                } else if (type === 'dtdate') {
                    console.log(control.value);
                } else if (type === 'geodata') {
                    ql_items[row] = {lat: this.lat, lng: this.lng};
                } else if (type === 'primary_key' && control.value === 0) {
                    ql_items[row] = this.modelService.entity.key_value;
                } else {
                    ql_items[row] = control.value;
                }
            }
        });
        return ql_items;
    }

    add_to_collections(data_id, items) {
        let title = 'bitrix deal ' + this.bitrix24Service.get_entity_id();
        this.modelService.toggle_collections(this.bitrix24Service.get_domain(), this.bitrix24Service.get_entity_id(), title, data_id)
            .subscribe((response: any) => {
                if (response.state == 'error') {
                    this._snackService.message(response.message);
                } else {
                    this.bitrix24Service.comment_add(data_id, items, 'add');
                    this.filterService.empty_share(this._data);
                    this.close();
                }
            });
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



    OnDestroy () {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    valid_link (value) {
        if ( value !== null ) {
            const reg = '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
            return !!value.match(reg);
        }
        return false;
    }

    get_flex_width ( size:string, form_type:string, record ) {
        if ( record.type == 'hidden' || record.hidden == true ) {
            return 0;
        }
        var width_100: Array<string> = ['uploads', 'textarea', 'textarea_editor', 'injector'];
        if ( width_100.indexOf(record.type) > -1 ) {
            return 100;
        }
        if ( form_type == FormType.inline ) {
            return 100;
        }
        if ( size == 'xl' ) {
            return 20;
        }
        if ( size == 'md' ) {
            return 50;
        }
        if ( size == 'xs' ) {
            return 100;
        }

        return 33;
    }
    get_flex_padding ( size:string, form_type:string, record ) {
        if ( record.type == 'hidden' || record.hidden == true ) {
            return '';
        }
        return 'p-12';
    }
    get_appearance() {
        // outline,standard,fill,legacy
        return 'outline';
    }
}
