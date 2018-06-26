import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//import {Model} from '/model';
//import {MessageService} from '/message.service';
//import {User} from '/_models/user';
//import {currentUser} from '/_models/currentuser';

@Component({
    selector   : 'docs-components-third-party-ngx-datatable',
    templateUrl: './ngx-datatable.component.html',
    styleUrls  : ['./ngx-datatable.component.scss']
})
export class DocsComponentsThirdPartyNgxDatatableComponent implements OnInit, OnDestroy
{
    rows: any[];
    loadingIndicator: boolean;
    reorderable: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.loadingIndicator = true;
        this.reorderable = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        let currentUser: currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        
        this._httpClient.get(`http://genplan1/apps/api/rest.php?action=model&do=get_data&session_key=${currentUser.session_key}`)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: any) => {
                console.log(contacts.rows);
                this.rows = contacts.rows;
                this.loadingIndicator = false;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
