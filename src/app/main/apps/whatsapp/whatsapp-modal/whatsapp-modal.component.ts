import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SitebillEntity} from "../../../../_models";

@Component({
    selector: 'whatsapp-modal',
    templateUrl: './whatsapp-modal.component.html',
    styleUrls: ['./whatsapp-modal.component.scss']
})
export class WhatsappModalComponent implements OnInit {
    phone_number: any;
    entity: SitebillEntity;

    constructor(
        protected dialog: MatDialog,
        public _matDialog: MatDialog,
        private dialogRef: MatDialogRef<WhatsappModalComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        if ( this._data.entity ) {
            this.entity = this._data.entity;
        } else {
            this.phone_number = this._data.phone;
        }
    }

    ngOnInit(): void {
    }

    close () {
        this.dialogRef.close();
    }

}
