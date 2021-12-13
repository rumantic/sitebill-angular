import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ModelService} from "../../../_services/model.service";

@Injectable()
export class WhatsAppService {
    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        private modelService: ModelService,
    )
    {
        console.log('WhatsAppService constructor');
    }

    getHostDevice() {
        return this.http.get('http://localhost:3000/api/getHostDevice');
    }
}
