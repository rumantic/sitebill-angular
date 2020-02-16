import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SB_RATE_TYPES, SB_WEEKDAYS, SB_MONTHS } from '../../../classes/sb-calendar.constants';
import { SbRateModel } from '../../../models/sb-rate.model';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { SbCalendarService } from '../../../services/sb-calendar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, takeUntil } from 'rxjs/operators';

class RateFormModel {
    group: FormGroup;
    subscription$: Subscription;
    options: {[name: string]: any};
}

enum SB_RATES_LIST_TYPE {
    edit,
    create,
}

@Component({
    selector: 'sb-rates-form',
    templateUrl: './sb-rates-form.component.html',
    styleUrls: [
        './sb-rates-form.component.scss',
    ],
})
export class SbRatesFormComponent implements OnInit, OnDestroy {

    @Input() data: any;

    formModel: RateFormModel = {
        group: null,
        subscription$: null,
        options: {
            months: SB_MONTHS,
            weekdays: SB_WEEKDAYS,
            days: Array(31).fill(0).map((value, index) => index + 1),
        },
    };
    currentRateEdit: {rate: SbRateModel, list: SB_RATES_LIST_TYPE};

    rateTypes = SB_RATE_TYPES;

    ratesList: SbRateModel[] = []; // RATES_LIST_TYPE.edit
    existingRatesList: SbRateModel[] = []; // RATES_LIST_TYPE.create

    ratesListType = SB_RATES_LIST_TYPE; // for template use

    private readonly destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private calendarService: SbCalendarService,
    ) {
    }

    ngOnInit() {
        this.initRatesViewList();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onEditRateClick(rate: SbRateModel, list: SB_RATES_LIST_TYPE) {
        this.currentRateEdit = {
            rate: Object.assign({}, rate),
            list,
        };
        this.buildRateForm(this.currentRateEdit.rate);
    }

    onCancelEditRateClick() {
        this.currentRateEdit = null;
    }

    onSaveRateClick() {
        if (!this.formModel.group || this.formModel.group.invalid) {
            Object.keys(this.formModel.group.controls).forEach((key) => {
                this.formModel.group.controls[key].markAsTouched();
                this.formModel.group.controls[key].markAsDirty();
            });
            return;
        }

        const model = new SbRateModel(Object.assign({}, this.currentRateEdit.rate));
        model.update(this.formModel.group.value);

        this.calendarService.saveRate(this.data.keyValue, model)
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe((result) => {
                this.calendarService.updateEventsTrigger$.next();
                this.currentRateEdit = null;
                this.initRatesViewList();
            });
    }

    initRatesViewList() {
        if (this.data && this.data.eventsList && Array.isArray(this.data.eventsList)) {
            this.existingRatesList = [];
            this.data.eventsList.forEach((item) => {
                if (item && item.meta && item.meta.rate) {
                    this.existingRatesList.push(item.meta.rate);
                }
            });
        }

        this.ratesList = Object.keys(this.rateTypes).map((rate_type) => {
            return new SbRateModel({
                rate_type,
                amount: 0,
                id: 0,
            });
        });
    }

    private buildRateForm(rate: SbRateModel) {
        const config: {[name: string]: any} = {
            id: [rate.id, []],
            amount: [rate.amount.toString(), [Validators.required, Validators.min(0)]],
            isActive: [rate.isActive, []],
        };

        if (rate.meta.hasFieldSeason) {
            config.season_start = [rate.season_start ? rate.season_start : null, [Validators.required]];
            config.season_end = [rate.season_end ? rate.season_end : null, [Validators.required]];
        }
        if (rate.meta.hasFieldPeriod) {
            config.period_start_m = [rate.period_start_m, [Validators.required]];
            config.period_start_d = [rate.period_start_d, [Validators.required]];
            config.period_end_m = [rate.period_end_m, [Validators.required]];
            config.period_end_d = [rate.period_end_d, [Validators.required]];
        }
        if (rate.meta.hasFieldMonth) {
            config.month_number = [rate.month_number, [Validators.required]];
        }
        if (rate.meta.hasFieldWeekday) {
            config.day_number = [rate.day_number, [Validators.required]];
        }
        this.formModel.group = this.fb.group(config);
    }
}
