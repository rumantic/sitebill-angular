import {NgModule} from '@angular/core';

import {CalendarModule, DateAdapter} from 'angular-calendar';
import {CommonModule} from '@angular/common';
import {SbBookingComponent} from './components/sb-booking/sb-booking.component';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {SitebillPipesModule} from '../../pipes/sitebillpipes.module';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule
} from '@angular/material';
import {SbRatesFormComponent} from './components/sb-rates/sb-rates-form/sb-rates-form.component';
import {SbRatesEditDialogComponent} from './components/sb-rates/sb-rates-edit-dialog/sb-rates-edit-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SbCalendarService} from './services/sb-calendar.service';
import {SbCalendarRoutesModule} from './sb-calendar-routes.module';
import {SbBookingPageComponent} from './components/sb-booking-page/sb-booking-page.component';

const bundle = [
    SbBookingComponent,
    SbBookingPageComponent,
    SbRatesFormComponent,
    SbRatesEditDialogComponent,
];

@NgModule({
    imports: [
        CommonModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        FormsModule,
        ReactiveFormsModule,
        SitebillPipesModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatDatepickerModule,
        MatButtonModule,
        MatDialogModule,
        MatTabsModule,
        MatSelectModule,
        MatCheckboxModule,
        MatIconModule,
    ],
    declarations: [...bundle],
    exports: [...bundle],
    providers: [
        SbCalendarService,
    ],
    entryComponents: [
        SbRatesEditDialogComponent,
    ],
})
class CalendarPrivateModule {
}

@NgModule({
    imports: [
        CalendarPrivateModule,
    ],
    exports: [
        ...bundle,
    ],
})
export class SbCalendarModule {
}

@NgModule({
    imports: [
        CalendarPrivateModule,
        SbCalendarRoutesModule,
    ],
    exports: [
        ...bundle,
    ]
})
export class SbCalendarModuleWithRoutes {
}