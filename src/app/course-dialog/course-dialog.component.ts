import {Component, Inject, OnInit, isDevMode, ViewEncapsulation, Input }  from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';

import {Model} from '../model';
import {ModelService} from '../model.service';
import {currentUser} from '../_models/currentuser';


@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

    form: FormGroup;
    description:string;
    @Input() model: Model;
    rows: any[];
    records: any[];
    api_url: string;
    
    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;
    loadingIndicator: boolean;
    
    

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        private modelService: ModelService,
        private _httpClient: HttpClient,
        
        @Inject(MAT_DIALOG_DATA) {}:Course ) {
        this.loadingIndicator = true;
        
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        if (isDevMode()) {
            this.api_url = 'http://genplan1';
        } else {
            this.api_url = '';
        }
        
        this.records = [
       {
            "Name" : "Alfreds Futterkiste",
            "Country" : "Germany"
        },{
            "Name" : "Berglunds snabbköp",
            "Country" : "Sweden"
        },{
            "Name" : "Centro comercial Moctezuma",
            "Country" : "Mexico"
        },{
            "Name" : "Ernst Handel",
            "Country" : "Austria"
        }
        ];

        this.description = '123';

    }

    ngOnInit() {
        this.getModel();
    }

    getModel(): void {
        const id = 506;
        //const PLACEMENT = this.route.snapshot.paramMap.get('PLACEMENT');
        //const PLACEMENT_OPTIONS = this.route.snapshot.paramMap.get('PLACEMENT_OPTIONS');
        //console.log('subscribe PLACEMENT = ' + PLACEMENT + 'PLACEMENT_OPTIONS = ' + PLACEMENT_OPTIONS);
        
        console.log(`${this.api_url}/apps/api/rest.php?action=model&do=load_data&session_key=${this.currentUser.session_key}`);

        const load_data_request = {action: 'model', do: 'load_data', id: id, session_key: this.currentUser.session_key};
        
        console.log(this.records);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, load_data_request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                console.log('load_data > ');
                if (result) {
                    //this.rows = result.data;
                    this.rows = Object.keys(result.data);
                    console.log(Object.keys(this.rows));
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
        this.dialogRef.close();
    }

}
