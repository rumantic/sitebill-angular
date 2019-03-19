import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material";

@Component({
    selector: 'snack-bar-component',
    template: '[innerHTML]="_data.message"'
})
export class SnackBarComponent {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA) private _data: any
    ) {
        console.log(_data);
    }

}
