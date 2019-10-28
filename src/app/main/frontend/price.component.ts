import {Component} from '@angular/core';
import {fuseAnimations} from '../../../@fuse/animations';
import {FuseConfigService} from '../../../@fuse/services/config.service';
import {FuseTranslationLoaderService} from '../../../@fuse/services/translation-loader.service';
import {locale as english} from './i18n/en';
import {locale as russian} from './i18n/ru';
import {CartService} from '../../_services/cart.service';
import {FilterService} from '../../_services/filter.service';
import {Router} from '@angular/router';

@Component({
    selector   : 'price',
    templateUrl: './price.component.html',
    styleUrls  : ['./price.component.scss'],
    animations: fuseAnimations
})
export class PriceComponent
{
    public products: any;
    public currency_id: number = 1;
    /**
     * Constructor
     *
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private cartSerivce: CartService,
        protected router: Router,
        private filterService: FilterService
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
        this.cartSerivce.get_products().subscribe(
            (products: any) => {
                console.log(products);
                const mapped = Object.keys(products.records).map(key => ({type: key, value: products.records[key]}));

                this.products = mapped;
                console.log(mapped);
            }
        );
    }


    add_to_cart(product) {
        localStorage.setItem('cart_items', JSON.stringify(product));
        console.log(product);
        this.router.navigate(['/cart/buy/']);
    }
}
