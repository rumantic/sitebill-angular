import {Component, Inject, OnInit, Input, Output, EventEmitter }  from '@angular/core';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

import {Model} from 'app/model';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';
import {SnackService} from "../../_services/snack.service";
import {SitebillEntity} from "../../_models";
import {LoginModalComponent} from "../../login/modal/login-modal.component";


@Component({
    selector: 'demo-banner',
    templateUrl: './demo-banner.component.html',
    styleUrls: ['./demo-banner.component.css']
})
export class DemoBannerComponent implements OnInit {
    form: FormGroup;
    dialogFormErrors: any;
    comment: any;
    description:string;
    @Input() model: Model;
    @Input() data: SitebillEntity;

    private _unsubscribeAll: Subject<any>;
    loadingIndicator: boolean;

    @Output() submitEvent = new EventEmitter<string>();




    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<DemoBannerComponent>,
        protected dialog: MatDialog,
        public modelService: ModelService,
        @Inject(APP_CONFIG) private config: AppConfig,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        protected _snackService: SnackService,
        ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
    }


    login() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'login-form';
        this.dialogRef.close();
        this.dialog.open(LoginModalComponent, dialogConfig);
    }

    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close();
    }

}
