import {Component, ElementRef, Inject, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {ActivatedRoute, Router} from '@angular/router';
import {fuseAnimations} from '../../../@fuse/animations';
import {BillingService} from '../../_services/billing.service';

@Component({
    selector   : 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls  : ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class DashboardComponent
{
    username: string;
    public invoices:  { id: string; value: any }[];
    public user_products: { id: string; value: any }[];
    public user_products_loaded: boolean;
    public invoices_loaded: boolean;
    /**
     * Constructor
     *
     */
    constructor(
        private _httpClient: HttpClient,
        private elRef: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private modelService: ModelService,
        private billingService: BillingService,
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


    }
    ngOnInit() {
        this.username = 'test';
        this.load_invoices();
        this.load_user_products();
    }

    load_invoices () {
        this.billingService.get_invoices().subscribe(
            (invoices: any) => {
                this.invoices_loaded = true;
                const mapped = Object.keys(invoices).map(key => ({id: key, value: invoices[key]}));
                this.invoices = mapped;

                if ( invoices.length > 0 ) {
                }
            }
        );
    }

    load_user_products () {
        this.billingService.get_user_products().subscribe(
            (user_products: any) => {
                this.user_products_loaded = true;
                if (  user_products != null ) {
                    const mapped = Object.keys(user_products).map(key => ({id: key, value: user_products[key]}));
                    this.user_products = mapped;
                }
            }
        );
    }
}
