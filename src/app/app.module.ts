import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';
import {AppConfigModule} from './app.config.module';


import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import {AuthGuard} from "./_guards";
import {ModelService} from "./_services/model.service";
import {PublicGuard} from "./_guards/public.guard";
import {MessageService} from "./message.service";
import {AlertService, AuthenticationService} from "./_services";
import {FilterIterator, FilterService} from "./_services/filter.service";
import {SnackService} from "./_services/snack.service";
import {Bitrix24Router} from "./integrations/bitrix24/bitrix24router";
import {SnackBarComponent} from "./main/snackbar/snackbar.component";
import {CalculatorMiniComponent} from "./main/calculator-mini/calculator-mini.component";
import {MortgageCalculatorComponent} from "./main/mortgage-calculator/mortgage-calculator.component";
import {SharedModule} from "./shared.module";
import {LoginComponent} from "./login";
import {ControlElementsComponent} from "./main/control-elements/control-elements.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDividerModule} from "@angular/material/divider";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatMenuModule} from "@angular/material/menu";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AlertComponent} from "./_directives";
import {Error404Component} from "./main/pages/errors/404/error-404.component";
import {Error500Component} from "./main/pages/errors/500/error-500.component";

const appRoutes: Routes = [
    {path: '', component: CalculatorMiniComponent},
    {
        path: 'calculator',
        component: MortgageCalculatorComponent
    },
    {
        path: 'calculator-mini',
        component: CalculatorMiniComponent
    },
];

@NgModule({
    declarations: [
        AppComponent,
        MortgageCalculatorComponent,
        CalculatorMiniComponent,
        Bitrix24Router,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {useHash: true, onSameUrlNavigation: 'reload'}),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
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

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SharedModule,
        AppConfigModule,
    ],
    providers: [
        MessageService,
        AuthGuard,
        ModelService,
        PublicGuard,
        AlertService,
        AuthenticationService,
        FilterIterator,
        FilterService,
        SnackService,
        Bitrix24Router
        // provider used to create fake backend
        // fakeBackendProvider
    ],
    entryComponents: [AppComponent, CalculatorMiniComponent, MortgageCalculatorComponent],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
