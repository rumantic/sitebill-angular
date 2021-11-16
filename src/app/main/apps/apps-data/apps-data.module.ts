import { NgModule } from '@angular/core';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../../shared.module";
import {AppsDataComponent} from "./apps-data.component";
import {AppsDataSidebarComponent} from "./apps-data-sidebar/apps-data-sidebar.component";
import {MatIconModule} from "@angular/material/icon";

const routes = [
    {
        path     : ':memorylist_id',
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
        MatIconModule
    ],
    providers: [
    ],
    entryComponents: [
    ]
})

export class AppsDataModule
{
}
