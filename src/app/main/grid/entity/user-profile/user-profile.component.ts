import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {SitebillEntity} from '../../../../_models';
import {ModelService} from '../../../../_services/model.service';
import {FilterService} from '../../../../_services/filter.service';

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    animations: fuseAnimations
})
export class UserProfileComponent  implements OnInit {
    valid_domain_through_email: FormGroup;
    loading = false;
    show_login: boolean;
    private entity: SitebillEntity;
    form_compose_columns: any[];
    private composeForm: FormGroup;
    public compose_form_complete: boolean;
    options_storage = {};
    options_storage_titles = [];
    dictionary_loaded = [];
    clear_enable: boolean;

    @Input("user_id")
    user_id: number;


    constructor(
        protected modelService: ModelService,
        private _formBuilder: FormBuilder,
        private filterService: FilterService,
        protected cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.valid_domain_through_email = this._formBuilder.group({
            domain_checker: ['', [Validators.required, Validators.email]],
        });
        this.show_login = true;

    }

    ngOnInit() {
        this.entity = this._data.entity;
    }

}
