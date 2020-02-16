import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {endOfMonth, format, isSameDay, isSameMonth, startOfMonth} from 'date-fns';
import {Subject} from 'rxjs';
import {ModelService} from '../../../../_services/model.service';
import {SbCalendarHelper} from '../../classes/sb-calendar-helper';
import {MatDialog} from '@angular/material';
import {SbRatesEditDialogComponent} from '../sb-rates/sb-rates-edit-dialog/sb-rates-edit-dialog.component';
import {SB_EVENTS_STATE, SB_RATE_TYPES} from '../../classes/sb-calendar.constants';
import {SbCalendarService} from '../../services/sb-calendar.service';
import {takeUntil, tap} from 'rxjs/operators';
import {SbRatesEditDialogDataModel} from '../../models/sb-rates-edit-dialog-data.model';

@Component({
    selector: 'sb-booking',
    templateUrl: './sb-booking.component.html',
    styleUrls: [
        '../../../../../../node_modules/angular-calendar/css/angular-calendar.css',
        './sb-booking.component.scss',
    ],
})
export class SbBookingComponent implements OnInit, OnDestroy {
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

    activeDayIsOpen = true;

    private readonly destroy$ = new Subject<void>();

    constructor(
        protected modelService: ModelService,
        public editRatesDialog: MatDialog,
        public calendarService: SbCalendarService,
    ) {
    }

    ngOnInit(): void {
        this.initEventsSubscription();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    initEventsList() {
        this.fetchEvents();
    }

    initEventsSubscription() {
        this.calendarService.updateEventsTrigger$
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe(() => {
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
    ) {

        const events = this.calendarService.events.map((item) => {
            if (item === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd
                };
            }
            return item;
        });

        this.calendarService.events$.next(events);
    }

    closeOpenMonthViewDay(event, newStart, newEnd) {
        this.activeDayIsOpen = false;
        this.fetchEvents();
    }

    onEditRatesClick(event, viewDate, keyValue) {
        const data: SbRatesEditDialogDataModel = {
            event,
            viewDate,
            keyValue
        };

        const dialogRef = this.editRatesDialog.open(SbRatesEditDialogComponent, {
            data,
            panelClass: 'rates-edit-dialog',
        });

        dialogRef.afterClosed().subscribe((result) => {
            // console.log(result);
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
        this.calendarService.getBookingReservations(this.keyValue, start, end)
            .pipe(
                tap(() => this.calendarService.eventsState$.next(SB_EVENTS_STATE.loading)),
                takeUntil(this.destroy$),
            )
            .subscribe((result) => {
                this.calendarService.events$.next(SbCalendarHelper.parseEventsFromBooking(result));
                this.calendarService.eventsState$.next(SB_EVENTS_STATE.ready);
            }, () => {
                this.calendarService.eventsState$.next(SB_EVENTS_STATE.error);
            });
    }
}