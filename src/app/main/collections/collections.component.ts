import {Component, Inject, OnInit, isDevMode, ViewEncapsulation, Input, Output, EventEmitter }  from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {FuseConfigService} from '@fuse/services/config.service';
import {ActivatedRoute} from '@angular/router';

import {Model} from 'app/model';
import {currentUser} from 'app/_models/currentuser';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';
import { DOCUMENT } from '@angular/platform-browser';
import { Bitrix24PlacementOptions } from 'app/_models/bitrix24';


@Component({
    selector: 'collections',
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

    form: FormGroup;
    formErrors: any;
    declineFormErrors: any;
    comment: any;
    controlPressed: boolean;
    controlProcessing: boolean;
    key_value: any;
    model_name: any;
    control_name: any;
    item_model: any[];
    item: any[];
    current_active_value: any;
    
    declineForm: FormGroup;
    
    description:string;
    @Input() model: Model;
    rows: any[];
    records: any[];
    api_url: string;
    
    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;
    loadingIndicator: boolean;
    
    @Output() submitEvent = new EventEmitter<string>();

    bitrix24_access_token: string;
    bitrix24_domain: string;
    bitrix24_placement_options: Bitrix24PlacementOptions;
    bitrix24_placement: string;
    response: any;
    
    
    

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private http: HttpClient,
        @Inject(DOCUMENT) private document: any,
        @Inject(APP_CONFIG) private config: AppConfig,
        private _fuseConfigService: FuseConfigService,
        protected modelSerivce: ModelService,
        ) {
        this.loadingIndicator = true;
        this.bitrix24_placement_options = new Bitrix24PlacementOptions;
        
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.api_url = this.modelSerivce.get_api_url();

        this.declineFormErrors = {
            comment: {}
        };
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: false
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                }
            }
        };
        
        this.model_name = this.route.snapshot.paramMap.get('model_name');
        this.control_name = this.route.snapshot.paramMap.get('control_name');
        this.key_value = this.route.snapshot.paramMap.get('id');
        
        
        this.controlPressed = false;
        this.controlProcessing = true;

        this.description = '123';

    }
    
    toggle_active () {
        this.controlProcessing = true;
        
        let active =  1;
        if (this.item['active']['value'] == 1)  {
            active = null;
        }
        const ql_items = { active: active };

        this.modelSerivce.update_only_ql(this.model_name, this.key_value, ql_items)
            .subscribe((response: any) => {
                if (response.state == 'error') {
                } else {
                    this.load_item(this.model_name, this.key_value);
                }
            });
        
    }

    ngOnInit() {
        //this.test_bitrix24();
        this.init_input_parameters();
        console.log(this.bitrix24_access_token);
        console.log(this.bitrix24_domain);
        console.log(this.bitrix24_placement);
        console.log(this.bitrix24_placement_options);
        this.get_client();
    }

    get_client() {
        console.log('get client');
        const url = `https://${this.bitrix24_domain}/rest/crm.contact.get.json`;

        const login_request = { id: this.bitrix24_placement_options.getId(), auth: this.bitrix24_access_token };

        return this.http.post<any>(url, login_request)
            .subscribe((response: any) => {
                this.response = response;
                console.log(response);
            });

    }

    test_bitrix24() {
        console.log('test bitrix24');
        const url = `https://sitebill.bitrix24.ru/rest/crm.contact.list.json`;

        const login_request = { auth: '4aa4db5c003c0c920012cb6b0000000140380302af9a24976261bcfb545d7189756814'};

        return this.http.post<any>(url, login_request)
            .subscribe((response: any) => {
                console.log(response);
            });

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
        if (app_root_element.getAttribute('bitrix24_access_token')) {
            this.bitrix24_access_token = app_root_element.getAttribute('bitrix24_access_token');
        }
        if (app_root_element.getAttribute('bitrix24_domain')) {
            this.bitrix24_domain = app_root_element.getAttribute('bitrix24_domain');
        }
        if (app_root_element.getAttribute('bitrix24_placement')) {
            this.bitrix24_placement = app_root_element.getAttribute('bitrix24_placement');
        }
        if (app_root_element.getAttribute('bitrix24_placement_options')) {
            try {
                let placement_options = app_root_element.getAttribute('bitrix24_placement_options').replace(/\'/g, '"');
                console.log(placement_options);
                if (placement_options != null) {
                    let placement_options_parsed = JSON.parse(placement_options);
                    this.bitrix24_placement_options.setId(placement_options_parsed.ID);
                }
            } catch {
            }
        }

    }

    
    load_item ( model_name, key_value ) {
        //const body = { action: 'model', do: 'load_data', model_name: this.model_name, key_value: this.key_value, session_key: this.modelSerivce.get_session_key()};

        this.modelSerivce.loadById(model_name, 'id', key_value)
            .subscribe((response: any) => {
                if (response.state == 'error') {
                } else {
                    //console.log(this.currentUser.user_id);
                    if (response.data) {

                        //Проверим что объект принадлежит пользователю
                        if (response.data['user_id']['value'] == this.modelSerivce.get_user_id()) {
                            this.item = response.data;
                            this.current_active_value = this.item['active']['value'];
                        }
                        //console.log(this.item);
                        //console.log(this.item['active']['value']);
                    }
                    this.controlProcessing = false;
                }
            });


    }



    
    /**
     * On form values changed
     */
    onFormValuesChanged(): void
    {
        for ( const field in this.formErrors )
        {
            if ( !this.formErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.formErrors[field] = control.errors;
            }
        }
    }
}
