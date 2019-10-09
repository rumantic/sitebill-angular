import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SbBookingComponent} from './components/sb-booking/sb-booking.component';

const routes: Routes = [
    {
        path: 'booking',
        component: SbBookingComponent,
    },
    {
        path: '**',
        redirectTo: 'booking',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SbCalendarRoutesModule {
}