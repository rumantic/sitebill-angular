import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { RegisterComponent } from './register.component';
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

const routes = [
    {
        path     : '**',
        component: RegisterComponent
    }
];

@NgModule({
    declarations: [
        RegisterComponent
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

        FuseSharedModule
    ]
})

export class RegisterModule
{
}
