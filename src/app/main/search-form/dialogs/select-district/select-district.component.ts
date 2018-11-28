import {Component, Inject, OnInit, isDevMode, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Course} from "app/model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import * as moment from 'moment';

import {Model} from 'app/model';
import {ModelService} from 'app/model.service';
import {currentUser} from 'app/_models/currentuser';
import {ChatService} from 'app/main/apps/chat/chat.service';


@Component({
    selector: 'select-district',
    templateUrl: './select-district.component.html',
    styleUrls: ['./select-district.component.css']
})
export class SelectDistrictDialogComponent implements OnInit {

    form: FormGroup;
    formErrors: any;
    declineFormErrors: any;
    comment: any;
    declinePressed: boolean;
    declineProcessing: boolean;
    options: any;

    declineForm: FormGroup;

    description: string;
    @Input() model: Model;
    rows: any[];
    records: any[];
    api_url: string;
    render_value_string_array = ['empty', 'select_box', 'select_by_query', 'select_box_structure', 'date'];
    render_value_array = ['empty', 'textarea_editor', 'safe_string', 'textarea', 'primary_key'];

    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;
    loadingIndicator: boolean;

    @Output() submitEvent = new EventEmitter<string>();

    items = [true, 'Two', 3];
    simpleItems = [true, 'Two', 3];
    district_options: any;
    street_options: any;
    

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<SelectDistrictDialogComponent>,
        private modelService: ModelService,
        private _httpClient: HttpClient,
        private _chatService: ChatService,
        @Inject(MAT_DIALOG_DATA) private _data: any
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

        this.declinePressed = false;
        this.declineProcessing = false;

        this.description = '123';

    }

    ngOnInit() {
        // Horizontal Stepper form steps
        this.declineForm = this.fb.group({
            comment: ['', Validators.required]
        });
        this.load_dictionary('district_id');
        this.load_dictionary('street_id');
    }

    /**
     * On form values changed
     */
    onFormValuesChanged(): void {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if (control && control.dirty && !control.valid) {
                this.formErrors[field] = control.errors;
            }
        }
    }

    decline() {
        console.log('decline');
        console.log(this.declineForm.controls.comment.value);
        const chat_id = this._data.app_name + this._data.key_value;
        console.log(chat_id);
        this.declinePressed = true;
        this.declineProcessing = true;

        // Update the server
        this._chatService.updateDialog(chat_id, 'Причина отказа: ' + this.declineForm.controls.comment.value).then(response => {
            console.log(response);
            if (response.status == 'ok') {
                this.toggleUserGet(this._data.key_value);
                //this.dialog.push(response.comment_data);
            }
            //this.dialog.push(message);

            //this.readyToReply();
        });
    }

    toggleUserGet(client_id) {
        //console.log('user_id');
        //console.log(row.client_id.value);

        const body = {action: 'model', do: 'set_user_id_for_client', client_id: client_id, session_key: this.currentUser.session_key};
        //console.log(body);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.close();
                //this.submitEvent.emit('refresh');
                //console.log(result);
                //this.refreash();
            });

    }

    load_dictionary(columnName) {
        const request = {action: 'model', do: 'load_dictionary', columnName: columnName, session_key: this.currentUser.session_key};

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log('selected > ');
                //console.log(result);
                if (result) {
                    if (columnName == 'district_id' ) {
                        this.district_options = result.data;
                    } else if (columnName == 'street_id' ) {
                        this.street_options = result.data;
                    }
                    //this.load_grid_data(result.selected);
                }
            });
    }
    


    getModel(): void {
        //console.log('get');

        const primary_key = this._data.primary_key;
        const key_value = this._data.key_value;
        const model_name = this._data.app_name;

        //'5725a680b3249760ea21de52'
        this._chatService.getChat(model_name, primary_key, key_value);


        //const PLACEMENT = this.route.snapshot.paramMap.get('PLACEMENT');
        //const PLACEMENT_OPTIONS = this.route.snapshot.paramMap.get('PLACEMENT_OPTIONS');
        //console.log('subscribe PLACEMENT = ' + PLACEMENT + 'PLACEMENT_OPTIONS = ' + PLACEMENT_OPTIONS);

        //console.log(`${this.api_url}/apps/api/rest.php?action=model&do=load_data&session_key=${this.currentUser.session_key}`);

        const load_data_request = {action: 'model', do: 'load_data', model_name: model_name, primary_key: primary_key, key_value: key_value, session_key: this.currentUser.session_key};
        //console.log(load_data_request);


        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, load_data_request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    //this.rows = result.data;
                    this.records = result.data;
                    //console.log('load_data > ');
                    //console.log(result.data);
                    this.rows = Object.keys(result.data);
                    //console.log(Object.keys(this.rows));
                }

            });


        //console.log(this.model);
        //this.model_body = JSON.stringify(this.model);
        //this.model_body = 'test';

    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close();
        this._chatService.closeChat();
    }

}
