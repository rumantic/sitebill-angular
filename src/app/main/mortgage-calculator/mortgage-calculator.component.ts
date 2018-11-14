import {Component, Inject, OnInit, isDevMode, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef, ElementRef} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
registerLocaleData(localeRu, 'ru');
import {coerceNumberProperty} from '@angular/cdk/coercion';

import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {FuseConfigService} from '@fuse/services/config.service';
import {ActivatedRoute} from '@angular/router';

import {currentUser} from 'app/_models/currentuser';
import {DOCUMENT} from '@angular/platform-browser';


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

    realty_price = 5500000;
    step_realty_price = 10000;
    max_realty_price = 20000000;
    min_realty_price = 10000;

    down_payment = 1925000;
    down_percent = 50;
    step_down_payment = 10000;
    max_down_payment = 20000000;
    min_down_payment = 0;
    
    realty_minus_down = 0;

    percent = 8.5;
    step_percent = 0.1;
    max_percent = 100;
    min_percent = 1;

    years = 20;
    step_years = 1;
    max_years = 30;
    min_years = 1;

    month_payment = 0;
    overpayment = 0;
    show_overpayment = false;
    show_credit_sum = false;

    credit_sum = 0;
    
    stavka_title = "Ставка % **";
    stavka_description = "** для семей с двумя детьми и более";
    
    top_text = "Ежемесячный платеж:";
    bottom_text = "по двум документам!";

    private _tickInterval = 1;
    
    license_check_true: boolean = false;
    license_check_false: boolean = false;


    constructor(
        private route: ActivatedRoute,
        @Inject(DOCUMENT) private document: any,
        private _httpClient: HttpClient,
        private elRef: ElementRef,
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
        if (this.document.getElementById('app_root').getAttribute('years') > 0) {
            this.years = this.document.getElementById('app_root').getAttribute('years');
        }
        if (this.document.getElementById('app_root').getAttribute('realty_price') > 0) {
            this.realty_price = this.document.getElementById('app_root').getAttribute('realty_price');
        }
        if (this.document.getElementById('app_root').getAttribute('percent') > 0) {
            this.percent = this.document.getElementById('app_root').getAttribute('percent');
        }
        if (this.document.getElementById('app_root').getAttribute('down_payment') > 0) {
            this.down_payment = this.document.getElementById('app_root').getAttribute('down_payment');
        } else {
            this.down_payment = this.realty_price * 0.20;
        }
        
        if (this.document.getElementById('app_root').getAttribute('down_percent') > 0) {
            this.down_percent = this.document.getElementById('app_root').getAttribute('down_percent');
            this.down_payment = this.realty_price*(this.document.getElementById('app_root').getAttribute('down_percent')/100);
        } else {
            this.down_payment = this.realty_price * 0.20;
        }
        
        if (this.document.getElementById('app_root').getAttribute('show_overpayment') == 1) {
            this.show_overpayment = true;
        } else {
            this.show_overpayment = false;
        }
        
        if (this.document.getElementById('app_root').getAttribute('show_credit_sum') == 1) {
            this.show_credit_sum = true;
        } else {
            this.show_credit_sum = false;
        }
        
        if (this.document.getElementById('app_root').getAttribute('top_text') != null) {
            this.top_text = this.document.getElementById('app_root').getAttribute('top_text');
        }
        
        if (this.document.getElementById('app_root').getAttribute('bottom_text') != null) {
            this.bottom_text = this.document.getElementById('app_root').getAttribute('bottom_text');
        }
        
        this.calculate(null);

    }

    getStyleSheet(unique_title) {
        for (var i = 0; i < this.document.styleSheets.length; i++) {
            var sheet = this.document.styleSheets[i];
            try {
                for (var j = 0; j < sheet.cssRules.length; j++) {
                    if ( sheet.cssRules[j].selectorText == unique_title ) {
                        return sheet.cssRules[j];
                    }
                }

            } catch (err) {
                //console.log(err);

                // обработка ошибки

            }
        }
        return false;
    }


    ngAfterViewInit() {
        this._cdr.detectChanges();
    }

    ngOnInit() {
        this.check_license();
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
    
    formatLabelDown(value: number | null, realty_price: number | null) {
        if (!value) {
            return 0;
        }
        return (this.realty_price - value)/this.realty_price;

        if (value >= 1000) {
            return value / 1000000 + ' млн';
        }

        return value;
    }
    
    displayFnDown (value: number | null) {
        return 100-Math.round((this.realty_price - value)*100/this.realty_price) + '%';
    }
    

    calculate(event) {
        this.max_down_payment = this.realty_price;
        if ( this.down_payment > this.realty_price ) {
            this.down_payment = this.realty_price;
        }
        this.down_percent = 100-Math.round((this.realty_price - this.down_payment)*100/this.realty_price);
        let start_sum = this.realty_price - this.down_payment;
        this.realty_minus_down = start_sum;
        let percent_dig = this.percent / 1200;
        let periods = this.years * 12;
        this.month_payment = start_sum * (percent_dig / (1 - (Math.pow(1 + percent_dig, -periods))));
        this.credit_sum = this.month_payment * periods;
        this.overpayment = this.credit_sum - start_sum;
        if ( this.percent <= 6 ) {
            this.stavka_description = "** для семей с двумя детьми и более";
        } else {
            this.stavka_description = "";
        }
    }

    get tickInterval(): number | 'auto' {
        return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
    }
    set tickInterval(value) {
        this._tickInterval = coerceNumberProperty(value);
    }

    check_license() {
        
        const body = {proxysalt: 'jkkwJJfk34u76vjLDmckIQ2', action: 'license', anonymous: true, do: 'check', module: 'mortgage_calculator'};
        
        this._httpClient.post(`https://api.sitebill.ru/apps/apiproxy/restproxy.php`, body)
            .subscribe((result: any) => {
                console.log(result);
                if ( result.state == 'success' ) {
                    this.license_check_false = false;
                    this.license_check_true = true;
                } else {
                    this.license_check_false = true;
                    this.license_check_true = false;
                }
            });
    }

}
