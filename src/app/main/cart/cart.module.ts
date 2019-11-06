import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { CartComponent } from './cart.component';
import {CartService} from '../../_services/cart.service';

const routes = [
    {
        path     : '**',
        component: CartComponent
    }
];

@NgModule({
    declarations: [
        CartComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule
    ],
    providers: [
        CartService
    ]
})

export class CartModule
{
}
