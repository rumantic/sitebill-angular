import {Component, ElementRef, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import {DOCUMENT} from '@angular/platform-browser';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {ActivatedRoute} from '@angular/router';
import {FilterService} from '../../_services/filter.service';

@Component({
    selector   : 'cart',
    templateUrl: './cart.component.html',
    styleUrls  : ['./cart.component.scss']
})
export class CartComponent
{
    items_list_step: boolean = false;
    public step: string;
    public item_id: string;
    public product;
    public currency_id: number = 1;

    /**
     * Constructor
     *
     */
    constructor(
        private _httpClient: HttpClient,
        private elRef: ElementRef,
        private route: ActivatedRoute,
        private modelSerivce: ModelService,
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        @Inject(APP_CONFIG) private config: AppConfig,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                }
            }
        };

        this.step = this.route.snapshot.paramMap.get('step');
        this.item_id = this.route.snapshot.paramMap.get('item_id');
        console.log(this.step);
        console.log(this.item_id);

    }
    ngOnInit() {
        console.log('cart_items');
        this.product = JSON.parse(localStorage.getItem('cart_items'));
        console.log(this.product);
    }
    
    init_input_parameters () {
        let app_root_element;
        if (this.document.getElementById('calculator_mini_root')) {
            app_root_element = this.document.getElementById('calculator_mini_root');
        } else if (this.document.getElementById('app_root').getAttribute('realty_price') > 0) {
            app_root_element = this.document.getElementById('app_root');
        }
    }


    complete_order() {
        this.step = 'pay';
    }

    pay() {
        this.step = 'complete';
    }
}
