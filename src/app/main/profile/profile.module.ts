import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { ProfileComponent } from './profile.component';
import {CartService} from '../../_services/cart.service';
import {MatGridListModule, MatIconModule} from '@angular/material';

const routes = [
    {
        path     : '**',
        component: ProfileComponent
    }
];

@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        MatIconModule,
        MatGridListModule,
    ],
    providers: [
        CartService
    ]
})

export class ProfileModule
{
}
