import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SendCallbackBundle} from "../types/whatsapp.types";

@Component({
    selector: 'report-modal',
    templateUrl: './report-modal.component.html',
    styleUrls: ['./report-modal.component.scss']
})
export class ReportModalComponent implements OnInit {
    sendCallbackBundle: SendCallbackBundle;
    public client_fields: {};

    constructor(
        protected dialog: MatDialog,
        public _matDialog: MatDialog,
        private dialogRef: MatDialogRef<ReportModalComponent>,
        @Inject(MAT_DIALOG_DATA) public _data: SendCallbackBundle
    ) {
        this.sendCallbackBundle = this._data;
        this.client_fields = {};
        this.client_fields['company'] = true;
        this.client_fields['fio'] = true;
        this.client_fields['phone'] = true;
        this.client_fields['email'] = true;
    }

    ngOnInit(): void {
    }

    close () {
        this.dialogRef.close();
    }

}
