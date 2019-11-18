import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ModelService} from '../../../_services/model.service';

@Injectable()
export class SbCalendarService {
    updateEvents$ = new EventEmitter();
    
    constructor(
        private http: HttpClient,
        private modelService: ModelService,
    ) {
    
    }
    
    get_booking_reservations(key_value, start_date, end_date) {
        const body = {action: 'reservation', do: 'calender_data', id: key_value, start: start_date, end: end_date, session_key: this.modelService.get_session_key_safe()};
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, body);
    }
    
    create_rate(object_id, params) {
        console.log('create');
        console.log(object_id);
        console.log(params);
        //const body = {action: 'reservation', do: 'rate_edit', id: rate_id, session_key: modelService.get_session_key_safe()};
        //return this.http.post(`${modelService.get_api_url()}/apps/api/rest.php`, body);
    }
    
    edit_rate(object_id, rate_id, params) {
        /*console.log('edit');
        console.log(rate_id);
        console.log(object_id);
        console.log(params);
        
        
        console.log(params.season_start.toDate());
        console.log(params.season_start.format('YYYY-MM-DD'));
        */
        
        
        var r = {
            month_number: (typeof params.month_number != 'undefined' ? params.month_number : 0),
            day_number: (typeof params.day_number != 'undefined' ? params.day_number : 0),
            period_start: (typeof params.period_start != 'undefined' ? params.period_start : ''),
            period_end: (typeof params.period_end != 'undefined' ? params.period_end : ''),
            season_start: params.season_start.format('YYYY-MM-DD'),
            season_end: params.season_end.format('YYYY-MM-DD'),
            amount: params.amount
        };
        //console.log(r);
        
        
        const body = {action: 'reservation', do: 'rate_edit', id: rate_id, data: r, object_id: object_id, session_key: this.modelService.get_session_key_safe()};
        //console.log(body);
        //console.log(this.modelService.get_api_url());
        console.log('send request');
        //this.http.post(`${this.modelService.get_api_url()}/apps/api/rest1.php`, body)
        //console.log(this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, body));
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest1.php`, body);
    }
}