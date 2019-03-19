import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material";

@Component({
    selector: 'snack-bar-component',
    templateUrl: './snackbar.component.html'
})
export class SnackBarComponent {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA) private _data: any,
        public snackBarRef: MatSnackBarRef<SnackBarComponent>

    ) {
    }

}
