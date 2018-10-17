import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { FuseSharedModule } from '@fuse/shared.module';
import { CommentService } from 'app/main/documentation/components-third-party/datatable/comment.service';

import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { MatButtonModule, MatCheckboxModule, MatGridListModule,
         MatDividerModule, MatFormFieldModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatDialogModule, MatDatepickerModule,
         MatProgressSpinnerModule, MatTooltipModule, MatSidenavModule, MatToolbarModule, MatRadioModule, MatCardModule, MatInputModule, MatIconModule } from '@angular/material';

import { GoogleMapsModule } from 'app/main/documentation/components-third-party/google-maps/google-maps.module';
import { CourseDialogComponent } from 'app/course-dialog/course-dialog.component';
import { DeclineClientComponent } from 'app/dialogs//decline-client/decline-client.component';

import { DocsComponentsThirdPartyNgxDatatableComponent } from 'app/main/documentation/components-third-party/datatable/ngx-datatable.component';
import { FilterComponent } from 'app/main/documentation/components-third-party/datatable/filter.component';
import { ProfileTimelineComponent } from 'app/main/documentation/components-third-party/datatable/timeline/timeline.component';

import { ChatService } from 'app/main/apps/chat/chat.service';
import { ChatComponent } from 'app/main/apps/chat/chat.component';
import { ChatStartComponent } from 'app/main/apps/chat/chat-start/chat-start.component';
import { ChatViewComponent } from 'app/main/apps/chat/chat-view/chat-view.component';
import { ChatChatsSidenavComponent } from 'app/main/apps/chat/sidenavs/left/chats/chats.component';
import { ChatUserSidenavComponent } from 'app/main/apps/chat/sidenavs/left/user/user.component';
import { ChatLeftSidenavComponent } from 'app/main/apps/chat/sidenavs/left/left.component';
import { ChatRightSidenavComponent } from 'app/main/apps/chat/sidenavs/right/right.component';
import { ChatContactSidenavComponent } from 'app/main/apps/chat/sidenavs/right/contact/contact.component';

const routes = [
    {
        path     : '',
        component: DocsComponentsThirdPartyNgxDatatableComponent,
        resolve  : {
            chat: ChatService
        }
    },
];

@NgModule({
    declarations: [
        DocsComponentsThirdPartyNgxDatatableComponent,
        FilterComponent,
        ProfileTimelineComponent,
        CourseDialogComponent,
        DeclineClientComponent,
        ChatComponent,
        ChatViewComponent,
        ChatStartComponent,
        ChatChatsSidenavComponent,
        ChatUserSidenavComponent,
        ChatLeftSidenavComponent,
        ChatRightSidenavComponent,
        ChatContactSidenavComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        NgxDatatableModule,
        
        // Material
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
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
        MatSidenavModule,
        MatToolbarModule,
        MatRadioModule,
        MatCardModule,
        MatInputModule,
        

        FuseSharedModule,
        FuseSidebarModule,
        FuseWidgetModule,
        FormsModule,
        NgSelectModule,

        GoogleMapsModule
    ],
    providers   : [
        CommentService,
        ChatService
    ],
    entryComponents: [CourseDialogComponent, DeclineClientComponent]

})
export class ComponentsThirdPartyModule
{
}
