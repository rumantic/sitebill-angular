import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material/snack-bar";

@Component({
    selector: 'snack-bar-component',
    templateUrl: './snackbar.component.html'
})
export class SnackBarComponent {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public _data: any,
        public snackBarRef: MatSnackBarRef<SnackBarComponent>

    ) {
    }

}
