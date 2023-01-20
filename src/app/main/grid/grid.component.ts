import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import {DOCUMENT, registerLocaleData} from '@angular/common';
import {APP_CONFIG, AppConfig} from 'app/app.config.module';

import {FuseTranslationLoaderService} from '@fuse/services/translation-loader.service';

import {locale as english} from './i18n/en';
import {locale as russian} from './i18n/ru';
import {Subject} from 'rxjs';
import {FilterService} from 'app/_services/filter.service';
import {fuseAnimations} from '@fuse/animations';
import {debounceTime, distinctUntilChanged, takeUntil, throttleTime} from 'rxjs/operators';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {ModelService} from 'app/_services/model.service';
import {ViewModalComponent} from './view-modal/view-modal.component';
import {FormComponent} from './form/form.component';
import {Page} from './page';
import {SitebillEntity, SitebillModelItem} from 'app/_models';
import {ConfirmComponent} from 'app/dialogs/confirm/confirm.component';
import {SnackService} from 'app/_services/snack.service';

import localeRu from '@angular/common/locales/ru';
import {FormControl} from '@angular/forms';
import {GalleryModalComponent} from '../gallery/modal/gallery-modal.component';
import * as moment from 'moment';
import {CommonTemplateComponent} from './common-template/common-template.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Bitrix24Service} from 'app/integrations/bitrix24/bitrix24.service';
import {BillingService} from '../../_services/billing.service';
import {ReportComponent} from "../../dialogs/report/report.component";
import *  as localization from 'moment/locale/ru';
import {LocaleConfig} from "ngx-daterangepicker-material";
import {SaveSearchComponent} from "../../dialogs/save-search/save-search.component";
import {LoginModalComponent} from "../../login/modal/login-modal.component";
import {StringParserService} from "../../_services/string-parser.service";
import {ShareModalComponent} from "./share-modal/share-modal.component";
import {CollectionModalComponent} from "./collection-modal/collection-modal.component";
import {CoworkerModalComponent} from "./coworker-modal/coworker-modal.component";
import {BuildingBlocksModalComponent} from "./building-blocks-modal/building-blocks-modal.component";
import {TestimonialsModalComponent} from "./testimonials-modal/testimonials-modal.component";
import {GridSettingsSidenavComponent} from "./sidenavs/settings/settings.component";
import {ExcelModalComponent} from "../apps/excel/modal/excel-modal.component";
import {WhatsappModalComponent} from "../apps/whatsapp/whatsapp-modal/whatsapp-modal.component";
import {WhatsAppService} from "../apps/whatsapp/whatsapp.service";
import {ReportType, SendCallbackBundle} from "../apps/whatsapp/types/whatsapp.types";
import {ReportModalComponent} from "../apps/whatsapp/report-modal/report-modal.component";

registerLocaleData(localeRu, 'ru');

moment.locale('ru', localization);

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
    rows_my = [];
    rows_data = [];
    selected: SitebillModelItem[] = [];
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
    selectionType = '';
    grouped: any;
    footerHeight: number;


    @ViewChild('gridTable') table: any;


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
    date_range_locale: LocaleConfig = {
        format: 'DD.MM.YYYY',
        separator: ' - ', // default is ' - '
        cancelLabel: 'Отмена', // detault is 'Cancel'
        applyLabel: 'Применить', // detault is 'Apply'
        firstDay: 1, // first day is monday
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.months()
    };



    confirmDialogRef: MatDialogRef<ConfirmComponent>;
    reportDialogRef: MatDialogRef<ReportComponent>;
    saveSearchDialogRef: MatDialogRef<SaveSearchComponent>;



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

    @Input('enable_collections')
    enable_collections: boolean;

    @Input('only_collections')
    only_collections: boolean;

    @Input('memorylist_id')
    memorylist_id: number;

    @Input('disable_menu')
    disable_menu: boolean;

    @Input('disable_add_button')
    disable_add_button: boolean;

    @Input('disable_header')
    disable_header: boolean;

    @Input('disable_wild_search')
    disable_wild_search: boolean;

    @Input('disable_view_button')
    disable_view_button: boolean;

    @Input('enable_coworker_button')
    enable_coworker_button: boolean;

    @Input('enable_testimonials_button')
    enable_testimonials_button: boolean;


    @Input('enable_building_blocks_button')
    enable_building_blocks_button: boolean;

    @Input('disable_edit_button')
    disable_edit_button: boolean;

    @Input('disable_delete_button')
    disable_delete_button: boolean;

    @Input('disable_refresh_button')
    disable_refresh_button: boolean;

    @Input('disable_activation_button')
    disable_activation_button: boolean;

    @Input('disable_gallery_controls')
    disable_gallery_controls: boolean;

    @Input('freeze_default_columns_list')
    freeze_default_columns_list = false;

    @Input('input_entity')
    input_entity: SitebillEntity;

    @Input('enable_select_rows')
    enable_select_rows = true;

    @Input('complaint_mode')
    complaint_mode = false;

    @Input('disable_fix_table_height')
    disable_fix_table_height = false;

    @Output() total_counterEvent = new EventEmitter<number>();

    private after_compose_complete_checked: boolean;
    private params_filter: string;
    public enable_grouping: boolean;
    public group_key: string;
    public scrollbarH: boolean = true;



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
        public modelService: ModelService,
        protected billingService: BillingService,
        protected bitrix24Service: Bitrix24Service,
        protected _snackService: SnackService,
        private router: Router,
        protected route: ActivatedRoute,
        @Inject(APP_CONFIG) private config: AppConfig,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        protected cdr: ChangeDetectorRef,
        public filterService: FilterService,
        protected stringParserService: StringParserService,
        protected whatsAppService: WhatsAppService,
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this._unsubscribeAll = new Subject();
        this.ngxHeaderHeight = 54;
        this.entity = new SitebillEntity();
        //console.log('template loaded = ' + this.commonTemplate.template_loaded);

        this.page.pageNumber = 0;
        this.page.size = 0;
        this.searchInput = new FormControl('');
        this.disable_wild_search = false;


        this.api_url = this.modelService.get_api_url();
        this.compose_complete = false;
        this.after_compose_complete_checked = false;
        this.loadingIndicator = true;
    }

    initFooterHeight () {
        if ( window.innerWidth < 959 ) {
            this.footerHeight = 100;
        } else {
            this.footerHeight = 50;
        }
    }

    ngOnInit() {
        this.initFooterHeight();
        this.entity.set_app_url(null);
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
        this.configure_buttons();

        if (this.enable_collections) {
            this.entity.set_enable_collections();
        }
        if ( this.enable_select_rows ) {
            this.selectionType = 'checkbox';
        }
        this.rows = [];
        this.rows_my = [];
        //console.log('init');
        this.params_filter = this.route.snapshot.paramMap.get('params_filter');

        if ( this.modelService.getConfigValue('apps.realty.data.global_freeze_default_columns_list') === '1' ) {
            this.freeze_default_columns_list = true;
        }

        if ( this.modelService.getConfigValue('apps.realty.data.global_disable_refresh_button') === '1' ) {
            this.disable_refresh_button = true;
        }


        this.refresh();


        if (this.filterService.get_share_array(this.entity.get_app_name()) != null) {
            if (this.filterService.get_share_array(this.entity.get_app_name())['concatenate_search'] != null) {
                this.searchInput = new FormControl(this.filterService.get_share_array(this.entity.get_app_name())['concatenate_search']);
            }

            if (this.filterService.get_share_array(this.entity.get_app_name())[this.date_range_key] != null) {
                // console.log(this.filterService.get_share_array(this.entity.get_app_name())[this.date_range_key].startDate);

                if (
                    this.filterService.get_share_array(this.entity.get_app_name())[this.date_range_key].startDate != null &&
                    this.filterService.get_share_array(this.entity.get_app_name())[this.date_range_key].endDate != null
                ) {
                    this.selected_date_filter = {};
                    this.selected_date_filter_has_values = true;
                    //console.log('set range from filterService');
                    //console.log(this.filterService.share_array[this.entity.app_name][this.date_range_key]);
                    //console.log(this.selected_date_filter);
                    //console.log(this.selected_date_filter.startDate);

                    //this.selected_date_filter['startDate'] = null;
                    //this.selected_date_filter['endDate'] = null;

                    this.selected_date_filter['startDate'] = moment(this.filterService.get_share_array(this.entity.get_app_name())[this.date_range_key].startDate);
                    this.selected_date_filter['endDate'] = moment(this.filterService.get_share_array(this.entity.get_app_name())[this.date_range_key].endDate);
                    //selected_date_filter: { startDate: Moment, endDate: Moment };
                }
            }
        }

        this.filterService.share
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((entity: SitebillEntity) => {
            if (entity.get_app_name() == this.entity.get_app_name()) {
                if (this.refresh_complete) {
                    this.resizeSubject.next(0);
                    this.ngxHeaderHeight = "auto";
                }

            }
        });

        this._fuseConfigService.broadcast
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
            this.refresh();
        });


        this.resizeObservable
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

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
        // this.cdr.markForCheck();

    }


    ngAfterViewChecked() {
        /*
        if ( this.compose_complete ) {
            if ( !this.after_compose_complete_checked ) {
                setTimeout(() => {
                    this.cdr.markForCheck();
                }, 100);
                this.after_compose_complete_checked = true;
            }
        }
         */
    }

    refresh() {
        //console.log('refresh');
        //console.log(this.refresh_complete);
        //console.log(this.entity.app_name);
        //this.load_grid_data(this.app_name, [], []);
        //const params = { owner: true };
        //this.load_grid_data(this.app_name, [], params);
        //let f = this.debounce(this.setPage({ offset: this.page.pageNumber }), 1000);
        this.modelService.set_current_entity(this.entity);
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
        if ( this.input_entity ) {
            this.entity = this.input_entity;
        } else {
            this.entity.set_app_name('client');
            this.entity.set_table_name('client');
            this.entity.primary_key = 'client_id';
            this.enable_coworker_button = true;
        }
    }

    init_grid(params) {
        //console.log('init grid');
        //console.log(params);
        let predefined_grid_fields = this.get_predefined_grid_fiels();
        if (predefined_grid_fields != null) {
            this.load_grid_data(this.entity.get_app_name(), predefined_grid_fields, params);
        } else {
            this.modelService.load_grid_columns(this.entity)
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

    get_filter_params () {
        let filter_params_json = {};
        let concatenate_search_string = null;


        if (this.filterService.get_params_count(this.entity.get_app_name()) > 0) {
            // console.log('grid app name has share array');
            // console.log(this.entity.get_app_name());
            // console.log(this.filterService.share_array[this.entity.get_app_name()]);

            var obj = this.filterService.get_share_array(this.entity.get_app_name());
            var mapped = Object.keys(obj);
            // console.log(mapped);
            var self = this;

            mapped.forEach(function (item, i, arr) {
                if (
                    self.modelService.getConfigValue('apps.realty.search_string_parser.enable') === '1' &&
                    item === 'concatenate_search' &&
                    self.entity.get_app_name() === 'data'
                ) {
                    concatenate_search_string = obj[item];
                } else {
                    //console.log(obj[item].length);
                    //console.log(typeof obj[item]);
                    if (obj[item] != null ) {
                        if (obj[item].length != 0) {
                            filter_params_json[item] = obj[item];
                        } else if (typeof obj[item] === 'object' && obj[item].length != 0) {
                            filter_params_json[item] = obj[item];
                        }
                    }
                }
            });
        }

        if (this.enable_collections) {
            filter_params_json['load_collections'] = true;
            filter_params_json['collections_domain'] = this.bitrix24Service.get_domain();
            filter_params_json['collections_deal_id'] = this.bitrix24Service.get_entity_id();
            if (this.only_collections) {
                filter_params_json['only_collections'] = true;
                if ( this.memorylist_id ) {
                    filter_params_json['memorylist_id'] = this.memorylist_id;
                }
            }
        }
        filter_params_json = this.extended_params(filter_params_json);
        if ( concatenate_search_string !== null ) {
            filter_params_json = {...filter_params_json, ...self.parse_params_from_string(concatenate_search_string)};
        }
        return filter_params_json;
    }

    parse_params_from_string (input:string) {
        const parser_result = this.stringParserService.parse(input);
        // console.log(input);
        // console.log(parser_result);
        return parser_result.params;
    }

    load_grid_data(app_name, grid_columns: string[], params: any) {
        let filter_params_json = this.get_filter_params();

        if (params != null) {
            Object.assign(filter_params_json, params);
        }

        let page_number = this.page.pageNumber + 1;
        // console.log(filter_params_json);

        let table_name = this.entity.get_table_name();
        if ( !table_name ) {
            table_name = this.entity.get_app_name();
        }

        this.modelService.load(table_name, grid_columns, filter_params_json, params.owner, page_number, this.page.size)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result_f1: any) => {
                //console.log(result_f1);
                //this.loadingIndicator = true;
                if (result_f1.state == 'error') {
                    this.rise_error(result_f1.message);
                } else {
                    //this.item_model = result.rows[0];
                    this.entity.model = result_f1.columns;
                    //this.item_model = result.columns;
                    this.columns_index = result_f1.columns_index;
                    this.rows_index = result_f1.rows_index;
                    if ( !this.freeze_default_columns_list ) {
                        this.entity.default_columns_list = result_f1.default_columns_list;
                    }
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

                    this.grid_meta = result_f1.grid_columns.meta;
                    let model_compose = this.entity.model;
                    this.compose_columns(this.grid_columns_for_compose, model_compose);

                    //console.log(this.item_model);
                    this.rows_data = result_f1.rows;
                    this.data_all = result_f1.rows.length;
                    // this.group();


                    //this.init_selected_rows(this.rows, selected);
                    //this.loadingIndicator = false;
                }
                this.refresh_complete = true;
            });

    }

    extended_params (params) {
        if ( this.params_filter === 'my' ) {
            params['user_id'] = this.modelService.get_user_id();
        }

        return params;
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
        };
        return control_column;
    }

    compose_columns(columns_list, model:SitebillModelItem[]) {
        //console.log('compose columns');
        //console.log(model);
        //console.log(model.length);
        //console.log(model[0]);
        //console.log(columns_list);
        //console.log(this.columns_index);

        if (this.compose_complete) {
            //return;
        }
        delete (this.data_columns);
        this.data_columns = [];
        //проходим по columns_list
        //для каждой вытягиваем из model информацию и добавляем в объект КОЛОНКИ
        if ( this.enable_select_rows ) {
            this.data_columns = [{
                cellTemplate: this.commonTemplate.gridCheckboxTmpl,
                headerTemplate: this.commonTemplate.gridCheckboxHdrTmpl,
                width: 30,
                type: 'primary_key',
                resizeable: false,
            }];
        }
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
                    if ( this.isMessengerEnabled(model[this.columns_index[row]]) ) {
                        cellTemplate = this.commonTemplate.whatsAppTmpl;
                    }
                    break;

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

                case 'injector':
                    cellTemplate = this.commonTemplate.injectorTmpl;
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

                case 'price':
                    cellTemplate = this.commonTemplate.priceTmpl;
                    break;

                case 'uploads':
                    cellTemplate = this.commonTemplate.imageTmpl;
                    break;

                case 'docuploads':
                    cellTemplate = this.commonTemplate.fileTmpl;
                    break;

                case 'select_by_query_multi':
                    cellTemplate = this.commonTemplate.select_by_query_multi_Tmpl;
                    break;

                default:
                    if ( this.isMessengerEnabled(model[this.columns_index[row]]) ) {
                        cellTemplate = this.commonTemplate.whatsAppTmpl;
                    } else {
                        cellTemplate = null;
                    }
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
        this.after_compose();
        //console.log(this.data_columns);

    }

    isMessengerEnabled ( modelItem: SitebillModelItem ) {
        if (
            modelItem.name === 'phone' ||
            (
                modelItem.parameters &&
                modelItem.parameters['messenger'] === '1'
            )
        ) {
            return true;
        }
        return false;
    }

    after_compose () {
        this.compose_complete = true;
        this.loadingIndicator = false;
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
            this.filterService.share_data(this.entity, column_name,
                {
                    'startDate':event.startDate.local().format('YYYY-MM-DD').toString(),
                    'endDate':event.endDate.local().format('YYYY-MM-DD').toString()
                });
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

        this.confirmDialogRef.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(result => {
            if (result) {
                this.modelService.delete(this.entity.get_table_name(), this.entity.primary_key, item_id)
                    .pipe(takeUntil(this._unsubscribeAll))
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
        //dialogConfig.width = '99vw';
        //dialogConfig.maxWidth = '99vw';
        //dialogConfig.height = '99vh';

        //dialogConfig.data = { app_name: this.entity.get_table_name(), primary_key: this.entity.primary_key, key_value: item_id };
        this.entity.set_key_value(item_id);
        if (this.only_collections) {
            this.entity.set_hook('add_to_collections');
        }
        dialogConfig.data = this.entity;
        dialogConfig.panelClass = 'regular-modal';
        this.open_form_with_check_access(dialogConfig);
    }

    open_form_with_check_access (dialogConfig) {
        if (this.modelService.get_access(this.entity.get_table_name(), 'access')) {
            return this.dialog.open(FormComponent, dialogConfig);
        } else {
            this._snackService.message('Нет доступа к добавлению/редактированию объявлений', 5000);
        }
        return false;
    }

    view_injector (event: any) {
        console.log('view injector');
        console.log(event);
    }


    view(item_id: any) {
        //console.log('view');
        //console.log(item_id);
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '99vw';
        dialogConfig.maxWidth = '99vw';
        //dialogConfig.data = { app_name: this.entity.get_table_name(), primary_key: this.entity.primary_key, key_value: item_id };
        this.entity.set_key_value(item_id);
        dialogConfig.data = this.entity;
        //console.log(dialogConfig.data);
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';

        this.dialog.open(ViewModalComponent, dialogConfig);
    }

    whatsapp_list_sender(entity: SitebillEntity) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = <SendCallbackBundle>{
            entity: entity,
        };
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';
        dialogConfig.width = '99vw';

        this.dialog.open(WhatsappModalComponent, dialogConfig);
    }

    view_whatsapp(event) {
        let history = false;
        let report_type = ReportType.client;
        let client_id = null;
        let data_id = null;

        if (
            event['column'] &&
            event['column']['model_name'] &&
            event.row &&
            event.row[event['column']['model_name']] &&
            event.row[event['column']['model_name']]['parameters'] &&
            event.row[event['column']['model_name']]['parameters']['report_type'] === 'data'
        ) {
            history = true;
            report_type = ReportType.data;
            if ( event.row['data_id'] ) {
                data_id = event.row['data_id'].value;
            }
        } else {
            if ( event.row['client_id'] ) {
                client_id = event.row['client_id'].value;
            }
        }
        if ( event.history ) {
            history = true;
        }
        const dialogConfig = new MatDialogConfig();
        this.entity.set_key_value(event.row[this.entity.get_primary_key()].value)

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = <SendCallbackBundle>{
            entity: this.entity,
            modelItems: event.row,
            phone: event.value,
            report_type: report_type,
            data_id: data_id,
            client_id: client_id,
        };
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';
        dialogConfig.width = '99vw';

        if ( history ) {
            this.dialog.open(ReportModalComponent, dialogConfig);
        } else {
            this.dialog.open(WhatsappModalComponent, dialogConfig);
        }
    }

    view_gallery(event) {
        let row = event.row;
        let column = event.column;
        let images = event.images;
        let disable_gallery_controls = event.disable_gallery_controls;
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
                if (image.remote === 'true') {
                    return {
                        small: image.preview + '?' + new Date().getTime(),
                        medium: image.normal + '?' + new Date().getTime(),
                        big: image.normal + '?' + new Date().getTime()
                    };
                } else {
                    return {
                        small: self.modelService.get_api_url() + '/img/data/' + image.preview + '?' + new Date().getTime(),
                        medium: self.modelService.get_api_url() + '/img/data/' + image.normal + '?' + new Date().getTime(),
                        big: self.modelService.get_api_url() + '/img/data/' + image.normal + '?' + new Date().getTime()
                    };
                }

            });
        } else {
            galleryImages[image_field] = [];
        }


        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = { entity: this.entity, galleryImages: galleryImages, image_field: image_field, disable_gallery_controls: disable_gallery_controls };
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';
        dialogConfig.width = '99vw';

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

        this.modelService.update_only_ql(this.entity.get_table_name(), value, ql_items)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: any) => {
                if (response.state == 'error') {
                    this._snackService.message(response.message);
                } else {
                    // this.cdr.markForCheck();
                    this.refresh();
                }
            });

    }

    toggle_collection_b24(event) {
        let data_id = event.value;
        let title = 'bitrix deal ' + this.bitrix24Service.get_entity_id();
        this.model_service_toggle_collections(
            event,
            this.bitrix24Service.get_domain(),
            this.bitrix24Service.get_entity_id(),
            title,
            data_id
        );
    }

    toggle_collection_modal_select_list(event) {
        const domain = this.bitrix24Service.get_domain();
        const title = '';
        const data_id = event.value;
        let deal_id = 1;

        if (event.row && event.row['id'] && !event.row['id'].collections) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = false;
            dialogConfig.panelClass = 'regular-modal';

            const modalRef = this.dialog.open(CollectionModalComponent, dialogConfig);
            modalRef.componentInstance.onSave
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                this.model_service_toggle_collections(event, domain, deal_id, title, data_id, result.memorylist_id);
            });
        } else {
            deal_id = event.row['id'].collections;
            const memorylist_id = event.row['id'].memorylist_id;
            this.model_service_toggle_collections(event, domain, deal_id, title, data_id, memorylist_id);
        }
    }

    model_service_toggle_collections( event, domain, deal_id, title, data_id, memorylist_id = 0 ) {
        this.modelService.toggle_collections(domain, deal_id, title, data_id, memorylist_id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: any) => {
                console.log(response);
                if (response.state == 'error') {
                    this._snackService.message(response.message);
                } else {
                    let collections_count = this.bitrix24Service.get_collections_count();
                    if ( response.data.operation == 'add' ) {
                        collections_count++;
                    } else {
                        collections_count--;
                    }
                    this.bitrix24Service.comment_add(data_id, event.row, response.data.operation);

                    this.bitrix24Service.set_collections_count(collections_count);


                    this.filterService.empty_share(this.entity);
                    this.refresh();
                }
            });
    }

    toggle_collection(event) {
        if ( this.bitrix24Service.get_domain() !== 'localhost' ) {
            this.toggle_collection_b24(event);
        } else {
            this.toggle_collection_modal_select_list(event);
        }
    }

    /**
       * Populate the table with new data based on the page number
       * @param page The page to select
       */
    setPage(pageInfo) {
        this.loadingIndicator = true;
        this.page.pageNumber = pageInfo.offset;
        //const params = { owner: true };
        let params = {};

        if (this.entity.get_default_params()) {
            params = this.entity.get_default_params();
        } else if (this.get_predefined_grid_params() != null) {
            params = this.get_predefined_grid_params();
        }

        this.init_grid(params);
    }

    onResize(event) {
        const params = { width: event.newValue };
        if ( event.column !== undefined && event.column.model_name !== undefined ) {
            this.modelService.update_column_meta(this.entity.get_table_name(), event.column.model_name, 'columns', params)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((response: any) => {
                    //console.log(response);
                });
        }
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
        return '';
    }


    onActivate(event) {
        // console.log('onActivate');
    }



    onSelect({selected}) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    export_collections_pdf(report_type = 'client') {
        const deal_id = this.bitrix24Service.get_entity_id();
        const domain = this.bitrix24Service.get_domain();
        this.modelService.export_collections_pdf(domain, deal_id, report_type, this.memorylist_id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: any) => {
                this.saveAsProject(response);
            });
    }

    saveAsExcel(content){
        this.writeContents((<any>content), this.entity.get_table_name() + '_.xlsx', 'application/excel');
    }

    saveAsProject(content){
        this.writeContents((<any>content), 'Подборка по сделке '+ this.bitrix24Service.get_entity_id() +'.pdf', 'application/pdf');
    }
    writeContents(content, fileName, contentType) {
        var a = document.createElement('a');
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    switch_collections(status: boolean) {
        this.enable_collections = status;
    }

    switch_only_collections (status: boolean) {
        this.only_collections = status;
    }

    configure_buttons () {
        // console.log('configure buttons ' + this.entity.get_app_name());
        if ( this.modelService.getConfigValue(this.entity.get_app_name() + '.add.disable') === true ) {
            this.disable_add_button = true;
        }
        if ( this.modelService.getConfigValue(this.entity.get_app_name() + '.edit.disable') === true ) {
            this.disable_edit_button = true;
        }
        if ( this.modelService.getConfigValue(this.entity.get_app_name() + '.delete.disable') === true ) {
            this.disable_delete_button = true;
        }
        if ( this.modelService.getConfigValue(this.entity.get_app_name() + '.activation.disable') === true ) {
            this.disable_activation_button = true;
        }
    }

    save_search() {

        this.saveSearchDialogRef = this.dialog.open(SaveSearchComponent, {
            disableClose: false,
            data: this.entity
        });
        this.saveSearchDialogRef.componentInstance.filter_params_json = this.get_filter_params();

    }

    report(item_id: any) {
        this.entity.set_key_value(item_id);
        this.reportDialogRef = this.dialog.open(ReportComponent, {
            disableClose: false,
            data: this.entity
        });
    }

    building_blocks (item_id: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.panelClass = 'regular-modal';
        dialogConfig.minWidth = '400px';
        //this.entity.set_key_value(item_id);
        this.entity.set_param('object_id', item_id);
        dialogConfig.data = this.entity;

        const modalRef = this.dialog.open(BuildingBlocksModalComponent, dialogConfig);
        modalRef.componentInstance.onSave
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
            console.log(result);
        });

    }

    coworkers(item_id: any) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.panelClass = 'regular-modal';
        dialogConfig.minWidth = '400px';
        //this.entity.set_key_value(item_id);
        this.entity.set_param('id', item_id);
        dialogConfig.data = this.entity;

        const modalRef = this.dialog.open(CoworkerModalComponent, dialogConfig);
        modalRef.componentInstance.onSave
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
            console.log(result);
        });
    }

    testimonials(item_id: any) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.panelClass = 'regular-modal';
        dialogConfig.minWidth = '400px';
        //this.entity.set_key_value(item_id);
        this.entity.set_param('id', item_id);
        dialogConfig.data = this.entity;

        const modalRef = this.dialog.open(TestimonialsModalComponent, dialogConfig);
        modalRef.componentInstance.onSave
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
            console.log(result);
        });
    }


    reset_filters () {
        this.clear_search_text();
        this.clear_selected_date_filter(this.date_range_key);
        this.filterService.reset(this.entity);
    }

    login_modal () {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'login-form';

        this.dialog.open(LoginModalComponent, dialogConfig);
    }

    get_apps_realty_min_filter_reset_count() {
        if ( this.modelService.getConfigValue('apps.realty.min_filter_reset_count') ) {
            return this.modelService.getConfigValue('apps.realty.min_filter_reset_count');
        }
        return 0;
    }

    share_memorylist() {
        const deal_id = this.bitrix24Service.get_entity_id();
        const domain = this.bitrix24Service.get_domain();

        console.log('share memory list');
        console.log('deal_id = ' + deal_id);
        console.log('domain = ' + domain);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.panelClass = 'login-form';

        this.dialog.open(ShareModalComponent, dialogConfig);
    }

    settings_modal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.panelClass = 'regular-modal';
        dialogConfig.data = {};
        dialogConfig.data.entity = this.entity;
        dialogConfig.data.grid_items = this.grid_columns_for_compose;
        dialogConfig.data.page = this.page;


        this.dialog.open(GridSettingsSidenavComponent, dialogConfig);
    }

    excel_modal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'regular-modal';
        dialogConfig.minWidth = '90vw';
        dialogConfig.data = {};
        dialogConfig.data.entity = this.entity;

        this.dialog.open(ExcelModalComponent, dialogConfig);
    }

    excel_export() {
        this.modelService.excel_export(this.entity, this.get_filter_params())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                    this.saveAsExcel(result);
                },
                err => {
                    console.log(err);
                    return false;
                }
            );

    }




    toggleExpandGroup(group) {
        console.log('Toggled Expand Group!', group);
        this.table.groupHeader.toggleExpandGroup(group);
    }

    onDetailToggle(event) {
        // console.log('Detail Toggled', event);
    }


    groupBy(list, keyGetter) {
        const map = new Map();
        const result = [];
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });

        for (let group_key of map.keys()) {
            result.push({key:group_key, value:map.get(group_key)});
        }
        return result;
    }


    private group() {
        if ( this.modelService.getConfigValue('apps.realty.grid.enable_grouping') === '1'
            && this.entity.get_table_name() === 'data' ) {
            if ( this.get_grid_items(null).includes('complex_id') ) {
                this.enable_grouping = true;
                //this.scrollbarH = false;
                this.group_key = 'complex_id';
                this.grouped = this.groupBy(this.rows_data, item => item[this.group_key].value_string);

                return true;
            }
        }
        this.group_key = this.entity.get_primary_key();
        this.grouped = this.groupBy(this.rows_data, item => item[this.group_key].value_string);
        return false;
    }

    deleteSelected($event: MouseEvent) {
        this.confirmDialogRef = this.dialog.open(ConfirmComponent, {
            disableClose: false
        });
        let delete_ids = [];

        this.confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить записи?';
        this.confirmDialogRef.componentInstance.confirmMessage2 = this.selected.length + ' шт.';
        this.selected.forEach((item) => {
            delete_ids.push(item[this.entity.get_primary_key()].value)
        });


        this.confirmDialogRef.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(result => {
                if (result) {
                    this.modelService.delete(this.entity.get_table_name(), this.entity.primary_key, delete_ids)
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((response: any) => {
                            this.selected = [];

                            if (response.state == 'error') {
                                this._snackService.message(response.message);
                                return null;
                            } else {
                                this._snackService.message('Записи удалены успешно');
                                this.filterService.empty_share(this.entity);
                            }
                        });
                }
                this.confirmDialogRef = null;
            });

    }

    getTableHeight() {
        if ( this.disable_fix_table_height ) {
            return '';
        }
        if ( this.modelService.getDomConfigValue('standalone_mode' ) ) {
            return ' table-height ';
        }
        return '';
    }

    show_whatsapp() {
        if ( this.whatsAppService.getMailingList().length > 0 ) {
            return true;
        }
        return false;
    }

    addToMailingList($event: MouseEvent) {
        if ( this.entity.get_app_name() === 'client' ) {
            this.whatsAppService.addToMailingList(this.selected);
        } else {
            this.whatsAppService.addToMailingAttachList(this.selected);
        }
    }
}
