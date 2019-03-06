import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';

import { ConfirmComponent } from 'app/dialogs/confirm/confirm.component';

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
