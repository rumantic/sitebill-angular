import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatGridListModule,
         MatDividerModule, MatFormFieldModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatDialogModule, MatDatepickerModule,
         MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { FuseSharedModule } from '@fuse/shared.module';
import { CommentService } from 'app/main/documentation/components-third-party/datatable/comment.service';

import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { GoogleMapsModule } from 'app/main/documentation/components-third-party/google-maps/google-maps.module';
import { CourseDialogComponent } from 'app/course-dialog/course-dialog.component';

import { DocsComponentsThirdPartyNgxDatatableComponent } from 'app/main/documentation/components-third-party/datatable/ngx-datatable.component';
import { FilterComponent } from 'app/main/documentation/components-third-party/datatable/filter.component';
import { ProfileTimelineComponent } from 'app/main/documentation/components-third-party/datatable/timeline/timeline.component';

const routes = [
    {
        path     : '',
        component: DocsComponentsThirdPartyNgxDatatableComponent
    },
];

@NgModule({
    declarations: [
        DocsComponentsThirdPartyNgxDatatableComponent,
        FilterComponent,
        ProfileTimelineComponent,
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
        MatProgressSpinnerModule,
        MatTooltipModule,
        

        NgxDatatableModule,

        FuseSharedModule,
        FuseSidebarModule,
        FuseWidgetModule,
        FormsModule,
        NgSelectModule,

        GoogleMapsModule
    ],
    providers   : [
        CommentService
    ],
    entryComponents: [CourseDialogComponent]

})
export class ComponentsThirdPartyModule
{
}
