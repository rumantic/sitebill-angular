import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelService } from './model.service';

@Injectable()
export class ConfigService {

    constructor(
        private http: HttpClient,
        protected modelService: ModelService,
    ) {}

    system_config() {
        let body = {};
        body = {action: 'config', do: 'system_config', session_key: this.modelService.get_session_key_safe()};
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, body);
    }



    update_system_config( qlItems: any ) {
        let body = {};
        body = {
            action: 'config',
            do: 'update',
            ql_items: qlItems,
            session_key: this.modelService.get_session_key_safe()
        };
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, body);
    }


}
