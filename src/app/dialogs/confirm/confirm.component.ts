import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector   : 'confirm-dialog',
    templateUrl: './confirm.component.html',
    styleUrls  : ['./confirm.component.scss']
})
export class ConfirmComponent
{
    public confirmMessage: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<FuseConfirmDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<ConfirmComponent>
    )
    {
    }

}
