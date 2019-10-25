import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { CartComponent } from './cart.component';

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
    ]
})

export class CartModule
{
}
