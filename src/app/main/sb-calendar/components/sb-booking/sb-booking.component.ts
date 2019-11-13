import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {format, endOfMonth, isSameDay, isSameMonth, startOfMonth} from 'date-fns';
import {Subject} from 'rxjs';
import {ModelService} from '../../../../_services/model.service';
import {SbCalendarHelper} from '../../classes/sb-calendar-helper';
import {MatDialog} from '@angular/material';
import {SbRatesEditDialogComponent} from '../sb-rates/sb-rates-edit-dialog/sb-rates-edit-dialog.component';
import {SB_RATE_TYPES} from '../../classes/sb-calendar.constants';
import {SbCalendarService} from '../../services/sb-calendar.service';

@Component({
    selector: 'sb-booking',
    templateUrl: './sb-booking.component.html',
    styleUrls: [
        '../../../../../../node_modules/angular-calendar/css/angular-calendar.css',
        './sb-booking.component.scss',
    ],
})
export class SbBookingComponent implements OnInit {
    @Input('keyValue') set setKeyValue(value) {
        if (!value) {
            return;
        }
        this.keyValue = value;
        this.initEventsList();
        
    }

    @ViewChild('modalContent') modalContent: TemplateRef<any>;

    keyValue: string;

    view: CalendarView = CalendarView.Month;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

    refresh: Subject<any> = new Subject();

    rateTypes = SB_RATE_TYPES;

    events: CalendarEvent[] = [];

    activeDayIsOpen = true;

    constructor(
        protected modelService: ModelService,
        public editRatesDialog: MatDialog,
        private calendarService: SbCalendarService,
    ) {
    }

    ngOnInit(): void {
        this.initEventsSubscription();
    }

    initEventsList() {
        this.fetchEvents();
    }

    initEventsSubscription() {
        this.calendarService.updateEvents$.subscribe(() => {
            this.fetchEvents();
        });
    }

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) {
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
    }

    closeOpenMonthViewDay(event, newStart, newEnd) {
        this.activeDayIsOpen = false;
        this.fetchEvents();
    }

    onEditRatesClick(eventsList, viewDate, keyValue) {
        const data = {
            eventsList,
            date: viewDate,
            keyValue: keyValue
        };

        const dialogRef = this.editRatesDialog.open(SbRatesEditDialogComponent, {
            data,
            panelClass: 'rates-edit-dialog',
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    private fetchEvents() {
        let start = '';
        let end = '';
        switch (this.view) {
            case CalendarView.Month:
                start = format(startOfMonth(this.viewDate), SbCalendarHelper.dateFormat);
                end = format(endOfMonth(this.viewDate), SbCalendarHelper.dateFormat);
                break;
        }
        this.calendarService.get_booking_reservations(this.keyValue, start, end).subscribe((result) => {
            this.events = SbCalendarHelper.parseEventsFromBooking(result);
        });
        
    }
}