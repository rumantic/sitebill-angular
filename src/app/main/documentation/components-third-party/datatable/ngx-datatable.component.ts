import {Component, OnDestroy, OnInit, isDevMode} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';

//import {Model} from '/model';
//import {MessageService} from '/message.service';
//import {User} from '/_models/user';
import {currentUser} from '../../../../_models/currentuser';


@Component({
    selector: 'docs-components-third-party-ngx-datatable',
    templateUrl: './ngx-datatable.component.html',
    styleUrls: ['./ngx-datatable.component.scss'],
    animations   : fuseAnimations
})
export class DocsComponentsThirdPartyNgxDatatableComponent implements OnInit, OnDestroy {
    rows: any[];
    selected = [];
    loadingIndicator: boolean;
    reorderable: boolean;
    api_url: string;

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
        if(isDevMode()) {
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

        this._httpClient.get(`${this.api_url}/apps/api/rest.php?action=model&do=get_data&session_key=${this.currentUser.session_key}`)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: any) => {
                //console.log(contacts.rows);
                this.rows = contacts.rows;
                this.loadingIndicator = false;
            });
        
        const load_selected_request = {action:'model', do:'load_selected', session_key:this.currentUser.session_key};
        
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, load_selected_request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                console.log('selected > ');
                console.log(result);
                if ( result ) {
                    this.selected = result.selected;
                }
                
                this.loadingIndicator = false;
            });
            
    }
    
    onSelect({selected}) {
        //console.log('Select Event', selected, this.selected);
        //console.log(selected.length);
        const body = {action:'model', do:'select', session_key:this.currentUser.session_key, selected_items: selected};
        
        //?action=model&do=select&session_key=${this.currentUser.session_key}
        //console.log(body);
        
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((contacts: any) => {
                console.log(contacts);
            });

        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        
        console.log(this.selected.length);
        
    }
    
    delete_selection(item_id: string) {
        console.log('Delete selection', item_id);
        const body = {action:'model', do:'delete_selection', session_key:this.currentUser.session_key, item_id: item_id};
        
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((result: any) => {
                console.log('selected > ');
                console.log(result);
                if ( result ) {
                    this.selected = result.selected;
                } else {
                    //this.selected = [];
                }
                
                //this.selected.splice(0, this.selected.length);
                //this.selected.push(...result.selected);
                
                this.loadingIndicator = false;
            });

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
