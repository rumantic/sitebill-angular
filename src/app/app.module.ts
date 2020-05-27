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
import {FilterService} from "./_services/filter.service";
import {SnackService} from "./_services/snack.service";
import {Bitrix24Router} from "./integrations/bitrix24/bitrix24router";
import {SnackBarComponent} from "./main/snackbar/snackbar.component";
import {SearchFormComponent} from "./main/search-form/search-form.component";
import {CalculatorMiniComponent} from "./main/calculator-mini/calculator-mini.component";
import {MortgageCalculatorComponent} from "./main/mortgage-calculator/mortgage-calculator.component";
import {SelectDistrictDialogComponent} from "./main/search-form/dialogs/select-district/select-district.component";
import {SharedModule} from "./shared.module";
import {Error404Component} from "./main/pages/errors/404/error-404.component";
import {LoginComponent} from "./login";
import {ControlElementsComponent} from "./main/control-elements/control-elements.component";
import {AnkonsulSearchFormComponent} from "./main/search-form/ankonsul/ankonsul.search-form.component";
import {CarouselComponent} from "./main/carousel/carousel.component";
import {SliderComponent} from "./main/slider/slider.component";

const appRoutes: Routes = [
    {path: '', redirectTo: 'frontend', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'logout', component: LoginComponent},
    {
        path: 'control/:model_name/:id/:control_name',
        component: ControlElementsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'slider',
        component: SliderComponent
    },
    {
        path: 'search',
        component: SearchFormComponent
    },
    {
        path: 'searchankonsul',
        component: AnkonsulSearchFormComponent
    },
    {
        path: 'carousel',
        component: CarouselComponent
    },
    {
        path: 'calculator',
        component: MortgageCalculatorComponent
    },
    {
        path: 'calculator-mini',
        component: CalculatorMiniComponent
    },
    {
        path: 'sample',
        loadChildren: 'app/main/sample/sample.module#SampleModule'
    },
    {
        path: 'grid',
        loadChildren: 'app/main/grid/grid.module#GridModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'public',
        loadChildren: 'app/main/grid/grid.module#GridModule',
        canActivate: [PublicGuard],
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'facebook',
        loadChildren: 'app/main/facebook/facebook.module#FacebookModule'
    },
    {
        path: 'vk',
        loadChildren: 'app/main/vk/vk.module#VkModule'
    },
    {
        path: 'profile',
        loadChildren: 'app/main/profile/profile.module#ProfileModule',
        canActivate: [PublicGuard],
    },
    {
        path: 'frontend',
        loadChildren: 'app/main/frontend/frontend.module#FrontendModule'
    },
    {
        path: 'dashboard',
        loadChildren: 'app/main/dashboard/dashboard.module#DashboardModule',
        canActivate: [PublicGuard],
    },
    {
        path: 'cart/:step/:item_id',
        loadChildren: 'app/main/cart/cart.module#CartModule'
    },
    {
        path: 'cart/:step',
        loadChildren: 'app/main/cart/cart.module#CartModule'
    },
    {
        path: 'calendar',
        loadChildren: 'app/main/sb-calendar/sb-calendar.module#SbCalendarModuleWithRoutes',
    },
    /*
    {
        path: 'client/my',
        component: DocsComponentsThirdPartyNgxDatatableComponent,
        //component: './main/documentation/documentation.module#DocumentationModule',
        canActivate: [AuthGuard],
        resolve: {
            chat: ChatService
        }

    },
    */
    {
        path: '**',
        component: Error404Component
    }
];

@NgModule({
    declarations: [
        AppComponent,
        SnackBarComponent,
        Bitrix24Router,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule,
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
        FilterService,
        SnackService,
        Bitrix24Router
        // provider used to create fake backend
        // fakeBackendProvider
    ],
    entryComponents: [AppComponent, SnackBarComponent],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
