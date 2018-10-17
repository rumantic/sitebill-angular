import {Component, Inject, OnInit, isDevMode, ViewEncapsulation, Input, Output, EventEmitter }  from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {FuseConfigService} from '@fuse/services/config.service';
import {ActivatedRoute} from '@angular/router';

import {Model} from 'app/model';
import {ModelService} from 'app/model.service';
import {currentUser} from 'app/_models/currentuser';


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
        private modelService: ModelService,
        private _httpClient: HttpClient,
        private _fuseConfigService: FuseConfigService,
        ) {
        this.loadingIndicator = true;
        
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        if (isDevMode()) {
            this.api_url = 'http://genplan1';
        } else {
            this.api_url = '';
        }
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
            active = 0;
        }
        const ql_items = {active: active};
        const body = {action: 'model', do: 'graphql_update', model_name: this.model_name, key_value: this.key_value, ql_items: ql_items, session_key: this.currentUser.session_key};
        
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((response: any) => {
                //console.log(response);
                this.load_item(this.model_name, this.key_value);
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
        const body = {action: 'model', do: 'load_data', model_name: this.model_name, key_value: this.key_value, session_key: this.currentUser.session_key};
        
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((response: any) => {
                //console.log(response);
                if ( response.data ) {
                    
                    //Проверим что объект принадлежит пользователю
                    if ( response.data['user_id']['value'] == this.currentUser.user_id ) {
                        this.item = response.data;
                        this.current_active_value = this.item['active']['value'];
                    }
                    //console.log(this.item);
                    //console.log(this.item['active']['value']);
                }
                this.controlProcessing = false;
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
    
    decline () {
        console.log('decline');
        console.log(this.declineForm.controls.comment.value);
        const chat_id = this._data.app_name + this._data.key_value;
        console.log(chat_id);
        this.controlPressed = true;
        this.controlProcessing = true;
        
        /*
        // Update the server
        this._chatService.updateDialog(chat_id, 'Причина отказа: ' + this.declineForm.controls.comment.value).then(response => {
            console.log(response);
            if ( response.status == 'ok' ) {
                this.toggleUserGet(this._data.key_value);
                //this.dialog.push(response.comment_data);
            }
            //this.dialog.push(message);
            
            //this.readyToReply();
        });
        */
    }
    
    toggleUserGet ( client_id ) {
        //console.log('user_id');
        //console.log(row.client_id.value);
        
        const body = {action: 'model', do: 'set_user_id_for_client', client_id: client_id, session_key: this.currentUser.session_key};
        //console.log(body);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
            });
        
    }
    
}
