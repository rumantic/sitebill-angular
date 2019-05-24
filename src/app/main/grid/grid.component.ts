import {Component, ElementRef, Inject, ViewChild, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import {DOCUMENT} from '@angular/platform-browser';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { Subject } from 'rxjs';
import { FilterService } from 'app/_services/filter.service';
import { fuseAnimations } from '@fuse/animations';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material';
import { ModelService } from 'app/_services/model.service';
import { ViewModalComponent } from './view-modal/view-modal.component';
import { FormComponent } from './form/form.component';
import { Page } from './page';
import { SitebillEntity } from 'app/_models';
import { ConfirmComponent } from 'app/dialogs/confirm/confirm.component';
import { SnackService } from 'app/_services/snack.service';

import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import { FormControl } from '@angular/forms';
import { GalleryModalComponent } from '../gallery/modal/gallery-modal.component';
import { throttleTime } from 'rxjs/operators';
import * as moment from 'moment';
import { CommonTemplateComponent } from './common-template/common-template.component';
import { Router } from '@angular/router';
import { Bitrix24Service } from 'app/integrations/bitrix24/bitrix24.service';

registerLocaleData(localeRu, 'ru');

@Component({
    selector   : 'grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    animations: fuseAnimations
})
export class GridComponent implements OnInit, OnDestroy
{
    rows = [];
    ngxHeaderHeight: any;
    //item_model: any[];
    rows_my = [];
    rows_data = [];
    selected = [];
    loadingIndicator: boolean;
    loadGridComplete: boolean;
    reorderable: boolean;
    api_url: string;
    records: any[];
    columns = [];
    grid_meta = [];
    columns_index = [];
    rows_index = [];
    grid_columns_for_compose = [];
    data_columns = [];
    compose_complete: boolean = false;
    columns_client_all = [];
    columns_data_all = [];
    columns_client_my = [];
    rows1 = [];
    total_all: number;
    total_my: number;
    data_all: number;
    editing = {};
    options_test = {};
    test_indicator: string;
    objectKeys = Object.keys;
    page = new Page();
    entity: SitebillEntity;
    refresh_complete: boolean = false;
    searchInput: FormControl;
    error: boolean = false;
    error_message: string;

    date_range_enable: boolean = false;
    date_range_key: string;
    selected_date_filter;
    selected_date_filter_has_values: boolean = false;
    ranges: any = {
        'Сегодня': [moment(), moment()],
        'Вчера': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'За 7 дней': [moment().subtract(6, 'days'), moment()],
        'За 30 дней': [moment().subtract(29, 'days'), moment()],
        'Этот месяц': [moment().startOf('month'), moment().endOf('month')],
        'Прошлый месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    };
    date_range_locale = {
        format: 'DD.MM.YYYY',
        separator: ' - ', // default is ' - '
        cancelLabel: 'Отмена', // detault is 'Cancel'
        applyLabel: 'Применить', // detault is 'Apply'
        firstDay: 1 // first day is monday
    };



    confirmDialogRef: MatDialogRef<ConfirmComponent>;



    // Private
    protected _unsubscribeAll: Subject<any>;
    protected template_ready: boolean = false;
    protected predefined_grid_fields = [];
    protected predefined_grid_params = {};

    filterSharedData: any;

    private resizeSubject = new Subject<number>();
    private resizeObservable = this.resizeSubject.pipe(debounceTime(300), throttleTime(1000));

    @ViewChild(CommonTemplateComponent)
    public commonTemplate: CommonTemplateComponent;

    @Input("enable_collections")
    enable_collections: boolean;

    @Input("only_collections")
    only_collections: boolean;

    @Input("disable_menu")
    disable_menu: boolean;

    @Output() total_counterEvent = new EventEmitter<number>();



    /**
     * Constructor
     *
     */
    constructor(
        protected _httpClient: HttpClient,
        private elRef: ElementRef,
        @Inject(DOCUMENT) private document: any,
        protected dialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
        protected modelSerivce: ModelService,
        protected bitrix24Serivce: Bitrix24Service,
        protected _snackService: SnackService,
        private router: Router,
        @Inject(APP_CONFIG) private config: AppConfig,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private filterService: FilterService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this._unsubscribeAll = new Subject();
        this.ngxHeaderHeight = 48;
        this.entity = new SitebillEntity();
        //console.log('template loaded = ' + this.commonTemplate.template_loaded);

        this.page.pageNumber = 0;
        this.page.size = 0;
        this.searchInput = new FormControl('');


        this.api_url = this.modelSerivce.get_api_url();

    }
    ngOnInit() {
        if (this.disable_menu) {
            //console.log(this.disable_menu);
        } else {
            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: false
                    },
                    toolbar: {
                        hidden: false
                    },
                    footer: {
                        hidden: true
                    }
                }
            };
        }

        this.setup_apps();
        if (this.enable_collections) {
            this.entity.set_enable_collections();
        }
        this.rows = [];
        this.rows_my = [];
        //console.log('init');
        this.refresh();


        if (this.filterService.share_array[this.entity.get_app_name()] != null) {
            if (this.filterService.share_array[this.entity.get_app_name()]['concatenate_search'] != null) {
                this.searchInput = new FormControl(this.filterService.share_array[this.entity.get_app_name()]['concatenate_search']);
            }

            if (this.filterService.share_array[this.entity.get_app_name()][this.date_range_key] != null) {
                console.log(this.filterService.share_array[this.entity.get_app_name()][this.date_range_key].startDate);

                if (
                    this.filterService.share_array[this.entity.get_app_name()][this.date_range_key].startDate != null &&
                    this.filterService.share_array[this.entity.get_app_name()][this.date_range_key].endDate != null
                ) {
                    this.selected_date_filter = {};
                    this.selected_date_filter_has_values = true;
                    //console.log('set range from filterService');
                    //console.log(this.filterService.share_array[this.entity.app_name][this.date_range_key]);
                    //console.log(this.selected_date_filter);
                    //console.log(this.selected_date_filter.startDate);

                    //this.selected_date_filter['startDate'] = null;
                    //this.selected_date_filter['endDate'] = null;

                    this.selected_date_filter['startDate'] = this.filterService.share_array[this.entity.get_app_name()][this.date_range_key].startDate;
                    this.selected_date_filter['endDate'] = this.filterService.share_array[this.entity.get_app_name()][this.date_range_key].endDate;
                    //selected_date_filter: { startDate: Moment, endDate: Moment };
                }
            }
        }

        this.filterService.share.subscribe((entity: SitebillEntity) => {
            if (entity.get_app_name() == this.entity.get_app_name()) {
                if (this.refresh_complete) {
                    this.resizeSubject.next(0);
                    this.ngxHeaderHeight = "auto";
                }

            }
        });

        this.resizeObservable.subscribe(() => {

            //console.log('subscirbe');
            //console.log(entity);
            if (this.refresh_complete) {
                this.refresh_complete = false;
                this.refresh();
            }
        });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                //console.log(searchText);
                //console.log('search string share');
                this.filterService.share_data(this.entity, 'concatenate_search', searchText);
            });
    }

    refresh() {
        //console.log('refresh');
        //console.log(this.refresh_complete);
        //console.log(this.entity.app_name);
        //this.load_grid_data(this.app_name, [], []);
        //const params = { owner: true };
        //this.load_grid_data(this.app_name, [], params);
        //let f = this.debounce(this.setPage({ offset: this.page.pageNumber }), 1000);
        this.setPage({ offset: this.page.pageNumber });

        //this.debounce(this.setPage({ offset: this.page.pageNumber }), 1000);


    }



    init_input_parameters () {
        let app_root_element;
        if (this.document.getElementById('calculator_mini_root')) {
            app_root_element = this.document.getElementById('calculator_mini_root');
        } else if (this.document.getElementById('app_root').getAttribute('realty_price') > 0) {
            app_root_element = this.document.getElementById('app_root');
        }
    }



    setup_apps() {
        this.entity.set_app_name('client');
        this.entity.set_table_name('client');
        this.entity.primary_key = 'client_id';
    }

    init_grid(params) {
        let predefined_grid_fields = this.get_predefined_grid_fiels();
        if (predefined_grid_fields != null) {
            this.load_grid_data(this.entity.get_app_name(), predefined_grid_fields, params);
        } else {
            this.modelSerivce.load_grid_columns(this.entity)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    //console.log(result);
                    if (result.state == 'error' && result.error == 'check_session_key_failed') {
                        this.router.navigate(['/login']);
                        return false;
                    }
                    if (result.data['meta'] != null) {
                        if (result.data['meta']['per_page'] != null) {
                            this.page.size = result.data['meta']['per_page'];
                        }
                    }
                    this.load_grid_data(this.entity.get_app_name(), result.data['grid_fields'], params);
                },
                err => {
                  console.log(err);
                  this.router.navigate(['/login']);
                  return false;
                }
              );
        }
    }



    get_grid_items(params: any) {
        return this.entity.columns;
    }

    define_grid_fields(grid_fields: string[]) {
        if (grid_fields != null) {
            this.predefined_grid_fields = grid_fields;
        }
    }

    define_grid_params(params: any) {
        if (params != null) {
            this.predefined_grid_params = params;
        }
    }


    get_predefined_grid_fiels() {
        if (this.predefined_grid_fields.length > 0) {
            return this.predefined_grid_fields;
        }
        return null;
    }

    get_predefined_grid_params() {
        if (this.predefined_grid_params != null) {
            return this.predefined_grid_params;
        }
        return null;
    }

    load_grid_data(app_name, grid_columns: string[], params: any) {
        //console.log('load_grid_data');
        //console.log(grid_columns);
        //console.log(params);
        let filter_params_json = {};


        if (this.filterService.params_count[this.entity.get_app_name()] > 0) {
            var obj = this.filterService.share_array[this.entity.get_app_name()];
            var mapped = Object.keys(obj);
            mapped.forEach(function (item, i, arr) {
                //console.log(obj[item].length);
                if (obj[item] != null ) {
                    if (obj[item].length != 0) {
                        filter_params_json[item] = obj[item];
                    }
                }
            });
        }
        if (params != null) {
            Object.assign(filter_params_json, params);
        }
        if (this.enable_collections) {
            filter_params_json['load_collections'] = true;
            filter_params_json['collections_domain'] = this.bitrix24Serivce.get_domain();
            filter_params_json['collections_deal_id'] = this.bitrix24Serivce.get_deal_id();
            if (this.only_collections) {
                filter_params_json['only_collections'] = true;
            }
        }

        let page_number = this.page.pageNumber + 1;
        //console.log(filter_params_json);

        this.modelSerivce.load(this.entity.get_table_name(), grid_columns, filter_params_json, params.owner, page_number, this.page.size)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result_f1: any) => {
                //console.log(result_f1);
                if (result_f1.state == 'error') {
                    this.rise_error(result_f1.message);
                } else {
                    //this.item_model = result.rows[0];
                    this.entity.model = result_f1.columns;
                    //this.item_model = result.columns;
                    this.columns_index = result_f1.columns_index;
                    this.rows_index = result_f1.rows_index;
                    this.entity.default_columns_list = result_f1.default_columns_list;
                    this.entity.columns_index = result_f1.columns_index;
                    //console.log(this.item_model);
                    this.loadGridComplete = true;
                    this.page.totalElements = result_f1.total_count;
                    this.set_total_counter(result_f1.total_count);
                    this.filterService.share_counter(this.entity, 'total_count', result_f1.total_count);
                    this.page.size = result_f1.per_page;

                    if (this.get_predefined_grid_fiels() != null) {
                        this.grid_columns_for_compose = this.get_predefined_grid_fiels();
                    } else if (result_f1.grid_columns.grid_fields != null) {
                        this.grid_columns_for_compose = result_f1.grid_columns.grid_fields;
                    } else {
                        this.grid_columns_for_compose = result_f1.default_columns_list;
                    }
                    //console.log(this.grid_columns_for_compose);

                    this.grid_meta = result_f1.grid_columns.meta;
                    let model_compose = this.entity.model;
                    this.compose_columns(this.grid_columns_for_compose, model_compose);

                    //console.log(this.item_model);
                    this.rows_data = result_f1.rows;
                    this.data_all = result_f1.rows.length;

                    //this.init_selected_rows(this.rows, selected);
                    this.loadingIndicator = false;
                }
                this.refresh_complete = true;
            });

    }

    set_total_counter(counter: number) {
        this.total_counterEvent.next(counter);
    }


    rise_error(message: string) {
        this.error = true;
        this.error_message = message;
    }

    get_control_column() {
        let control_column = {
            headerTemplate: this.commonTemplate.controlHdrTmpl,
            cellTemplate: this.commonTemplate.controlTmpl,
            width: 40,
            type: 'primary_key',
            ngx_name: this.entity.primary_key + '.title',
            model_name: this.entity.primary_key,
            title: '',
            prop: this.entity.primary_key + '.value'
        }
        return control_column;

    }

    compose_columns(columns_list, model) {
        //console.log('compose columns');
        //console.log(model);
        //console.log(model.length);
        //console.log(model[0]);
        //console.log(columns_list);
        //console.log(this.columns_index);

        if (this.compose_complete) {
            //return;
        }
        //проходим по columns_list
        //для каждой вытягиваем из model информацию и добавляем в объект КОЛОНКИ
        this.data_columns = [];

        //this.entity.add_column(model[this.columns_index[this.entity.primary_key]].name);

        this.data_columns.push(this.get_control_column());

        columns_list.forEach((row, index) => {
            if (this.columns_index[row] == null) {
                return;
            }
            this.entity.add_column(model[this.columns_index[row]].name);
            let cellTemplate = null;
            let prop = '';
            let width = 150;
            prop = model[this.columns_index[row]].name + '.value';
            if (this.grid_meta != null) {
                if (this.grid_meta['columns'] != null) {
                    if (this.grid_meta['columns'][model[this.columns_index[row]].name] != null) {
                        width = this.grid_meta['columns'][model[this.columns_index[row]].name].width;
                        //console.log(model[this.columns_index[row]].name);
                        //console.log(width);
                    }
                }
            }

            switch (model[this.columns_index[row]].type) {
                case 'safe_string':
                case 'textarea':
                case 'textarea_editor':
                    //console.log(model[this.columns_index[row]].name);
                    cellTemplate = this.commonTemplate.textTmpl;
                    break;

                case 'dttime':
                    cellTemplate = this.commonTemplate.dttimeTmpl;
                    break;

                case 'dtdatetime':
                    cellTemplate = this.commonTemplate.dtdatetimeTmpl;
                    break;

                case 'dtdate':
                    cellTemplate = this.commonTemplate.dtdateTmpl;
                    break;

                case 'geodata':
                    cellTemplate = this.commonTemplate.geoTmpl;
                    prop = model[this.columns_index[row]].name + '.value_string';
                    break;

                case 'checkbox':
                    cellTemplate = this.commonTemplate.checkboxTmpl;
                    break;

                case 'photo':
                    cellTemplate = this.commonTemplate.photoTmpl;
                    break;

                case 'uploads':
                    cellTemplate = this.commonTemplate.imageTmpl;
                    break;
                default:
                    cellTemplate = null;
                    prop = model[this.columns_index[row]].name + '.value_string';

            }

            let column = {
                headerTemplate: this.get_header_template(),
                cellTemplate: cellTemplate,
                type: model[this.columns_index[row]].type,
                ngx_name: model[this.columns_index[row]].name + '.title',
                model_name: model[this.columns_index[row]].name,
                title: model[this.columns_index[row]].title,
                width: width,
                prop: prop
            }
            this.data_columns.push(column);
        });
        this.compose_complete = true;
        //console.log(this.data_columns);

    }

    get_header_template() {
        return this.commonTemplate.hdrTpl;
    }


    clear_search_text() {
        this.searchInput.patchValue('');
    }

    date_range_change(event, column_name) {
        if (event.startDate != null && event.endDate != null) {
            this.selected_date_filter_has_values = true;
            this.filterService.share_data(this.entity, column_name, event);
        }
    }
    clear_selected_date_filter(column_name) {
        this.selected_date_filter_has_values = false;
        const event = null;
        this.selected_date_filter = null;
        this.filterService.share_data(this.entity, column_name, event);
    }

    enable_date_range(key) {
        this.date_range_enable = true;
        this.date_range_key = key;
    }

    delete(item_id: any) {
        this.confirmDialogRef = this.dialog.open(ConfirmComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить запись?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.modelSerivce.delete(this.entity.get_table_name(), this.entity.primary_key, item_id)
                    .subscribe((response: any) => {
                        console.log(response);

                        if (response.state == 'error') {
                            this._snackService.message(response.message);
                            return null;
                        } else {
                            this._snackService.message('Запись удалена успешно');
                            this.filterService.empty_share(this.entity);
                        }
                    });
            }
            this.confirmDialogRef = null;
        });
    }

    edit_form(item_id: any) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        //dialogConfig.data = { app_name: this.entity.get_table_name(), primary_key: this.entity.primary_key, key_value: item_id };
        this.entity.set_key_value(item_id);
        if (this.only_collections) {
            this.entity.set_hook('add_to_collections');
        }
        dialogConfig.data = this.entity;
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';

        this.dialog.open(FormComponent, dialogConfig);
    }


    view(item_id: any) {
        //console.log('view');
        //console.log(item_id);
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        //dialogConfig.data = { app_name: this.entity.get_table_name(), primary_key: this.entity.primary_key, key_value: item_id };
        this.entity.set_key_value(item_id);
        dialogConfig.data = this.entity;
        console.log(dialogConfig.data);
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';

        this.dialog.open(ViewModalComponent, dialogConfig);
    }

    view_gallery(event) {
        let row = event.row;
        let column = event.column;
        let images = event.images;
        if (column.type == 'photo' && !Array.isArray(images) && images != '') {
            let tmp_images = [];

            let item = {
                normal: 'user/' + images,
                preview: 'user/' + images,
            };
            tmp_images[0] = item;
            images = tmp_images;
        }

        this.entity.set_key_value(row[this.entity.primary_key].value);

        let image_field = column.model_name;
        let galleryImages = {};
        galleryImages[image_field] = {};
        var self = this;
        if (images) {
            galleryImages[image_field] = images.map(function (image: any) {

                return {
                    small: self.api_url + '/img/data/' + image.preview + '?' + new Date().getTime(),
                    medium: self.api_url + '/img/data/' + image.normal + '?' + new Date().getTime(),
                    big: self.api_url + '/img/data/' + image.normal + '?' + new Date().getTime()
                };
            });
        } else {
            galleryImages[image_field] = [];
        }


        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = { entity: this.entity, galleryImages: galleryImages, image_field: image_field };
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';

        this.dialog.open(GalleryModalComponent, dialogConfig);

    }

    toggle_active(event) {
        let row = event.row;
        let value = event.value;
        let ql_items = {};
        if (row.active.value == 0) {
            ql_items['active'] = 1;
        } else {
            ql_items['active'] = null;
        }

        this.modelSerivce.update_only_ql(this.entity.get_table_name(), value, ql_items)
            .subscribe((response: any) => {
                if (response.state == 'error') {
                    this._snackService.message(response.message);
                } else {
                    this.refresh();
                }
            });

    }

    toggle_collection(event) {
        //console.log(event);
        //console.log('get_placement_options_id = ' + this.bitrix24Serivce.get_placement_options_id());
        let data_id = event.value;
        let title = 'bitrix deal ' + this.bitrix24Serivce.get_deal_id();
        this.modelSerivce.toggle_collections(this.bitrix24Serivce.get_domain(), this.bitrix24Serivce.get_deal_id(), title, data_id)
            .subscribe((response: any) => {
                console.log(response);
                if (response.state == 'error') {
                    this._snackService.message(response.message);
                } else {
                    this.refresh();
                }
            });
    }



    /**
       * Populate the table with new data based on the page number
       * @param page The page to select
       */
    setPage(pageInfo) {
        //console.log('setPage');
        this.page.pageNumber = pageInfo.offset;
        //const params = { owner: true };
        let params = {};
        if (this.get_predefined_grid_params() != null) {
            params = this.get_predefined_grid_params();
        }

        this.init_grid(params);
    }

    onResize(event) {
        const params = { width: event.newValue };
        //console.log(event);

        this.modelSerivce.update_column_meta(this.entity.get_table_name(), event.column.model_name, 'columns', params)
            .subscribe((response: any) => {
                //console.log(response);
            });

    }



    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        //this.resizeObservable.next(0);
        this.resizeSubject.complete();
    }



    init_selected_rows(rows, selected) {
        if (selected.length == 0) {
            return;
        }
        for (let entry of selected) {
            rows.forEach((row, index) => {
                if (row.id.value == entry.id.value) {
                    this.selected.push(rows[index]);
                }
            });
        }
    }

    getRowClass(row): string {
        try {
            if (row.active.value != 1) {
                return 'red-100-bg';
            }
            if (row.hot.value == 1) {
                return 'amber-100-bg';
            }
        } catch {
        }
    }


    onActivate() {
    }



    onSelect({ selected }) {
        console.log('Select Event', selected);

    }
}
