import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {fuseAnimations} from "../../../../../../../@fuse/animations";

@Component({
    selector: 'attach-modal',
    templateUrl: './attach-modal.component.html',
    styleUrls: ['./attach-modal.component.scss'],
    animations: fuseAnimations
})
export class AttachModalComponent  implements OnInit {
    public link: string;

    onSave = new EventEmitter();

    constructor(
        private dialogRef: MatDialogRef<AttachModalComponent>,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
    }


    ngOnInit() {
    }


    close() {
        this.dialogRef.close();
    }

    save(event) {
        //this.onSave.emit(event);
    }
}
