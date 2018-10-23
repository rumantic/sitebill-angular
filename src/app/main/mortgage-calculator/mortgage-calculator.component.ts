import {Component, Inject, OnInit, isDevMode, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef, Pipe, PipeTransform} from '@angular/core';
import {coerceNumberProperty} from '@angular/cdk/coercion';

import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {FuseConfigService} from '@fuse/services/config.service';
import {ActivatedRoute} from '@angular/router';

import {currentUser} from 'app/_models/currentuser';


@Component({
    selector: 'mortgage-calculator',
    templateUrl: './mortgage-calculator.component.html',
    styleUrls: ['./mortgage-calculator.component.css']
})
export class MortgageCalculatorComponent implements OnInit {
    controlPressed: boolean;
    controlProcessing: boolean;
    key_value: any;
    model_name: any;
    control_name: any;
    item_model: any[];
    item: any[];

    rows: any[];
    records: any[];
    api_url: string;

    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;

    autoTicks = false;
    disabled = false;
    invert = false;
    max = 100;
    min = 0;
    showTicks = false;
    step = 1;
    thumbLabel = true;
    value = 0;
    vertical = false;
    
    realty_price = 7000000;
    step_realty_price = 10000;
    max_realty_price = 20000000;
    min_realty_price = 10000;
    
    down_payment = 1000000;
    step_down_payment = 10000;
    max_down_payment = 20000000;
    min_down_payment = 10000;

    private _tickInterval = 1;


    constructor(
        private route: ActivatedRoute,
        private _httpClient: HttpClient,
        private _fuseConfigService: FuseConfigService,
        private _cdr: ChangeDetectorRef
    ) {

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        if (isDevMode()) {
            this.api_url = 'http://genplan1';
        } else {
            this.api_url = '';
        }
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };

        this.model_name = this.route.snapshot.paramMap.get('model_name');
        this.control_name = this.route.snapshot.paramMap.get('control_name');
        this.key_value = this.route.snapshot.paramMap.get('id');


        this.controlPressed = false;
        this.controlProcessing = true;
    }
    ngAfterViewInit() {
        this._cdr.detectChanges();
    }

    ngOnInit() {
        this.load_grid_data('data', {active: 1, user_id: 226}, ['id', 'city_id', 'country_id', 'street_id', 'number', 'price', 'currency_id', 'image']);
        this.load_grid_data('complex', {active: 1}, ['complex_id', 'name', 'url', 'image']);
    }

    formatLabel(value: number | null) {
        if (!value) {
            return 0;
        }

        if (value >= 1000) {
            return value / 1000000 + ' млн';
        }

        return value;
    }
    
    get tickInterval(): number | 'auto' {
        return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
    }
    set tickInterval(value) {
        this._tickInterval = coerceNumberProperty(value);
    }


    load_grid_data(app_name, params: any, grid_item) {
        //console.log('load_grid_data');
        //console.log(params);
        const body = {action: 'model', anonymous: true, do: 'get_data', model_name: app_name, params: params, session_key: this.currentUser.session_key, grid_item: grid_item};
        //console.log(body);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((result: any) => {
                //console.log(result);
                //this.init_data_slides(app_name, result.rows);
            });
    }

}
