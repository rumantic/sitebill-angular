import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { CartComponent } from './cart.component';
import {BillingService} from '../../_services/billing.service';
import {MatGridListModule, MatIconModule} from '@angular/material';
import {SharedModule} from '../../shared.module';

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
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        MatIconModule,
        MatGridListModule,
        SharedModule,
    ],
    providers: [
        BillingService
    ]
})

export class CartModule
{
}
