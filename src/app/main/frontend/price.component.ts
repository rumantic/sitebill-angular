import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {fuseAnimations} from '../../../@fuse/animations';
import {FuseConfigService} from '../../../@fuse/services/config.service';
import {FuseTranslationLoaderService} from '../../../@fuse/services/translation-loader.service';
import {locale as english} from './i18n/en';
import {locale as russian} from './i18n/ru';
import {BillingService} from '../../_services/billing.service';
import {FilterService} from '../../_services/filter.service';
import {Router} from '@angular/router';
import {ViewModalComponent} from '../grid/view-modal/view-modal.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoginModalComponent} from '../../login/modal/login-modal.component';
import {ModelService} from '../../_services/model.service';

@Component({
    selector   : 'price',
    templateUrl: './price.component.html',
    styleUrls  : ['./price.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class PriceComponent
{
    public products: any;
    public currency_id: number = 1;
    private products_loaded: boolean;
    private loading_in_progress: boolean;
    /**
     * Constructor
     *
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private billingSerivce: BillingService,
        protected router: Router,
        protected dialog: MatDialog,
        public modelService: ModelService,
        private filterService: FilterService,
        protected cdr: ChangeDetectorRef
    )
    {
        this.loading_in_progress = false;
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
        this.modelService.enable_guest_mode();
    }

    ngAfterViewChecked () {
        if ( this.modelService.all_checks_passes() && !this.products_loaded) {
            if ( !this.loading_in_progress ) {
                this.billingSerivce.get_products().subscribe(
                    (products: any) => {
                        const mapped = Object.keys(products.records).map(key => ({type: key, value: products.records[key]}));
                        this.products = mapped;
                        this.products_loaded = true;
                        this.cdr.markForCheck();
                    }
                );
                this.loading_in_progress = true;
            }
        }
    }


    login_modal () {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'login-form';

        this.dialog.open(LoginModalComponent, dialogConfig);
    }


    add_to_cart(product) {
        if ( this.modelService.get_nobody_mode() ) {
            this.login_modal();
            return;
        }

        localStorage.setItem('cart_items', JSON.stringify(product));
        console.log(product);
        this.router.navigate(['/cart/buy/']);
    }
}
