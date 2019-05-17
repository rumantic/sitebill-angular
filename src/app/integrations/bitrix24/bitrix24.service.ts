import { Injectable, Inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { Bitrix24Entity } from './bitrix24';


@Injectable()
export class Bitrix24Service {
    private api_url: string = '';
    public entity: Bitrix24Entity;


    constructor(
        private http: HttpClient,
        @Inject(APP_CONFIG) private config: AppConfig,
    ) {
        this.entity = new Bitrix24Entity;

        this.set_api_url(localStorage.getItem('api_url'));
    }

    set_api_url(api_url: string) {
        this.api_url = api_url;
    }

    get_api_url() {

        if (isDevMode() && this.api_url == '') {
            //console.log('dev url');
            return this.config.apiEndpoint;
        } else if (this.api_url == null) {
            return '';
        } else {
            //console.log('prod url');
            return this.api_url;
        }
    }
}