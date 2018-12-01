import {Component, Input, isDevMode} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {currentUser} from '../../../../_models/currentuser';
import {FilterService} from 'app/main/documentation/components-third-party/datatable/filter.service';

@Component({
    selector: 'filter-comp',
    template: `
<mat-select multiple="true" (selectionChange)="selectItem($event.value)">
    <mat-option *ngFor="let option of options" [value]="option">
     {{ option }}
    </mat-option>
  </mat-select>
    <!--ng-select [(ngModel)]="selectedCity" [items]="cities" multiple="true" bindLabel="name" bindValue="id"></ng-select-->`,
    styles: [`h2, p, div {color:red;}`]
})
export class FilterComponent {
    name = "Дмитрий";
    selectedCity: any;
    options: any;
    @Input() columnName: string;
    api_url: string;

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
        private filterService: FilterService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        if (isDevMode()) {
            this.api_url = 'http://genplan1';
        } else {
            this.api_url = '';
        }
    }

    ngOnInit(): void {
        switch (this.columnName) {
            case "city_id.title": {
                //this.options = ['Москва', 'Красноярск'];
                this.load_dictionary('city_id');
                break;
            }
            case "street_id.title": {
                this.load_dictionary('street_id');
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
        //console.log(value);
    }

    load_dictionary(columnName) {
        const request = {action: 'model', do: 'load_dictionary', columnName: columnName, session_key: this.currentUser.session_key};

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log('selected > ');
                //console.log(result.data);
                if (result) {
                    this.options = result.data;
                    //this.load_grid_data(result.selected);
                }
            });
    }

}
