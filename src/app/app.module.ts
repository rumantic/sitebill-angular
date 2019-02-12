import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {
    MatButtonModule, MatCheckboxModule, MatGridListModule,
    MatDividerModule, MatFormFieldModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatDialogModule, MatDatepickerModule,
    MatProgressSpinnerModule, MatTooltipModule, MatSidenavModule, MatToolbarModule, MatRadioModule, MatCardModule, MatInputModule, MatIconModule, MatSliderModule,
    MatAutocompleteModule, MatButtonToggleModule, MatExpansionModule
} from '@angular/material';
import {
    MatSnackBarModule
} from '@angular/material';

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
import { FilterService } from 'app/_services/filter.service';



import {AppComponent} from 'app/app.component';
import {LayoutModule} from 'app/layout/layout.module';

import {AlertComponent} from './_directives/index';
import {AuthGuard} from './_guards/index';
import {AlertService, AuthenticationService} from './_services/index';

import {ModelDetailComponent} from './model-detail/model-detail.component';
import {ModelService} from './model.service';
import {MessageService} from './message.service';
import {LoginComponent} from './login/index';
import {FakeDbService} from 'app/fake-db/fake-db.service';
import {AppStoreModule} from 'app/store/store.module';
import {ControlElementsComponent} from 'app/main/control-elements/control-elements.component';
import {SliderComponent} from 'app/main/slider/slider.component';
import {SlideshowModule} from 'ng-simple-slideshow';
import {NguCarouselModule} from '@ngu/carousel';

import {CarouselComponent} from 'app/main/carousel/carousel.component';



import {SelectDistrictDialogComponent} from 'app/main/search-form/dialogs/select-district/select-district.component';

import {MortgageCalculatorComponent} from 'app/main/mortgage-calculator/mortgage-calculator.component';
import {CalculatorMiniComponent} from 'app/main/calculator-mini/calculator-mini.component';
import {SearchFormComponent} from 'app/main/search-form/search-form.component';
import {AnkonsulSearchFormComponent} from 'app/main/search-form/ankonsul/ankonsul.search-form.component';
import { HighlightPipe } from 'app/pipes/highlight-pipe';
import { EscapeHtmlPipe } from 'app/pipes/keep-html.pipe';
import {Ng5SliderModule} from 'ng5-slider';

import {Error404Component} from 'app/main/pages/errors/404/error-404.component';
import {Error500Component} from 'app/main/pages/errors/500/error-500.component';

const appRoutes: Routes = [
    //{path: '', component: CalculatorMiniComponent },
    //{path: '', redirectTo: 'client/my', pathMatch: 'full', canActivate: [AuthGuard]},
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
        path: 'facebook',
        loadChildren: 'app/main/facebook/facebook.module#FacebookModule'
    },
    {
        path: 'vk',
        loadChildren: 'app/main/vk/vk.module#VkModule'
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
        ModelDetailComponent,
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
        HighlightPipe,
        EscapeHtmlPipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {useHash: true}),
        //RouterModule.forRoot(appRoutes),
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
        AppConfigModule
    ],
    exports: [RouterModule, MatSnackBarModule],
    providers: [
        ModelService,
        MessageService,
        AuthGuard,
        AlertService,
        AuthenticationService,
        FilterService
        // provider used to create fake backend
        //fakeBackendProvider
    ],
    entryComponents: [AppComponent,  SelectDistrictDialogComponent, MortgageCalculatorComponent, CalculatorMiniComponent, SearchFormComponent]
})
export class AppModule {
    ngDoBootstrap(app) {
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