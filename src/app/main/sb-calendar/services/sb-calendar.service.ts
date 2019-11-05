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
        console.log('edit');
        console.log(rate_id);
        console.log(object_id);
        console.log(params);
        //const body = {action: 'reservation', do: 'rate_edit', id: rate_id, session_key: modelService.get_session_key_safe()};
        //return this.http.post(`${modelService.get_api_url()}/apps/api/rest.php`, body);
    }
}