import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
//import {MatButtonModule, MatIconModule, MatCheckboxModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import { MatButtonModule, MatCheckboxModule, MatGridListModule,
         MatDividerModule, MatFormFieldModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatDialogModule, MatDatepickerModule,
         MatProgressSpinnerModule, MatTooltipModule, MatSidenavModule, MatToolbarModule, MatRadioModule, MatCardModule, MatInputModule, MatIconModule } from '@angular/material';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

// used to create fake backend
//import {fakeBackendProvider} from './_helpers/index';

import { fuseConfig } from 'app/fuse-config';


import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';

import {AlertComponent} from './_directives/index';
import {AuthGuard} from './_guards/index';
//import {JwtInterceptor} from './_helpers/index';
import {AlertService, AuthenticationService, UserService} from './_services/index';

import {DashboardComponent} from './dashboard/dashboard.component';
import {ModelDetailComponent} from './model-detail/model-detail.component';
import {ModelService} from './model.service';
import {MessageService} from './message.service';
import {LoginComponent} from './login/index';
import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AppStoreModule } from 'app/store/store.module';
import { ControlElementsComponent } from 'app/main/control-elements/control-elements.component';
import { SliderComponent } from 'app/main/slider/slider.component';
import {SlideshowModule} from 'ng-simple-slideshow';
import { NguCarouselModule } from '@ngu/carousel';
import { CarouselComponent } from 'app/main/carousel/carousel.component';


//import {LoginModule} from './app/main/pages/authentication/login/login.module';


const appRoutes: Routes = [
    //{ path: '', component: CarouselComponent },
    { path: '', redirectTo: '/client/my', pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]  },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LoginComponent },
    {
        path        : 'pages',
        loadChildren: './main/pages/pages.module#PagesModule',
        canActivate: [AuthGuard]  
    },
    {
        path        : 'control/:model_name/:id/:control_name',
        component: ControlElementsComponent,
        canActivate: [AuthGuard]  
    },
    {
        path        : 'slider',
        component: SliderComponent
    },
    {
        path        : 'client',
        loadChildren: './main/documentation/documentation.module#DocumentationModule',
        canActivate: [AuthGuard]  

    },
];

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ModelDetailComponent,
        ControlElementsComponent,
        SliderComponent,
        CarouselComponent,
        LoginComponent,
        AlertComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        CommonModule,

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

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
        SampleModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule, 
        AppStoreModule
    ],
    exports: [ RouterModule ],
    providers: [
        ModelService,
        MessageService,
        AuthGuard,
        AlertService,
        AuthenticationService,
        // provider used to create fake backend
        //fakeBackendProvider
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
