import {Component, Inject, OnInit, isDevMode, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Course} from "app/model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FilterService} from 'app/main/documentation/components-third-party/datatable/filter.service';

import {Model} from 'app/model';
import {currentUser} from 'app/_models/currentuser';


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

    dialogForm: FormGroup;

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
        private _httpClient: HttpClient,
        private filterService: FilterService,
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
        this.dialogForm = this.fb.group({
            district_id: [''],
            street_id: [''],
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


    load_dictionary(columnName) {
        const request = {action: 'model', do: 'load_dictionary', columnName: columnName, anonymous: true,session_key: this.currentUser.session_key};

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log('selected > ');
                console.log(result);
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


    save() {
        console.log(this.dialogForm.controls.district_id.value);
        console.log(this.dialogForm.controls.street_id.value);
        //this.filterService.announceMission(this.dialogForm.controls.district_id.value);
        this.filterService.save(this.dialogForm.controls);

        this.dialogRef.close();
    }

    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close();
    }

}
