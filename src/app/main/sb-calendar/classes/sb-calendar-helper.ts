import {CalendarEvent} from 'angular-calendar';
import * as moment from 'moment';
import {SB_DATE_FORMAT} from './sb-calendar.constants';

export class SbCalendarHelper {

    static dateFormat = SB_DATE_FORMAT;

    static parseEventsFromBooking(booking): CalendarEvent[] {
        const result: CalendarEvent[] = [];

        if (! booking || !booking.data) {
            return [];
        }

        if (booking.data.reservations && booking.data.reservations.length) {
            booking.data.reservations.forEach((reservation) => {
                result.push({
                    start: moment(reservation.checkin, SB_DATE_FORMAT).toDate(),
                    end: moment(reservation.checkout, SB_DATE_FORMAT).toDate(),
                    allDay: true,
                    title: 'Бронирование ' + reservation.reservation_id,
                    meta: {
                        type: 'booking',
                        reservation: reservation,
                    },
                });
            });
        }

        if (booking.data.rates) {
            const calendarRatesList = Object.keys(booking.data.rates);

            calendarRatesList.forEach((rateDate) => {
                const dayRatesList = booking.data.rates[rateDate];
                if (! dayRatesList.length) {
                    return;
                }
                var mainsetted = false;
                dayRatesList.forEach((rate, index) => {
                    var isMain = false;
                    if(typeof rate.period_start != 'undefined' && rate.period_start != ''){
                        var se = rate.period_start.split('-');
                        if(se.length == 2){
                            rate.period_start_m = se[0].replace(/^(0)/, '');
                            rate.period_start_d = se[1].replace(/^(0)/, '');
                        }
                    }
                    if(typeof rate.period_end != 'undefined' && rate.period_end != ''){
                        var se = rate.period_end.split('-');
                        if(se.length == 2){
                            rate.period_end_m = se[0].replace(/^(0)/, '');
                            rate.period_end_d = se[1].replace(/^(0)/, '');
                        }
                    }
                    if(rate.active == 0){
                        rate.active = false;
                    }else{
                        rate.active = true;
                    }
                    
                    if(!mainsetted && rate.active === true){
                        isMain = true;
                        mainsetted = true;
                    }
                    result.push({
                        start: moment(rateDate, SB_DATE_FORMAT).toDate(),
                        allDay: true,
                        title: `${rate.amount}`,
                        meta: {
                            type: 'rate',
                            isMain: isMain,
                            rate: rate,
                        },
                    });
                });
            });
        }

        return result;
    }


}