import { Injectable} from '@angular/core';
import {Bitrix24Service} from "../integrations/bitrix24/bitrix24.service";

@Injectable()
export class StorageService {
    constructor(
        protected bitrix24Service: Bitrix24Service,
    ) {
        this.bitrix24Service.init_input_parameters();
    }

    getItem (key: string) {
        //return localStorage.getItem(key);
        //заглушка
        //console.log(this.bitrix24Service);
        if (
            this.bitrix24Service.get_placement_options().get_user_option().get_value('session_key') != null &&
            key === 'currentUser'
        ) {
            //console.log(this.bitrix24Service.get_bitrix24_user_option());
            return this.bitrix24Service.get_bitrix24_user_option();
        } else {
            return localStorage.getItem(key);
        }
    }
}
