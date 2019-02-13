import {Component, Input, isDevMode, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {currentUser} from 'app/_models/currentuser';
import {FilterService} from 'app/_services/filter.service';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

@Component({
    selector: 'filter-comp',
    templateUrl: './filter.component.html',
    styles: [`h2, p, div {color:red;}`]
})
export class FilterComponent {
    name = "Дмитрий";
    selectedCity: any;
    options: any;
    @Input() columnObject: any;
    api_url: string;
    test_options: any[] = [{ id: 0, value: 'Все'}, { id: 1, value: 'range'}];

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
    }

    ngOnInit(): void {
        console.log('columnTitle ' + this.columnObject.title);
        console.log(this.columnObject);
        console.log(this.columnObject.name);

        switch (this.columnObject.ngx_name) {
            case "city_id.title": {
                //this.options = ['Москва', 'Красноярск'];
                this.load_dictionary(this.columnObject.model_name);
                break;
            }
            case "street_id.title": {
                this.load_dictionary(this.columnObject.name);
                //this.options = ['Мира', 'Ленина'];
                break;
            }

            default: {
                this.options = ['Angular', 'PHP'];
                break;
            }
        }
    }

    selectItem(value) {
        this.filterService.share_data(this.columnObject.model_name, value);
        //console.log(value);
    }

    load_dictionary(columnName) {
        console.log('load_dictionary' + columnName);

        const request = {action: 'model', do: 'load_dictionary', columnName: columnName, session_key: this.currentUser.session_key};

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                console.log('filter component ' + columnName);
                console.log(result.data);
                if (result) {
                    this.options = result.data;
                    //this.load_grid_data(result.selected);
                }
            });
    }

}
