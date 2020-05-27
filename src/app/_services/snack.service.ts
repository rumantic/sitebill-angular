import { Injectable } from '@angular/core';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SnackBarComponent } from 'app/main/snackbar/snackbar.component';


@Injectable()
export class SnackService {
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(
        public snackBar: MatSnackBar,
    ) {
    }

    message(message: string, duration = 3000) {
        this.snackBar.openFromComponent(SnackBarComponent, {
            duration: duration,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            data: { message: message },
        });
    }
}
