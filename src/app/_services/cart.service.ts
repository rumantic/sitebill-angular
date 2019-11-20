import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ModelService} from './model.service';

@Injectable()
export class CartService {
    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        private modelSerivce: ModelService,
    )
    {

    }

    get_products() {
        const request = { action: 'cart', do: 'get_products', anonymous: true, session_key: this.modelSerivce.get_session_key_safe() };
        return this.http.post(`${this.modelSerivce.get_api_url()}/apps/api/rest.php`, request);
    }

    add_order (items) {
        const request = { action: 'cart', do: 'add_order', items: items, session_key: this.modelSerivce.get_session_key_safe() };
        return this.http.post(`${this.modelSerivce.get_api_url()}/apps/api/rest.php`, request);
    }

}
