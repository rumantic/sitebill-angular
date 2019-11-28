import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { DashboardComponent } from './dashboard.component';
import {MatGridListModule, MatIconModule, MatOptionModule, MatSelectModule} from '@angular/material';
import {SharedModule} from '../../shared.module';

const routes = [
    {
        path     : '**',
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        MatIconModule,
        MatOptionModule,
        MatSelectModule,
        MatGridListModule,
        SharedModule
    ],
})

export class DashboardModule
{
}
