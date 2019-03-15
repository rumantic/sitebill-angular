import {Component, Inject, OnInit, isDevMode, ViewEncapsulation, Input }  from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";

import { ChatService } from 'app/main/apps/chat/chat.service';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';


@Component({
    selector: 'view-modal',
    templateUrl: './view-modal.component.html',
    styleUrls: ['./view-modal.component.css']
})
export class ViewModalComponent implements OnInit {

    form: FormGroup;
    rows: any[];
    records: any[];
    api_url: string;
    render_value_string_array = ['empty','select_box','select_by_query', 'select_box_structure', 'date'];
    render_value_array = ['empty','textarea_editor', 'safe_string', 'textarea', 'primary_key'];
    
    private _unsubscribeAll: Subject<any>;
    loadingIndicator: boolean;
    
    

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ViewModalComponent>,
        private _httpClient: HttpClient,
        private modelSerivce: ModelService,
        private _chatService: ChatService,
        @Inject(APP_CONFIG) private config: AppConfig,
        @Inject(MAT_DIALOG_DATA) private _data: any
        ) {
        this.loadingIndicator = true;
        
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        if (isDevMode()) {
            this.api_url = this.config.apiEndpoint;
        } else {
            this.api_url = '';
        }

    }

    ngOnInit() {
        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
            });
        
        this.getModel();
    }

    getModel(): void {
        const primary_key = this._data.primary_key;
        const key_value = this._data.key_value;
        const model_name = this._data.app_name;
        
        this._chatService.getChat(model_name, primary_key, key_value);
        

        this.modelSerivce.loadById(model_name, primary_key, key_value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    this.records = result.data;
                    this.rows = Object.keys(result.data);
                }

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
