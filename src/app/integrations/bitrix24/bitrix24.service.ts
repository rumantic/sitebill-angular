import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bitrix24Entity, Bitrix24PlacementOptions } from './bitrix24';
import { DOCUMENT } from '@angular/platform-browser';


@Injectable()
export class Bitrix24Service {
    public entity: Bitrix24Entity;
    private placement_options: Bitrix24PlacementOptions;
    private access_token: string;
    private domain: string;
    private placement: string;
    private collections_count: number;
    private app_root_element: any;

    constructor(
        private http: HttpClient,
        @Inject(DOCUMENT) private document: any,
    ) {
        this.collections_count = 0;
        this.entity = new Bitrix24Entity;
        this.placement_options = new Bitrix24PlacementOptions;
    }

    get_client() {
        console.log('get client');
        const url = `https://${this.get_domain()}/rest/crm.contact.get.json`;

        const login_request = { id: this.placement_options.get_id(), auth: this.get_access_token() };

        return this.http.post<any>(url, login_request);
    }
    set_domain(_domain: string) {
        this.domain = _domain;
    }

    get_domain() {
        if ( this.domain === null || this.domain === undefined ) {
            return 'localhost';
        }
        return this.domain;
    }

    set_access_token(_access_token: string) {
        this.access_token = _access_token;
    }

    get_access_token() {
        return this.access_token;
    }

    set_placement(_placement: string) {
        this.placement = _placement;
    }

    get_placement() {
        return this.placement;
    }

    get_placement_options_id() {
        return this.placement_options.get_id();
    }

    get_collections_count() {
        return this.collections_count;
    }

    set_collections_count( count:number ) {
        this.collections_count = count;
    }

    get_deal_id() {
        this.reload_placement_option_id();
        // console.log('this.placement_options.get_id() = ' + this.placement_options.get_id());
        if ( this.placement_options.get_id() === null ) {
            return 1;
        }
        return this.placement_options.get_id();
    }

    reload_placement_option_id () {
        try {
            let placement_options = this.app_root_element.getAttribute('bitrix24_placement_options').replace(/\'/g, '"');
            console.log(this.app_root_element.getAttribute('bitrix24_placement_options'));
            console.log(placement_options);
            if (placement_options != null) {
                let placement_options_parsed = JSON.parse(placement_options);
                console.log('placement_options_parsed.ID = ' + placement_options_parsed.ID);
                this.placement_options.set_id(placement_options_parsed.ID);
            }
        } catch (e) {
            // console.log(e);
        }
    }

    init_input_parameters() {
        let app_root_element;
        let elements = [];
        if (this.document.getElementById('angular_search')) {
            app_root_element = this.document.getElementById('angular_search');
        } else if (this.document.getElementById('angular_search_ankonsul')) {
            app_root_element = this.document.getElementById('angular_search_ankonsul');
        } else if (this.document.getElementById('app_root')) {
            app_root_element = this.document.getElementById('app_root');
        }
        this.app_root_element = app_root_element;

        if (app_root_element.getAttribute('bitrix24_access_token')) {
            this.set_access_token(app_root_element.getAttribute('bitrix24_access_token'));
        }
        if (app_root_element.getAttribute('bitrix24_domain')) {
            this.set_domain(app_root_element.getAttribute('bitrix24_domain'));
        }
        if (app_root_element.getAttribute('bitrix24_placement')) {
            this.placement = app_root_element.getAttribute('bitrix24_placement');
        }
        if (app_root_element.getAttribute('bitrix24_placement_options')) {
            try {
                let placement_options = app_root_element.getAttribute('bitrix24_placement_options').replace(/\'/g, '"');
                console.log(placement_options);
                if (placement_options != null) {
                    let placement_options_parsed = JSON.parse(placement_options);
                    this.placement_options.set_id(placement_options_parsed.ID);
                }
            } catch {
            }
        }

        //console.log(this.access_token);
        //console.log(this.domain);
        //console.log(this.placement);
        //console.log(this.placement_options);


    }
}