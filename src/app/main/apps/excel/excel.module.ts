import { NgModule } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {ExcelComponent} from "./excel.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ExcelModalComponent} from "./modal/excel-modal.component";
import {MatButtonModule} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";
import {NgxUploaderModule} from "ngx-uploader";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        ExcelComponent,
        ExcelModalComponent
    ],
    exports: [
    ],
    imports: [
        MatIconModule,
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        FlexModule,
        NgxUploaderModule,
        NgxDatatableModule,
        NgSelectModule,
        FormsModule,
    ],
    providers: [
    ],
    entryComponents: [
    ]
})

export class ExcelModule
{
}
