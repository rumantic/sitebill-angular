import { NgModule } from '@angular/core';
import {SharedModule} from "../../../shared.module";
import {MatIconModule} from "@angular/material/icon";
import {GridModule} from "../../grid/grid.module";
import {CommonModule} from "@angular/common";
import {ExcelComponent} from "./excel.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ExcelModalComponent} from "./modal/excel-modal.component";
import {MatButtonModule} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";
import {NgxUploaderModule} from "ngx-uploader";

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
    ],
    providers: [
    ],
    entryComponents: [
    ]
})

export class ExcelModule
{
}
