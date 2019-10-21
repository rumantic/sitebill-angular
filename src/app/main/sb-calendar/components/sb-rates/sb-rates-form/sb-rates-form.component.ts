import {Component, Input, OnInit} from '@angular/core';
import {SbCalendarHelper} from '../../../classes/sb-calendar-helper';
import {ModelService} from '../../../../../_services/model.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SB_RATE_TYPES, SB_WEEKDAYS, SB_MONTHS} from '../../../classes/sb-calendar.constants';
import {SbRateModel} from '../../../models/sb-rate.model';

export class RatesPeriod {
    start_date: string;
    end_date: string;
}

const MONTH_VALIDATORS = [Validators.min(1), Validators.max(12)];

@Component({
    selector: 'sb-rates-form',
    templateUrl: './sb-rates-form.component.html',
    styleUrls: [
        './sb-rates-form.component.scss',
    ],
})
export class SbRatesFormComponent implements OnInit {

    form = {
        options: {
            months: SB_MONTHS,
            weekdays: SB_WEEKDAYS,
            days: Array(31).map((day) => day + 1),
        },
    };
    currentRateEdit: SbRateModel;

    rateTypes = SB_RATE_TYPES;
    ratesList: SbRateModel[] = [];

    @Input() data: any;

    constructor(
        modelService: ModelService,
    ) {
    }

    ngOnInit() {
        this.initRatesEditForm();
        this.initRatesViewList();
    }

    onEditRateClick(rate: SbRateModel) {
        this.currentRateEdit = Object.assign({}, rate);
    }

    onCancelEditRateClick() {
        this.currentRateEdit = null;
    }

    onSaveRateClick() {

    }

    initRatesEditForm() {

    }

    initRatesViewList() {
        this.ratesList = Object.keys(this.rateTypes).map((type) => {
            const result = new SbRateModel({
                rateType: this.rateTypes[type].rateType,
                rateTypeValue: this.rateTypes[type].rateTypeValue,
                title: this.rateTypes[type].title,
                amount: 0,
            });

            if (this.data && this.data.eventsList) {
                this.data.eventsList.some((e) => {
                    if (e && e.meta && e.meta.type === 'rate' && e.meta.rate && e.meta.rate.rate_type === this.rateTypes[type].rateTypeValue) {
                        result.amount = e.meta.rate.amount;
                    }
                });
            }

            return result;
        });
    }

}
