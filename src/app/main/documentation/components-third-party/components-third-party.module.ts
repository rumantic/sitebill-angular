import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatGridListModule,
         MatDividerModule, MatFormFieldModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatDialogModule, MatDatepickerModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { GoogleMapsModule } from 'app/main/documentation/components-third-party/google-maps/google-maps.module';
import { CourseDialogComponent } from 'app/course-dialog/course-dialog.component';

import { DocsComponentsThirdPartyNgxDatatableComponent } from 'app/main/documentation/components-third-party/datatable/ngx-datatable.component';

const routes = [
    {
        path     : '',
        component: DocsComponentsThirdPartyNgxDatatableComponent
    }
];

@NgModule({
    declarations: [
        DocsComponentsThirdPartyNgxDatatableComponent,
        CourseDialogComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatGridListModule,
        MatDividerModule,
        MatFormFieldModule,
        MatMenuModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatDialogModule,
        MatDatepickerModule,
        

        NgxDatatableModule,

        FuseSharedModule,
        FuseSidebarModule,
        FuseWidgetModule,
        FormsModule,
        NgSelectModule,

        GoogleMapsModule
    ],
    entryComponents: [CourseDialogComponent]

})
export class ComponentsThirdPartyModule
{
}
