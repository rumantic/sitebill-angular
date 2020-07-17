import {Component, Inject, OnInit, Input, Output, EventEmitter }  from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {Model} from 'app/model';
import { ChatService } from 'app/main/apps/chat/chat.service';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';


@Component({
    selector: 'report-dialog',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
    favoriteSeason: string;

    seasons = [
        'Winter',
        'Spring',
        'Summer',
        'Autumn',
    ];

    form: FormGroup;
    formErrors: any;
    declineFormErrors: any;
    comment: any;
    declinePressed: boolean;
    declineProcessing: boolean;

    declineForm: FormGroup;

    description:string;
    @Input() model: Model;
    rows: any[];
    records: any[];
    api_url: string;

    private _unsubscribeAll: Subject<any>;
    loadingIndicator: boolean;

    @Output() submitEvent = new EventEmitter<string>();




    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ReportComponent>,
        private _httpClient: HttpClient,
        public modelService: ModelService,
        private _chatService: ChatService,
        @Inject(APP_CONFIG) private config: AppConfig,
        @Inject(MAT_DIALOG_DATA) private _data: any
        ) {
        this.loadingIndicator = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();

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

        console.log(this.modelService.getConfigValue('apps.mailbox.complaint_mode_variants'));


        this.declineForm.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
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
        this.declinePressed = true;
        this.declineProcessing = true;

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
    }

    toggleUserGet ( client_id ) {
        //console.log('user_id');
        //console.log(row.client_id.value);

        const body = { action: 'model', do: 'set_user_id_for_client', client_id: client_id, session_key: this.modelService.get_session_key() };
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
