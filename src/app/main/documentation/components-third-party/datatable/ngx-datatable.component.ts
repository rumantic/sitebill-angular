import {Component, OnDestroy, OnInit, isDevMode, Input, ViewEncapsulation, TemplateRef, ViewChild} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {fuseAnimations} from '@fuse/animations';
import {MatDialog, MatDialogConfig} from "@angular/material";
import {FilterService} from 'app/main/documentation/components-third-party/datatable/filter.service';


//import {Model} from '/model';
//import {MessageService} from '/message.service';
//import {User} from '/_models/user';
import {currentUser} from '../../../../_models/currentuser';
import {CourseDialogComponent} from "app/course-dialog/course-dialog.component";
import {DeclineClientComponent} from "app/dialogs/decline-client/decline-client.component";

@Component({
    selector: 'docs-components-third-party-ngx-datatable',
    templateUrl: './ngx-datatable.component.html',
    styleUrls: ['./ngx-datatable.component.scss'],
    providers: [FilterService],
    animations: fuseAnimations
})
export class DocsComponentsThirdPartyNgxDatatableComponent implements OnInit, OnDestroy {
    rows = [];
    item_model: any[];
    rows_my = [];
    selected = [];
    loadingIndicator: boolean;
    loadGridComplete: boolean;
    reorderable: boolean;
    api_url: string;
    records: any[];
    columns = [];
    rows1 = [];
    app_name: string;
    total_all: number;
    total_my: number;
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
    mission = '<no mission announced parent>';

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private dialog: MatDialog,
        private filterService: FilterService
    ) {
        // Set the defaults
        this.loadingIndicator = true;
        this.reorderable = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        console.log(this.currentUser);
        if (isDevMode()) {
            this.api_url = 'http://genplan1';
        } else {
            this.api_url = '';
        }
        filterService.missionAnnounced$.subscribe(
            mission => {
                this.mission = mission;
                //this.announced = true;
                //this.confirmed = false;
            });
            
        this.options_test = {'test1':'var1', 'test2':'var2', 'test3':'var3'};
        console.log(this.options_test);
        this.test_indicator = 'some test indicator';
        this.loadGridComplete = false;
            

    }

    test_trigger() {
        //this.filterService.announceMission('test trigger');       
        //console.log(this.mission);
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.setup_apps('client');
        this.rows = [];
        this.rows_my = [];
        this.refreash();
    }

    setup_apps(app_name) {
        this.app_name = app_name;
        if (app_name == 'client') {
            this.columns = [
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
            ];
        } else {
            //console.log(`${this.api_url}/apps/api/rest.php?action=model&do=get_data&session_key=${this.currentUser.session_key}`);
            //console.log('hdrTpl ');
            //console.log(this.hdrTpl);
            //console.log('editTmpl ' + this.editTmpl);
            //console.log('filterTpl ' + this.filterTmpl);
            //this.hdrTpl = 'some test';
            this.columns = [
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

        const load_selected_request = {action: 'model', do: 'load_selected', session_key: this.currentUser.session_key};

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

        const body = {action: 'model', do: 'set_user_id_for_client', client_id: row.client_id.value, session_key: this.currentUser.session_key};
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
        dialogConfig.data = {app_name: this.app_name, primary_key: 'client_id', key_value: row.client_id.value};

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
        const params = {owner: true};
        this.load_grid_data(this.app_name, [], params);
    }

    load_grid_data(app_name, selected, params: any) {
        //console.log('load_grid_data');
        //console.log(params);
        let grid_item;
        if (app_name == 'client') {
            grid_item = ['client_id', 'user_id', 'date', 'type_id', 'status_id', 'fio', 'phone'];
        } else {
            grid_item = ['id', 'city_id', 'metro_id', 'street_id', 'number', 'price', 'image'];
        }
        const body = {action: 'model', do: 'get_data', model_name: app_name, owner: params.owner, session_key: this.currentUser.session_key, grid_item: grid_item};
        //console.log(body);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log(result);
                this.item_model = result.rows[0];
                this.loadGridComplete = true;
                
                console.log(this.item_model);
                
                if (params.owner) {
                    this.rows_my = result.rows;
                    this.total_my = result.rows.length;
                } else {
                    this.rows = result.rows;
                    this.total_all = result.rows.length;
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
        const ql_items = {status_id: event.target.value};
        const body = {action: 'model', do: 'graphql_update', model_name: this.app_name, key_value: row.client_id.value, ql_items: ql_items, session_key: this.currentUser.session_key};
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((response: any) => {
                console.log(response);
            });
        
        
    }


    onSelect({selected}) {
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

    onSelectOld({selected}) {
        //console.log('Select Event', selected, this.selected);
        //console.log(selected.length);
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

    }


    delete_selection(item_id: string) {
        console.log('Delete selection', item_id);
        const body = {action: 'model', do: 'delete_selection', session_key: this.currentUser.session_key, item_id: item_id};

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
        dialogConfig.data = {app_name: this.app_name, primary_key: 'client_id', key_value: item_id};

        this.dialog.open(CourseDialogComponent, dialogConfig);
        /*
        this.dialogRef = this._matDialog.open(ContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                contact: contact,
                action : 'edit'
            }
        });
        

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    case 'save':

                        this._contactsService.updateContact(formData.getRawValue());

                        break;
                    case 'delete':

                        this.deleteContact(contact);

                        break;
                }
            });
            */
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
