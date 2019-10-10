import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {format, endOfMonth, isSameDay, isSameMonth, startOfMonth} from 'date-fns';
import {Subject} from 'rxjs';
import {ModelService} from '../../../../_services/model.service';
import {SbCalendarHelper} from '../../classes/sb-calendar-helper';

@Component({
    selector: 'sb-booking',
    templateUrl: './sb-booking.component.html',
    styleUrls: [
        '../../../../../../node_modules/angular-calendar/css/angular-calendar.css',
        './sb-booking.component.scss',
    ],
})
export class SbBookingComponent implements OnInit {
    @ViewChild('modalContent') modalContent: TemplateRef<any>;

    view: CalendarView = CalendarView.Month;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [];

    activeDayIsOpen: boolean = true;

    constructor(
        protected modelService: ModelService,
    ) {
    }

    ngOnInit(): void {
        this.initEventsList();
    }

    initEventsList() {
        let start = '';
        let end = '';
        switch (this.view) {
            case CalendarView.Month:
                start = format(startOfMonth(this.viewDate), SbCalendarHelper.dateFormat);
                end = format(endOfMonth(this.viewDate), SbCalendarHelper.dateFormat);
                break;
        }
        this.modelService.get_booking_reservations(start, end).subscribe((result) => {
            this.events = SbCalendarHelper.parseEventsFromBooking(result);
        });
    }

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    eventTimesChanged(
        {
            event,
            newStart,
            newEnd
        }: CalendarEventTimesChangedEvent
    ): void {
        this.events = this.events.map(iEvent => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd
                };
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    }

    handleEvent(action: string, event: CalendarEvent): void {
        console.log(event, action);
        this.modalData = {event, action};
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }
}