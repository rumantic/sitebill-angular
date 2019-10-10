import {CalendarEvent} from 'angular-calendar';
import * as moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

export class SbCalendarHelper {

    static dateFormat = DATE_FORMAT;

    static parseEventsFromBooking(booking): CalendarEvent[] {
        const result: CalendarEvent[] = [];

        if (! booking || !booking.data) {
            return [];
        }

        if (booking.data.reservations && booking.data.reservations.length) {
            booking.data.reservations.forEach((reservation) => {
                result.push({
                    start: moment(reservation.checkin, DATE_FORMAT).toDate(),
                    end: moment(reservation.checkout, DATE_FORMAT).toDate(),
                    allDay: true,
                    title: 'Бронирование ' + reservation.reservation_id,
                    meta: {
                        type: 'booking',
                        reservation_id: reservation.reservation_id,
                    },
                });
            });
        }

        if (booking.data.rates) {
            const ratesList = Object.keys(booking.data.rates);

            ratesList.forEach((rateDate) => {
                const rate = booking.data.rates[rateDate][0];
                result.push({
                    start: moment(rateDate, DATE_FORMAT).toDate(),
                    allDay: true,
                    title: `${rate.amount}`,
                    meta: {
                        type: 'rate',
                        rate_type: rate.type,
                    },
                });
            });
        }

        return result;
    };
}