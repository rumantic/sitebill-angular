import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

//import {Model} from '/model';
//import {MessageService} from '/message.service';
//import {User} from '/_models/user';
import {currentUser} from '../../../../_models/currentuser';


@Component({
    selector: 'docs-components-third-party-ngx-datatable',
    templateUrl: './ngx-datatable.component.html',
    styleUrls: ['./ngx-datatable.component.scss']
})
export class DocsComponentsThirdPartyNgxDatatableComponent implements OnInit, OnDestroy {
    rows: any[];
    selected = [];
    loadingIndicator: boolean;
    reorderable: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.loadingIndicator = true;
        this.reorderable = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._httpClient.get(`http://genplan1/apps/api/rest.php?action=model&do=get_data&session_key=${this.currentUser.session_key}`)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: any) => {
                console.log(contacts.rows);
                this.rows = contacts.rows;
                this.loadingIndicator = false;
            });
    }
    onSelect({selected}) {
        console.log('Select Event', selected, this.selected);
        console.log(selected.length);
        const body = {action:'model', do:'select', session_key:this.currentUser.session_key, selected_items: selected};
        
        //?action=model&do=select&session_key=${this.currentUser.session_key}
        console.log(body);
        
        this._httpClient.post('http://genplan1/apps/api/rest.php?action1=11', body)
            .subscribe((contacts: any) => {
                console.log(contacts);
            });

        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        
        console.log(this.selected.length);
        
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
