import * as moment from 'moment';
import {Moment} from 'moment';

export class SbRateModel {
    rateType: string;
    rateTypeValue: string;
    title: string;

    amount: number;
    id?: string;

    active = true; // active
    day_number?: string | number;
    month_number?: string | number;
    period_start_m?: string | number;
    period_start_d?: string | number;
    period_end_m?: string | number;
    period_end_d?: string | number;

    private seasonStart: Moment;
    private seasonEnd: Moment;

    set season_start(value) {
        this.parseToMoment(value, this.seasonStart);
    }

    get season_start() {
        return this.seasonStart;
    }

    set season_end(value) {
        this.parseToMoment(value, this.seasonEnd);
    }

    get season_end() {
        return this.seasonEnd;
    }

    meta = {
        hasFieldMonth: false,
        hasFieldWeekday: false,
        hasFieldPeriod: false,
        hasFieldSeason: false,
    };

    constructor(data) {
        this.update(data);
    }

    update(data) {
        if (! data) {
            return;
        }

        // TODO put here real object import
        Object.assign(this, data);

        this.setMeta();
    }

    setMeta() {
        if (this.rateType === 'RPERIOD') {
            this.meta.hasFieldPeriod = true;
        } else if (this.rateType === 'RMONTH' || this.rateType === 'SMONTH') {
            this.meta.hasFieldMonth = true;
        } else if (this.rateType === 'RWEEKEND' || this.rateType === 'SWEEKEND') {
            this.meta.hasFieldWeekday = true;
        }

        if (this.rateType[0] === 'S') {
            this.meta.hasFieldSeason = true;
        }
    }

    private parseToMoment(value, prop) {
        if (typeof value === 'object') {
            if (moment.isMoment(value)) {
                prop = value;
            } else if (value instanceof Date) {
                prop = moment(value);
            }
        } else if (typeof value === 'number') {
            prop = moment(value);
        } else if (typeof value === 'string') {
            prop = moment(value);
        }
    }
}