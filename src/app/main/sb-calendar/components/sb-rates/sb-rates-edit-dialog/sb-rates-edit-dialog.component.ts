import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
    templateUrl: 'sb-rates-edit-dialog.component.html',
    styleUrls: [
        'sb-rates-edit-dialog.component.scss',
    ]
})
export class SbRatesEditDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }
}