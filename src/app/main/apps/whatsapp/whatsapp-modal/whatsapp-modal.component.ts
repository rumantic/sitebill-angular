import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'whatsapp-modal',
    templateUrl: './whatsapp-modal.component.html',
    styleUrls: ['./whatsapp-modal.component.scss']
})
export class WhatsappModalComponent implements OnInit {
    phone_number: any;

    constructor(
        protected dialog: MatDialog,
        public _matDialog: MatDialog,
        private dialogRef: MatDialogRef<WhatsappModalComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        console.log(this._data);
        this.phone_number = this._data.phone;
    }

    ngOnInit(): void {
    }

    close () {
        this.dialogRef.close();
    }

}
