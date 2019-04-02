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
import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/operators';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material';
import { DeclineClientComponent } from 'app/dialogs/decline-client/decline-client.component';
import { CourseDialogComponent } from 'app/course-dialog/course-dialog.component';
import { ModelService } from 'app/_services/model.service';
import { ViewModalComponent } from './view-modal/view-modal.component';
import { FormComponent } from './form/form.component';
import { Page } from './page';
import { SitebillEntity } from 'app/_models';
import { ConfirmComponent } from 'app/dialogs/confirm/confirm.component';
import { SnackService } from 'app/_services/snack.service';



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
    columns_index = [];
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

    @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
    @ViewChild('imageTmpl') imageTmpl: TemplateRef<any>;
    @ViewChild('textTmpl') textTmpl: TemplateRef<any>;
    @ViewChild('controlTmpl') controlTmpl: TemplateRef<any>;
    @ViewChild('clientControlTmpl') clientControlTmpl: TemplateRef<any>;
    @ViewChild('clientIdTmpl') clientIdTmpl: TemplateRef<any>;
    @ViewChild('FilterComponent') filterTmpl: TemplateRef<any>;
    @ViewChild('clientStatusIdTmpl') clientStatusIdTmpl: TemplateRef<any>;

    confirmDialogRef: MatDialogRef<ConfirmComponent>;



    // Private
    protected _unsubscribeAll: Subject<any>;
    protected currentUser: currentUser;
    filterSharedData: any;

    
    /**
     * Constructor
     *
     */
    constructor(
        protected _httpClient: HttpClient,
        private elRef: ElementRef,
        @Inject(DOCUMENT) private document: any,
        private dialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
        private modelSerivce: ModelService,
        private _snackService: SnackService,
        @Inject(APP_CONFIG) private config: AppConfig,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private filterService: FilterService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this._unsubscribeAll = new Subject();
        this.ngxHeaderHeight = 48;
        this.entity = new SitebillEntity();

        this.page.pageNumber = 0;
        this.page.size = 0;

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
                    hidden: false
                },
                footer: {
                    hidden: true
                }
            }
        };

    }
    ngOnInit() {
        this.setup_apps();
        this.rows = [];
        this.rows_my = [];
        this.refresh();

        this.filterService.share.subscribe((datas) => {
            //this.filterSharedData = datas;
            this.ngxHeaderHeight = "auto";
            this.refresh();
        });

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
        //console.log('setup client');

        this.entity.app_name = 'client';
        this.entity.primary_key = 'client_id';
        //this.init_grid();


        /*
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
        */

    }

    init_grid(params) {
        this.modelSerivce.load_grid_columns(this.entity)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log(result);
                this.load_grid_data(this.entity.app_name, result.data, params);
            });
    }



    get_grid_items(params: any) {
        return this.entity.columns;
    }

    load_grid_data(app_name, grid_columns: string[], params: any) {
        //console.log('load_grid_data');
        //console.log(params);
        let filter_params_json = {};


        if (this.filterService.params_count[this.entity.app_name] > 0) {
            var obj = this.filterService.share_array[this.entity.app_name];
            var mapped = Object.keys(obj);
            mapped.forEach(function (item, i, arr) {
                if (obj[item] != 0) {
                    filter_params_json[item] = obj[item];
                }
            });
        }
        let page_number = this.page.pageNumber + 1;
        //console.log(filter_params_json);

        this.modelSerivce.load(app_name, grid_columns, filter_params_json, params.owner, page_number, this.page.size)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result_f1: any) => {
                //console.log(result_f1);
                //this.item_model = result.rows[0];
                this.entity.model = result_f1.columns;
                //this.item_model = result.columns;
                this.columns_index = result_f1.columns_index;
                this.entity.default_columns_list = result_f1.default_columns_list;
                this.entity.columns_index = result_f1.columns_index;
                //console.log(this.item_model);
                this.loadGridComplete = true;
                this.page.totalElements = result_f1.total_count;
                this.page.size = result_f1.per_page;
                this.grid_columns_for_compose = result_f1.grid_columns;
                let model_compose = this.entity.model;
                this.compose_columns(this.grid_columns_for_compose, model_compose);

                //console.log(this.item_model);
                this.rows_data = result_f1.rows;
                this.data_all = result_f1.rows.length;

                //this.init_selected_rows(this.rows, selected);
                this.loadingIndicator = false;
            });

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

        let control_column = {
            headerTemplate: this.hdrTpl,
            cellTemplate: this.controlTmpl,
            type: 'primary_key',
            ngx_name: this.entity.primary_key + '.title',
            model_name: this.entity.primary_key,
            title: '',
            prop: this.entity.primary_key + '.value'
        }
        this.data_columns.push(control_column);

        columns_list.forEach((row, index) => {
            //console.log(model);
            //console.log(model[this.columns_index[row]].name);
            this.entity.add_column(model[this.columns_index[row]].name);
            let cellTemplate = null;
            let prop = '';
            switch (model[this.columns_index[row]].type) {
                case 'safe_string':
                case 'textarea':
                case 'textarea_editor':
                    console.log(model[this.columns_index[row]].name);
                    cellTemplate = this.textTmpl;
                    prop = model[this.columns_index[row]].name + '.value';
                    break;

                case 'uploads':
                    cellTemplate = this.imageTmpl;
                    prop = model[this.columns_index[row]].name + '.value';
                    break;
                default:
                    cellTemplate = null;
                    prop = model[this.columns_index[row]].name + '.value_string';

            }

            let column = {
                headerTemplate: this.hdrTpl,
                cellTemplate: cellTemplate,
                type: model[this.columns_index[row]].type,
                ngx_name: model[this.columns_index[row]].name + '.title',
                model_name: model[this.columns_index[row]].name,
                title: model[this.columns_index[row]].title,
                prop: prop
            }
            this.data_columns.push(column);
        });
        this.compose_complete = true;
        //console.log(this.data_columns);

    }




    updateValue(event, cell, rowIndex, row) {
        /*
        console.log(event)
        console.log(cell)
        console.log(rowIndex)
        console.log(row)
        console.log(this.rows[rowIndex]);
        */

        /*
        this.editing[rowIndex + '-' + cell] = false;
        this.rows_my[rowIndex]['status_id']['value'] = event.target.value;

        const status_id = this.item_model['status_id'];
        const select_data = status_id['select_data'];

        this.rows_my[rowIndex]['status_id']['value_string'] = select_data[event.target.value];
        this.rows_my = [...this.rows_my];
        //console.log('UPDATED!', this.rows[rowIndex][cell]);
        const ql_items = { status_id: event.target.value };
        const body = { action: 'model', do: 'graphql_update', model_name: this.entity.app_name, key_value: row.client_id.value, ql_items: ql_items, session_key: this.currentUser.session_key };
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((response: any) => {
                //console.log(response);
            });

        */
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

    delete(item_id: any) {
        this.confirmDialogRef = this.dialog.open(ConfirmComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить запись?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.modelSerivce.delete(this.entity.app_name, this.entity.primary_key, item_id)
                    .subscribe((response: any) => {
                        console.log(response);

                        if (response.state == 'error') {
                            this._snackService.message(response.message);
                            return null;
                        } else {
                            this._snackService.message('Запись удалена успешно');
                            this.filterService.empty_share();
                        }
                    });
            }
            this.confirmDialogRef = null;
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
        dialogConfig.data = { app_name: this.entity.app_name, primary_key: this.entity.primary_key, key_value: item_id };

        this.dialog.open(CourseDialogComponent, dialogConfig);
    }

    edit_form(item_id: any) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = { app_name: this.entity.app_name, primary_key: this.entity.primary_key, key_value: item_id };
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';

        this.dialog.open(FormComponent, dialogConfig);
    }


    view(item_id: any) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = { app_name: this.entity.app_name, primary_key: this.entity.primary_key, key_value: item_id };
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';

        this.dialog.open(ViewModalComponent, dialogConfig);
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
    
    load_selected() {
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
                this.refresh();


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
                this.refresh();
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
        dialogConfig.data = { app_name: this.entity.app_name, primary_key: 'client_id', key_value: row.client_id.value };

        let dialogRef = this.dialog.open(DeclineClientComponent, dialogConfig);
        dialogRef.afterClosed()
            .subscribe(() => {
                this.refresh();
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

    refresh() {
        console.log('refresh');
        //this.load_grid_data(this.app_name, [], []);
        //const params = { owner: true };
        //this.load_grid_data(this.app_name, [], params);
        this.setPage({ offset: this.page.pageNumber });
    }

    /**
       * Populate the table with new data based on the page number
       * @param page The page to select
       */
    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        //const params = { owner: true };
        const params = {};
        this.init_grid(params);
    }
}
