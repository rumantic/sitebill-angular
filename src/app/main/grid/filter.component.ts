import {Component, Input, isDevMode, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {currentUser} from 'app/_models/currentuser';
import {FilterService} from 'app/_services/filter.service';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { SitebillEntity } from 'app/_models';
import { Options, ChangeContext } from 'ng5-slider';
import { ModelService } from 'app/_services/model.service';

@Component({
    selector: 'filter-comp',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
    options: any;
    @Input() columnObject: any;
    @Input() entity: SitebillEntity;
    api_url: string;
    selectedFilter: any;
    filter_enable: boolean = false;
    select_filter_enable: boolean = false;

    price_selector: any;
    price_filter_enable: boolean = false;
    price_options: any[] = [{ id: 0, value: 'Все', actual: 0 }, { id: 5, value: 'range' }];
    price_min: number = 0;
    price_max: number = 1000000;
    options_price_zero_10m: Options = {
        floor: 0,
        ceil: 10000000,
        step: 1000
    };
    highValue: number = 100;
    slider_value = 0;
    value: any;



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
        private modelSerivce: ModelService,
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
        switch (this.columnObject.type) {
            case "select_by_query": {
                this.load_dictionary(this.columnObject.model_name);
                this.select_filter_enable = true;
                this.filter_enable = true;
                break;
            }

            case "select_box_structure": {
                this.load_dictionary(this.columnObject.model_name);
                this.select_filter_enable = true;
                this.filter_enable = true;
                break;
            }

            case "price": {
                //this.load_dictionary(this.columnObject.model_name);
                this.get_max(this.entity, this.columnObject.model_name);
                this.filter_enable = true;
                this.price_filter_enable = true;
                break;
            }


            default: {
                break;
            }
        }
    }

    get_max(entity: SitebillEntity, columnName) {
        this.modelSerivce.get_max(entity.app_name, columnName)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log(result);
                if ( result.state == 'success' ) {
                    this.price_max = result.message;
                    this.options_price_zero_10m.ceil = result.message;
                }
                if (this.filterService.share_array[this.entity.app_name] != undefined) {
                    this.price_min = this.filterService.share_array[this.entity.app_name]['price_min'];
                    this.price_max = this.filterService.share_array[this.entity.app_name]['price_max'];
                    this.price_selector = 5;
                }
            });
    }

    selectItem(value) {
        //console.log(this.selectedFilter);
        this.filterService.share_data(this.entity, this.columnObject.model_name, value);
    }

    load_dictionary(columnName) {

        this.modelSerivce.load_dictionary(columnName)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log(result);
                if (this.filterService.share_array[this.entity.app_name] != undefined) {
                    this.selectedFilter = this.filterService.share_array[this.entity.app_name][columnName];
                }
                this.options = result.data;
            });

    }


    onPriceSelectorClose() {
        this.filterService.share_data(this.entity, 'price_min', this.price_min);
        this.filterService.share_data(this.entity, 'price_max', this.price_max);
    }

    onPriceSliderChange(changeContext: ChangeContext): void {
        this.price_selector = 5;
        this.current_price_min = changeContext.value;
        this.current_price_max = changeContext.highValue;
    }

}
