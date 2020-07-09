import { NgModule } from '@angular/core';

import { ConfirmComponent } from 'app/dialogs/confirm/confirm.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
    declarations: [
        ConfirmComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule
    ],
    entryComponents: [
        ConfirmComponent
    ],
})
export class ConfirmDialogModule {
}
