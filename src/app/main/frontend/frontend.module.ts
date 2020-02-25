import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { FrontendComponent } from './frontend.component';
import {
    MatAutocompleteModule,
    MatButtonModule, MatButtonToggleModule, MatCardModule,
    MatCheckboxModule, MatDatepickerModule, MatDialogModule,
    MatDividerModule, MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule, MatInputModule,
    MatMenuModule, MatProgressSpinnerModule, MatRadioModule,
    MatSelectModule, MatSidenavModule, MatSliderModule, MatSnackBarModule,
    MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {GridModule} from '../grid/grid.module';
import {PriceComponent} from './price.component';
import {BillingService} from '../../_services/billing.service';
import {LoginModalComponent} from '../../login/modal/login-modal.component';
import {RegisterModalComponent} from '../../login/register-modal/register-modal.component';
import {SharedModule} from '../../shared.module';
import {PageComponent} from './page/page.component';

const routes = [
    {
        path     : 'prices',
        component: PriceComponent
    },
    {
        path     : 'content/:slug',
        component: PageComponent
    },
    {
        path     : '**',
        component: FrontendComponent
    },
];

@NgModule({
    declarations: [
        FrontendComponent,
        PriceComponent,
        PageComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatGridListModule,
        MatDividerModule,
        MatFormFieldModule,
        MatMenuModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatDialogModule,
        MatDatepickerModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatSidenavModule,
        MatToolbarModule,
        MatRadioModule,
        MatCardModule,
        MatInputModule,
        MatSliderModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatButtonToggleModule,
        MatExpansionModule,
        GridModule,
        FuseSharedModule,
        SharedModule
    ],
    providers: [
        BillingService
    ]
})

export class FrontendModule
{
}
