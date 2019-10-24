import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SbBookingPageComponent} from './components/sb-booking-page/sb-booking-page.component';

const calendarRoutes: Routes = [
    {
        path: 'booking/:keyValue',
        component: SbBookingPageComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(calendarRoutes)],
    exports: [RouterModule],
})
export class SbCalendarRoutesModule {
}