import {Component, OnDestroy, OnInit, isDevMode, Input, ViewEncapsulation, TemplateRef, ViewChild} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {fuseAnimations} from '@fuse/animations';
import {MatDialog, MatDialogConfig} from "@angular/material";


//import {Model} from '/model';
//import {MessageService} from '/message.service';
//import {User} from '/_models/user';
import {currentUser} from '../../../../_models/currentuser';
import {CourseDialogComponent} from "app/course-dialog/course-dialog.component";

@Component({
    selector: 'docs-components-third-party-ngx-datatable',
    templateUrl: './ngx-datatable.component.html',
    styleUrls: ['./ngx-datatable.component.scss'],
    animations: fuseAnimations
})
export class DocsComponentsThirdPartyNgxDatatableComponent implements OnInit, OnDestroy {
    rows: any[];
    selected = [];
    loadingIndicator: boolean;
    reorderable: boolean;
    api_url: string;
    records: any[];
    selectedCity: any;
    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pabradė'}
    ];
    columns = [];
    rows1 = [];
    @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
    @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
    @ViewChild('FilterComponent') filterTmpl: TemplateRef<any>;
    private filter: number;
    
    
    

    // Private
    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private dialog: MatDialog
    ) {
        // Set the defaults
        this.loadingIndicator = true;
        this.reorderable = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        if (isDevMode()) {
            this.api_url = 'http://genplan1';
        } else {
            this.api_url = '';
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        console.log(`${this.api_url}/apps/api/rest.php?action=model&do=get_data&session_key=${this.currentUser.session_key}`);
        console.log('hdrTpl ' + this.hdrTpl);
        console.log('editTmpl ' + this.editTmpl);
        console.log('filterTpl ' + this.filterTmpl);
        //this.hdrTpl = 'some test';
        this.columns = [{
            cellTemplate: this.editTmpl,
            headerTemplate: this.hdrTpl,
            name: 'Gender11'
        }];        

        const load_selected_request = {action: 'model', do: 'load_selected', session_key: this.currentUser.session_key};

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, load_selected_request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log('selected > ');
                //console.log(result.selected);
                if (result) {
                    //this.selected = result.selected;
                    this.load_grid_data(result.selected);
                }

                this.loadingIndicator = false;
            });


    }

    init_selected_rows(rows, selected) {
        for (let entry of selected) {
            rows.forEach((row, index) => {
                if (row.id.value == entry.id.value) {
                    this.selected.push(rows[index]);
                }
            });
        }
    }

    load_grid_data(selected) {
        console.log('load_grid_data');
        let grid_item = ['id', 'city_id', 'metro_id', 'street_id', 'number', 'price', 'image'];
        const body = {action: 'model', do: 'get_data', session_key: this.currentUser.session_key, grid_item: grid_item};
        //console.log(selected);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                console.log(result.rows);
                this.rows = result.rows;
                this.init_selected_rows(this.rows, selected);
                this.loadingIndicator = false;
            });
    }


    onSelect({selected}) {
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
    
    view_details(item_id: string) {
        console.log('view details', item_id);
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {item_id : item_id};

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
