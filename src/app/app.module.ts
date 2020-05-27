import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {
    MatSnackBarModule
} from '@angular/material/snack-bar';


import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';

import 'hammerjs';

import {FuseModule} from '@fuse/fuse.module';
import {FuseSharedModule} from '@fuse/shared.module';
import {FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule} from '@fuse/components';
import {FuseWidgetModule} from '@fuse/components/widget/widget.module';

import {fuseConfig} from 'app/fuse-config';
import {AppConfigModule} from './app.config.module';
import {FilterService} from 'app/_services/filter.service';


import {AppComponent} from 'app/app.component';
import {LayoutModule} from 'app/layout/layout.module';

import {AlertComponent} from './_directives/index';
import {AuthGuard} from './_guards/index';
import {PublicGuard} from './_guards/public.guard';
import {AlertService, AuthenticationService} from './_services/index';

import {MessageService} from './message.service';
import {LoginComponent} from './login/index';
import {FakeDbService} from 'app/fake-db/fake-db.service';
import {AppStoreModule} from 'app/store/store.module';
import {ControlElementsComponent} from 'app/main/control-elements/control-elements.component';
import {SliderComponent} from 'app/main/slider/slider.component';
import {SlideshowModule} from 'ng-simple-slideshow';
import {NguCarouselModule} from '@ngu/carousel';
import {SitebillPipesModule} from 'app/pipes/sitebillpipes.module';

import {CarouselComponent} from 'app/main/carousel/carousel.component';


import {SelectDistrictDialogComponent} from 'app/main/search-form/dialogs/select-district/select-district.component';

import {MortgageCalculatorComponent} from 'app/main/mortgage-calculator/mortgage-calculator.component';
import {CalculatorMiniComponent} from 'app/main/calculator-mini/calculator-mini.component';
import {SearchFormComponent} from 'app/main/search-form/search-form.component';
import {AnkonsulSearchFormComponent} from 'app/main/search-form/ankonsul/ankonsul.search-form.component';
import {Ng5SliderModule} from 'ng5-slider';

import {Error404Component} from 'app/main/pages/errors/404/error-404.component';
import {Error500Component} from 'app/main/pages/errors/500/error-500.component';
import {ModelService} from 'app/_services/model.service';
import {SnackService} from './_services/snack.service';
import {SnackBarComponent} from './main/snackbar/snackbar.component';
import {Bitrix24Router} from './integrations/bitrix24/bitrix24router';
import {SharedModule} from './shared.module';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTableModule} from "@angular/material/table";
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

/*
const appRoutes: Routes = [
    //{ path: '', component: CarouselComponent },
    { path: '', redirectTo: 'calculator', pathMatch: 'full' },
    {
        path        : 'calculator',
        component: MortgageCalculatorComponent
    },
    {
        path      : '**',
        component: Error404Component
    }
];

const appRoutes: Routes = [
    //{ path: '', component: CarouselComponent },
    { path: '', redirectTo: 'carousel', pathMatch: 'full' },
    {
        path        : 'carousel',
        component: CarouselComponent
    },
    {
        path      : '**',
        component: Error404Component
    }
];
*/


@NgModule({
    declarations: [
        AppComponent,
        ControlElementsComponent,
        SliderComponent,
        CarouselComponent,
        LoginComponent,
        AlertComponent,
        SelectDistrictDialogComponent,
        MortgageCalculatorComponent,
        CalculatorMiniComponent,
        Error404Component,
        Error500Component,
        SearchFormComponent,
        AnkonsulSearchFormComponent,
        SnackBarComponent,
        Bitrix24Router,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {useHash: true, onSameUrlNavigation: 'reload'}),
        // RouterModule.forRoot(appRoutes),
        CommonModule,

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,
        FuseWidgetModule,

        // Material
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

        SlideshowModule,
        NguCarouselModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        FuseProgressBarModule,

        // App modules
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        AppStoreModule,
        Ng5SliderModule,
        AppConfigModule,
        SitebillPipesModule,
        SharedModule
    ],
    exports: [RouterModule, MatSnackBarModule],
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
    entryComponents: [AppComponent, SelectDistrictDialogComponent, MortgageCalculatorComponent, CalculatorMiniComponent, SearchFormComponent, SnackBarComponent]
})
export class AppModule {
    ngDoBootstrap(app) {
        console.log('test');
        app.bootstrap(AppComponent);
        if (document.getElementById('calculator_mini_root')) {
            app.bootstrap(CalculatorMiniComponent);
        }
        if (document.getElementById('calculator_root')) {
            app.bootstrap(MortgageCalculatorComponent);
        }
        if (document.getElementById('angular_search')) {
            app.bootstrap(SearchFormComponent);
        }
        if (document.getElementById('angular_search_ankonsul')) {
            app.bootstrap(AnkonsulSearchFormComponent);
        }
    }

}
