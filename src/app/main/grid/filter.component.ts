import {Component, Input, isDevMode, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {currentUser} from 'app/_models/currentuser';
import {FilterService} from 'app/_services/filter.service';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { SitebillEntity } from 'app/_models';

@Component({
    selector: 'filter-comp',
    templateUrl: './filter.component.html',
    styles: [`h2, p, div {color:red;}`]
})
export class FilterComponent {
    options: any;
    @Input() columnObject: any;
    @Input() entity: SitebillEntity;
    api_url: string;
    selectedFilter: any;
    filter_enable: boolean;

    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;
    subscription: Subscription;



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        @Inject(APP_CONFIG) private config: AppConfig,
        private filterService: FilterService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        if (isDevMode()) {
            this.api_url = this.config.apiEndpoint;
        } else {
            this.api_url = '';
        }
        this.filter_enable = false;
    }

    ngOnInit(): void {
        switch (this.columnObject.type) {
            case "select_by_query": {
                this.load_dictionary(this.columnObject.model_name);
                this.filter_enable = true;
                break;
            }

            default: {
                this.options = ['Angular', 'PHP'];
                break;
            }
        }
    }

    selectItem(value) {
        //console.log(this.selectedFilter);
        this.filterService.share_data(this.entity, this.columnObject.model_name, value);
    }

    load_dictionary(columnName) {
        const request = {action: 'model', do: 'load_dictionary', columnName: columnName, session_key: this.currentUser.session_key};

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    if (this.filterService.share_array[this.entity.app_name] != undefined) {
                        this.selectedFilter = this.filterService.share_array[this.entity.app_name][columnName];
                    }
                    this.options = result.data;
                    //this.load_grid_data(result.selected);
                }
            });
    }

}
