import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ModelService} from "../../../_services/model.service";

@Injectable()
export class HouseSchemaService {
    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        private modelService: ModelService,
    ) {

    }

    get_schema(complex_id: number) {
        const request = { action: 'complex', do: 'get_schema', complex_id: complex_id, anonymous: true, session_key: this.modelService.get_session_key_safe() };
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, request);
    }

}