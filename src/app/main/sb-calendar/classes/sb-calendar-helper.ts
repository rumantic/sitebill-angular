import { CalendarEvent } from 'angular-calendar';
import * as moment from 'moment';
import { SB_DATE_FORMAT } from './sb-calendar.constants';
import { SbRateModel } from '../models/sb-rate.model';

export class SbCalendarHelper {

    static dateFormat = SB_DATE_FORMAT;

    static parseEventsFromBooking(booking): CalendarEvent[] {
        const result: CalendarEvent[] = [];

        if (!booking || !booking.data) {
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
                if (!dayRatesList.length) {
                    return;
                }
                dayRatesList.forEach((rate, index) => {
                    result.push({
                        start: moment(rateDate, SB_DATE_FORMAT).toDate(),
                        allDay: true,
                        title: `${ rate.amount }`,
                        meta: {
                            type: 'rate',
                            isMain: index === 0,
                            rate: new SbRateModel(rate),
                        },
                    });
                });
            });
        }

        return result;
    }


}