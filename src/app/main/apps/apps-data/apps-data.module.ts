import { NgModule } from '@angular/core';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../../shared.module";
import {AppsDataComponent} from "./apps-data.component";
import {AppsDataSidebarComponent} from "./apps-data-sidebar/apps-data-sidebar.component";
import {MatIconModule} from "@angular/material/icon";
import {GridModule} from "../../grid/grid.module";
import {CommonModule} from "@angular/common";

const routes = [
    {path: '', redirectTo: 'my', pathMatch: 'full'},
    {
        path     : ':tag',
        component: AppsDataComponent,
    },
    {
        path     : '**',
        component: AppsDataComponent,
    },
];

@NgModule({
    declarations: [
        AppsDataComponent,
        AppsDataSidebarComponent
    ],
    exports: [
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        MatIconModule,
        GridModule,
        CommonModule
    ],
    providers: [
    ],
    entryComponents: [
    ]
})

export class AppsDataModule
{
}
