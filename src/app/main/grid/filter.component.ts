import {Component, Input} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FilterService} from 'app/_services/filter.service';
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
    options_checkbox: number[] =  [1,0];
    options_select_box: any;
    @Input() columnObject: any;
    @Input() entity: SitebillEntity;
    api_url: string;
    selectedFilter: any;
    filter_enable: boolean = false;
    select_filter_enable: boolean = false;
    select_box_filter_enable: boolean = false;
    string_filter_enable: boolean = false;
    checkbox_filter_enable: boolean = false;
    focus_complete: boolean = false;

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
    subscription: Subscription;



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private modelSerivce: ModelService,
        private filterService: FilterService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        if (this.filterService.share_array[this.entity.app_name] != null) {
            //console.log(this.filterService.share_array[this.entity.app_name]);
            if (this.filterService.share_array[this.entity.app_name][this.columnObject.model_name] != null) {
                this.onFocus(null);
            }
        }

        switch (this.columnObject.type) {
            case "select_by_query": {
                this.select_filter_enable = true;
                this.filter_enable = true;
                break;
            }

            case "mobilephone": 
            case "primary_key": 
            case "safe_string": {
                this.string_filter_enable = true;
                this.filter_enable = true;
                break;
            }
            case "uploads":
            case "checkbox": {
                this.checkbox_filter_enable = true;
                this.filter_enable = true;
                break;
            }

            case "select_box_structure": {
                this.select_filter_enable = true;
                this.filter_enable = true;
                break;
            }

            case "select_box": {
                this.initSelectBox();
                this.select_box_filter_enable = true;
                this.filter_enable = true;
                break;
            }


            case "price": {
                this.filter_enable = true;
                this.price_filter_enable = true;
                break;
            }


            default: {
                break;
            }
        }
    }

    initSelectBox() {
        try {
            this.options_select_box = this.entity.model[this.entity.columns_index[this.columnObject.model_name]].select_data_indexed;
        } catch (e) {
            console.log(e);
        }
    }

    onFocus(event) {
        if (!this.focus_complete) {
            if (this.columnObject.type == 'price') {
                this.get_max(this.entity, this.columnObject.model_name);
            } else {
                this.load_dictionary(this.columnObject.model_name);
            }
            this.focus_complete = true;
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
                    if (this.filterService.share_array[this.entity.app_name]['price_min'] != undefined ) {
                        this.price_min = this.filterService.share_array[this.entity.app_name]['price_min'];
                    }
                    if (this.filterService.share_array[this.entity.app_name]['price_max'] != undefined) {
                        this.price_max = this.filterService.share_array[this.entity.app_name]['price_max'];
                    }
                    if (this.filterService.share_array[this.entity.app_name]['price_min'] != undefined || this.filterService.share_array[this.entity.app_name]['price_max'] != undefined) {
                        this.price_selector = 5;
                    }
                }
            });
    }

    selectItem(value) {
        //console.log(this.selectedFilter);
        if (this.columnObject.type == 'checkbox') {
            if (value == null) {
                this.filterService.unshare_data(this.entity, this.columnObject.model_name);
                return;
            }
        }
        //console.log('selectItem');
        this.filterService.share_data(this.entity, this.columnObject.model_name, value);
    }

    load_dictionary(columnName) {

        this.modelSerivce.load_dictionary_model(this.entity.app_name, columnName)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log(columnName);
                //console.log(result);
                if (this.filterService.share_array[this.entity.app_name] != undefined) {
                    this.selectedFilter = this.filterService.share_array[this.entity.app_name][columnName];
                }
                this.options = result.data;
            });

    }


    onPriceSelectorClose() {
        if (this.price_selector != 0 ) {
            this.filterService.share_data(this.entity, 'price_min', this.price_min);
            this.filterService.share_data(this.entity, 'price_max', this.price_max);
        }
    }
    onPriceSelectorChange() {
        //console.log(this.price_selector);
        if (this.price_selector == 0) {
            this.filterService.unshare_data(this.entity, 'price_min');
            this.filterService.unshare_data(this.entity, 'price_max');
        }
    }

    onPriceSliderChange(changeContext: ChangeContext): void {
        this.price_selector = 5;
    }

}
