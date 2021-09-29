import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {FuseWidgetModule} from "../../../@fuse/components";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {MatSliderModule} from "@angular/material/slider";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatMenuModule} from "@angular/material/menu";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatDividerModule} from "@angular/material/divider";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatBadgeModule} from "@angular/material/badge";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {NgSelectModule} from "@ng-select/ng-select";
import {Ng5SliderModule} from "ng5-slider";
import {FuseSharedModule} from "../../../@fuse/shared.module";
import {ModelsEditorComponent} from "./models-editor.component";
import {MatListModule} from "@angular/material/list";
import {ModelListItemComponent} from "./model-list/model-list-item/model-list-item.component";
import {ModelListComponent} from "./model-list/model-list.component";
import {NgxDnDModule} from "@swimlane/ngx-dnd";
import {ModelsEditorService} from "./models-editor.service";
import {ModelDetailsComponent} from "./model-details/model-details.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {ModelFormModalComponent} from "./model-form-modal/model-form-modal.component";
import {SharedModule} from "../../shared.module";

const bundle = [
    ModelsEditorComponent,
    ModelListComponent,
    ModelListItemComponent,
    ModelDetailsComponent,
    ModelFormModalComponent
];

@NgModule({
    declarations: [...bundle],
    imports: [
        CommonModule,
        TranslateModule,
        // Material moment date module
        MatMomentDateModule,
        NgxDatatableModule,
        FuseWidgetModule,

        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatTooltipModule,
        MatToolbarModule,
        MatRadioModule,
        MatCardModule,
        MatSliderModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatMenuModule,


        // Material
        MatButtonModule,
        MatCheckboxModule,
        MatGridListModule,
        MatDividerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatDialogModule,
        MatDatepickerModule,
        MatProgressSpinnerModule,
        MatButtonToggleModule,
        MatBadgeModule,
        NgxMaterialTimepickerModule,
        NgxDaterangepickerMd.forRoot(),
        NgSelectModule,
        Ng5SliderModule,

        FuseSharedModule,
        MatListModule,
        NgxDnDModule,
        MatSlideToggleModule,
        SharedModule,
    ],
    exports: [...bundle],
    providers: [
        ModelsEditorService
    ],
    entryComponents: [...bundle]

})

export class ModelsEditorModule
{
}