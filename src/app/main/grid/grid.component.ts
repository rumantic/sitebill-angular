import {Component, isDevMode, ElementRef, Inject, TemplateRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import {currentUser} from 'app/_models/currentuser';
import {DOCUMENT} from '@angular/platform-browser';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { Subject } from 'rxjs';
import { FilterService } from 'app/_services/filter.service';
import { FilterComponent } from 'app/main/grid/filter.component';
import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DeclineClientComponent } from 'app/dialogs/decline-client/decline-client.component';
import { CourseDialogComponent } from 'app/course-dialog/course-dialog.component';


@Component({
    selector   : 'grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    animations: fuseAnimations
})
export class GridComponent implements OnInit, OnDestroy
{
    rows = [];
    item_model: any[];
    rows_my = [];
    rows_data = [];
    selected = [];
    loadingIndicator: boolean;
    loadGridComplete: boolean;
    reorderable: boolean;
    api_url: string;
    records: any[];
    columns = [];
    data_columns = [];
    columns_client_all = [];
    columns_data_all = [];
    columns_client_my = [];
    rows1 = [];
    app_name: string;
    total_all: number;
    total_my: number;
    data_all: number;
    editing = {};
    options_test = {};
    test_indicator: string;
    objectKeys = Object.keys;


    @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
    @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
    @ViewChild('clientControlTmpl') clientControlTmpl: TemplateRef<any>;
    @ViewChild('clientIdTmpl') clientIdTmpl: TemplateRef<any>;
    @ViewChild('FilterComponent') filterTmpl: TemplateRef<any>;
    @ViewChild('clientStatusIdTmpl') clientStatusIdTmpl: TemplateRef<any>;

    private filter: number;




    // Private
    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;

    
    /**
     * Constructor
     *
     */
    constructor(
        private _httpClient: HttpClient,
        private elRef: ElementRef,
        @Inject(DOCUMENT) private document: any,
        private dialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
        @Inject(APP_CONFIG) private config: AppConfig,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private filterService: FilterService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this._unsubscribeAll = new Subject();

        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        if (isDevMode()) {
            this.api_url = this.config.apiEndpoint;
        } else {
            this.api_url = '';
        }
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: false
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };
    }
    ngOnInit() {
        this.setup_apps('client');
        this.rows = [];
        this.rows_my = [];
        this.refreash();
    }
    
    init_input_parameters () {
        let app_root_element;
        if (this.document.getElementById('calculator_mini_root')) {
            app_root_element = this.document.getElementById('calculator_mini_root');
        } else if (this.document.getElementById('app_root').getAttribute('realty_price') > 0) {
            app_root_element = this.document.getElementById('app_root');
        }
    }
    setup_apps(app_name) {
        this.app_name = app_name;
        if (app_name == 'client') {
            this.columns_client_all = [
                {
                    cellTemplate: this.clientControlTmpl,
                    name: 'Ответственный',
                    prop: 'user_id.value_string'
                },
                {
                    name: 'Дата',
                    prop: 'date.value_string'
                },
                {
                    name: 'Тип',
                    prop: 'type_id.value_string'
                },
                {
                    name: 'Категория',
                    prop: 'topic_choice.value'
                },
                {
                    name: 'Статус',
                    cellTemplate: this.clientStatusIdTmpl,
                    prop: 'status_id.value_string'
                },
                {
                    name: 'ФИО клиента',
                    prop: 'fio.value'
                },
            ];
            this.columns_client_my = [
                {
                    name: 'ID',
                    cellTemplate: this.clientIdTmpl,
                    prop: 'client_id.value'
                },
                {
                    cellTemplate: this.clientControlTmpl,
                    name: 'Ответственный',
                    prop: 'user_id.value_string'
                },
                {
                    name: 'Дата',
                    prop: 'date.value_string'
                },
                {
                    name: 'Тип',
                    prop: 'type_id.value_string'
                },
                {
                    name: 'Статус',
                    cellTemplate: this.clientStatusIdTmpl,
                    prop: 'status_id.value_string'
                },
                {
                    name: 'ФИО клиента',
                    prop: 'fio.value'
                },
                {
                    name: 'Телефон',
                    prop: 'phone.value'
                },
                {
                    name: 'Категория',
                    prop: 'topic_choice.value'
                },
            ];

        } else {
            //console.log(`${this.api_url}/apps/api/rest.php?action=model&do=get_data&session_key=${this.currentUser.session_key}`);
            //console.log('hdrTpl ');
            //console.log(this.hdrTpl);
            //console.log('editTmpl ' + this.editTmpl);
            //console.log('filterTpl ' + this.filterTmpl);
            //this.hdrTpl = 'some test';
            this.data_columns = [
                {
                    headerTemplate: this.hdrTpl,
                    name: 'id.title',
                    prop: 'id.value'
                },
                {
                    headerTemplate: this.hdrTpl,
                    name: 'city_id.title',
                    prop: 'city_id.value_string'
                },
                {
                    headerTemplate: this.hdrTpl,
                    name: 'street_id.title',
                    prop: 'street_id.value_string'
                },
                {
                    headerTemplate: this.hdrTpl,
                    name: 'price',
                    prop: 'price.value'
                },
                {
                    headerTemplate: this.hdrTpl,
                    cellTemplate: this.editTmpl,
                    name: 'image',
                    prop: 'image.value'
                },
            ];
        }

        const load_selected_request = { action: 'model', do: 'load_selected', session_key: this.currentUser.session_key };

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, load_selected_request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log('selected > ');
                //console.log(result.selected);
                /*
                if (result.selected) {
                    //this.selected = result.selected;
                    this.load_grid_data(app_name, result.selected, []);
                } else {
                    this.load_grid_data(app_name, [], []);
                }
                */
                this.refreash();


                this.loadingIndicator = false;
            });

    }

    toggleUserGet(row) {
        //console.log('user_id');
        //console.log(row.client_id.value);

        const body = { action: 'model', do: 'set_user_id_for_client', client_id: row.client_id.value, session_key: this.currentUser.session_key };
        //console.log(body);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log(result);
                this.refreash();
            });

    }

    declineClient(row) {
        //console.log('user_id');
        //console.log(row.client_id.value);

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        //dialogConfig.width = '100%';
        //dialogConfig.height = '100%';
        dialogConfig.autoFocus = true;
        dialogConfig.data = { app_name: this.app_name, primary_key: 'client_id', key_value: row.client_id.value };

        let dialogRef = this.dialog.open(DeclineClientComponent, dialogConfig);
        dialogRef.afterClosed()
            .subscribe(() => {
                this.refreash();
            })
        return;

        /*
        const body = {action: 'model', do: 'set_user_id_for_client', client_id: row.client_id.value, session_key: this.currentUser.session_key};
        //console.log(body);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log(result);
                this.refreash();
            });
        */

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

    refreash() {
        this.load_grid_data(this.app_name, [], []);
        const params = { owner: true };
        this.load_grid_data(this.app_name, [], params);
    }

    load_grid_data(app_name, selected, params: any) {
        //console.log('load_grid_data');
        //console.log(params);
        let grid_item;
        if (app_name == 'client') {
            if (params.owner) {
                grid_item = ['client_id', 'user_id', 'date', 'type_id', 'status_id', 'fio', 'phone', 'topic_choice'];
            } else {
                grid_item = ['client_id', 'user_id', 'date', 'type_id', 'status_id', 'fio', 'topic_choice'];
            }
        } else {
            grid_item = ['id', 'city_id', 'metro_id', 'street_id', 'number', 'price', 'image'];
        }
        const body = { action: 'model', do: 'get_data', model_name: app_name, owner: params.owner, session_key: this.currentUser.session_key, grid_item: grid_item };
        //console.log(body);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log(result);
                this.item_model = result.rows[0];
                this.loadGridComplete = true;

                console.log(this.item_model);
                if (app_name == 'client') {
                    if (params.owner) {
                        this.rows_my = result.rows;
                        this.total_my = result.rows.length;
                    } else {
                        this.rows = result.rows;
                        this.total_all = result.rows.length;
                    }
                } else {
                    this.rows_data = result.rows;
                    this.data_all = result.rows.length;
                }

                this.init_selected_rows(this.rows, selected);
                this.loadingIndicator = false;
            });
    }

    updateValue(event, cell, rowIndex, row) {
        /*
        console.log(event)
        console.log(cell)
        console.log(rowIndex)
        console.log(row)
        console.log(this.rows[rowIndex]);
        */
        this.editing[rowIndex + '-' + cell] = false;
        this.rows_my[rowIndex]['status_id']['value'] = event.target.value;

        const status_id = this.item_model['status_id'];
        const select_data = status_id['select_data'];

        this.rows_my[rowIndex]['status_id']['value_string'] = select_data[event.target.value];
        this.rows_my = [...this.rows_my];
        //console.log('UPDATED!', this.rows[rowIndex][cell]);
        const ql_items = { status_id: event.target.value };
        const body = { action: 'model', do: 'graphql_update', model_name: this.app_name, key_value: row.client_id.value, ql_items: ql_items, session_key: this.currentUser.session_key };
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((response: any) => {
                console.log(response);
            });


    }


    onSelect({ selected }) {
        console.log('Select Event', selected);
        //console.log(selected.length);
        /*
        const body = {action: 'model', do: 'select', session_key: this.currentUser.session_key, selected_items: selected};

        //?action=model&do=select&session_key=${this.currentUser.session_key}
        //console.log(body);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((contacts: any) => {
                //console.log(contacts);
            });

        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);

        //console.log(this.selected);
        //console.log(this.selected.length);
        */

    }

    onSelectOld({ selected }) {
        //console.log('Select Event', selected, this.selected);
        //console.log(selected.length);
        const body = { action: 'model', do: 'select', session_key: this.currentUser.session_key, selected_items: selected };

        //?action=model&do=select&session_key=${this.currentUser.session_key}
        //console.log(body);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((contacts: any) => {
                //console.log(contacts);
            });

        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);

        //console.log(this.selected);
        //console.log(this.selected.length);

    }


    delete_selection(item_id: string) {
        console.log('Delete selection', item_id);
        const body = { action: 'model', do: 'delete_selection', session_key: this.currentUser.session_key, item_id: item_id };

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((result: any) => {
                //console.log('selected > ');
                //console.log(result);
                if (result) {
                    this.selected = [];
                    this.init_selected_rows(this.rows, result.selected);
                } else {
                    //this.selected = [];
                }

                //this.selected.splice(0, this.selected.length);
                //this.selected.push(...result.selected);

                this.loadingIndicator = false;
            });

    }

    view_details(item_id: any) {
        //console.log('view details');
        //console.log(item_id);
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.width = '100%';
        dialogConfig.height = '100%';
        dialogConfig.autoFocus = true;
        dialogConfig.data = { app_name: this.app_name, primary_key: 'client_id', key_value: item_id };

        this.dialog.open(CourseDialogComponent, dialogConfig);
    }

    onActivate(event) {
        //console.log('Activate Event', event);
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    
}
