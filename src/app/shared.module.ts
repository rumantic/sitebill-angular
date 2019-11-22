import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RegisterModalComponent} from './login/register-modal/register-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule} from '@angular/material';
import {FuseSharedModule} from '../@fuse/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FuseSharedModule,

    ],
    declarations: [
        RegisterModalComponent
    ],
    exports: [
        RegisterModalComponent
    ]
})
export class SharedModule {

}
