import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {ModelService} from '../../../../../_services/model.service';
import {SB_RATE_TYPES, SB_WEEKDAYS, SB_MONTHS} from '../../../classes/sb-calendar.constants';
import {SbRateModel} from '../../../models/sb-rate.model';

class RatesListItem extends SbRateModel {
    isMain = false;

    constructor(data) {
        super(data);
    }
}

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
    ratesList: RatesListItem[] = [];

    @Input() data: any;
    @Output() updateRates = new EventEmitter();

    constructor(
        modelService: ModelService,
    ) {
    }

    ngOnInit() {
        this.initRatesViewList();
    }

    onEditRateClick(rate: SbRateModel) {
        this.currentRateEdit = Object.assign({}, rate);
    }

    onCancelEditRateClick() {
        this.currentRateEdit = null;
    }

    onSaveRateClick() {
        // TODO save here this.currentRateEdit
    }

    initRatesViewList() {
        let mainRateIndex = -1;
        this.ratesList = Object.keys(this.rateTypes).map((type, rateIndex) => {
            const result = new RatesListItem({
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

                if (result.amount > 0) {
                    mainRateIndex = rateIndex;
                }
            }

            return result;
        });

        if (mainRateIndex >= 0) {
            this.ratesList[mainRateIndex].isMain = true;
        }
    }
}
