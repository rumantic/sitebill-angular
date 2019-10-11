import {NgModule} from '@angular/core';

import {CalendarModule, DateAdapter} from 'angular-calendar';
import {CommonModule} from '@angular/common';
import {SbBookingComponent} from './components/sb-booking/sb-booking.component';
import {SbCalendarRoutesModule} from './sb-calendar-routes.module';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {SitebillPipesModule} from '../../pipes/sitebillpipes.module';

const bundle = [
    SbBookingComponent,
];

@NgModule({
    imports: [
        CommonModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        SitebillPipesModule,
        // SbCalendarRoutesModule,
    ],
    declarations: [...bundle],
    exports: [...bundle],
    providers: [],
})
export class SbCalendarModule {
}