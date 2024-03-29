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


@Component({
    selector: 'control-elements',
    templateUrl: './control-elements.component.html',
    styleUrls: ['./control-elements.component.css']
})
export class ControlElementsComponent implements OnInit {

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
    
    
    

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private _httpClient: HttpClient,
        @Inject(APP_CONFIG) private config: AppConfig,
        private _fuseConfigService: FuseConfigService,
        protected modelSerivce: ModelService,
        ) {
        this.loadingIndicator = true;
        
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.api_url = this.modelSerivce.get_api_url();

        this.declineFormErrors = {
            comment: {}
        };
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
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
        // Horizontal Stepper form steps
        this.declineForm = this.fb.group({
            comment: ['', Validators.required]
        });
        
        
        this.declineForm.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });
        this.load_item(this.model_name, this.key_value);
        
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

    ngDoCheck() {

        this._fuseConfigService.config
            .subscribe((config) => {
                //this.config = config;
                if (config.layout.navbar.hidden == false ) {
                    this._fuseConfigService.config = {
                        layout: {
                            navbar: {
                                hidden: true
                            },
                            toolbar: {
                                hidden: true
                            },
                            footer: {
                                hidden: true
                            }
                        }
                    };
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
