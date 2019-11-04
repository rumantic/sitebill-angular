import {Component, Input, OnInit} from '@angular/core';
import {SB_RATE_TYPES, SB_WEEKDAYS, SB_MONTHS} from '../../../classes/sb-calendar.constants';
import {SbRateModel} from '../../../models/sb-rate.model';
import {Observable, of, Subscription} from 'rxjs';
import {SbCalendarService} from '../../../services/sb-calendar.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

class RatesListItem extends SbRateModel {
    isMain = false;

    constructor(data) {
        super(data);
    }
}

class RateFormModel {
    group: FormGroup;
    subscription$: Subscription;
    options: { [name: string]: any };
}

@Component({
    selector: 'sb-rates-form',
    templateUrl: './sb-rates-form.component.html',
    styleUrls: [
        './sb-rates-form.component.scss',
    ],
})
export class SbRatesFormComponent implements OnInit {

    formModel: RateFormModel = {
        group: null,
        subscription$: null,
        options: {
            months: SB_MONTHS,
            weekdays: SB_WEEKDAYS,
            days: Array(31).fill(0).map((value, index) => index + 1),
        },
    };
    currentRateEdit: SbRateModel;

    rateTypes = SB_RATE_TYPES;
    ratesList: RatesListItem[] = [];

    @Input() data: any;

    constructor(
        private fb: FormBuilder,
        private calendarService: SbCalendarService,
    ) {
    }

    ngOnInit() {
        this.initRatesViewList();
    }

    onEditRateClick(rate: SbRateModel) {
        this.currentRateEdit = Object.assign({}, rate);
        this.buildRateForm(this.currentRateEdit);
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
        
        const model = new SbRateModel(Object.assign({}, this.currentRateEdit, this.formModel.group.value));
        
        this.saveRate(this.data.keyValue, model).subscribe((result) => {
            this.data.eventsList = result;
            this.currentRateEdit = null;
            this.calendarService.updateEvents$.emit();
            this.initRatesViewList();
        });
    }

    initRatesViewList() {
        let mainRateIndex = -1;
        this.ratesList = Object.keys(this.rateTypes).map((type, rateIndex) => {
            const result = new RatesListItem({
                rateType: this.rateTypes[type].rateType,
                rateTypeValue: this.rateTypes[type].rateTypeValue,
                title: this.rateTypes[type].title,
                amount: 0,
                id: 0
            });

            if (this.data && this.data.eventsList) {
                this.data.eventsList.some((e) => {
                    if (e && e.meta && e.meta.type === 'rate' && e.meta.rate && e.meta.rate.rate_type === this.rateTypes[type].rateTypeValue) {
                        result.amount = e.meta.rate.amount;
                        result.id = e.meta.rate.id;
                        result.day_number = e.meta.rate.day_number;
                        result.month_number = e.meta.rate.month_number;
                    }
                });

                if (result.amount > 0) {
                    mainRateIndex = rateIndex;
                }
            }

            return result;
        });
console.log(this.ratesList);
        if (mainRateIndex >= 0) {
            this.ratesList[mainRateIndex].isMain = true;
        }
    }

    private buildRateForm(rate: SbRateModel) {
        
        const config: { [name: string]: any } = {
            id: [rate.id, []],
            amount: [rate.amount.toString(), [Validators.required, Validators.min(0)]],
            active: [rate.active, []],
        };
        if (rate.meta.hasFieldSeason) {
            config.season_start = [rate.season_start ? rate.season_start.valueOf() : null, [Validators.required]];
            config.season_end = [rate.season_end ? rate.season_end.valueOf() : null, [Validators.required]];
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
        // this.initRateFormSubscription(rate);
    }

    private initRateFormSubscription(rate: SbRateModel) {
        if (!this.formModel.group) {
            return;
        }

        if (this.formModel.subscription$ instanceof Subscription) {
            this.formModel.subscription$.unsubscribe();
        }

        this.formModel.subscription$ = this.formModel.group.valueChanges.subscribe((value) => {
            if (rate.meta.hasFieldSeason) {
                if (!value || !value.season_start) {
                    this.formModel.group.controls['season_end'].disable();
                } else {
                    this.formModel.group.controls['season_end'].enable();
                    this.formModel.group.controls['season_end'].setValidators([Validators.required, Validators.min(value.season_start)]);
                }
            }
            if (rate.meta.hasFieldPeriod) {
                if (!value || !value.period_start_m || !value.period_start_d) {
                    this.formModel.group.controls['period_end_m'].disable();
                    this.formModel.group.controls['period_end_d'].disable();
                } else {
                    this.formModel.group.controls['period_end_m'].enable();
                    this.formModel.group.controls['period_end_d'].enable();
                    this.formModel.group.controls['period_end_m'].setValidators([Validators.required, Validators.min(value.period_start_m)]);
                    if (value.period_start_m === value.period_end_m) {
                        this.formModel.group.controls['period_end_d'].setValidators([Validators.required, Validators.min(value.period_start_d)]);
                    } else {
                        this.formModel.group.controls['period_end_d'].setValidators([Validators.required]);
                    }
                }
            }
        });
    }

    private saveRate(keyValue, model: SbRateModel): Observable<any> {
        
        this.calendarService.edit_rate(keyValue, model);
        
        //const body = {action: 'reservation', do: 'calender_data', id: this.data.keyValue, session_key: this.get_session_key_safe()};
        //return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
        
        // TODO save rate here, return events list for current day
        const result = [...this.data.eventsList];

        return of(result);
    }
}
