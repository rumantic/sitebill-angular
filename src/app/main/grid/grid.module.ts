import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import {
    MatButtonModule, MatCheckboxModule, MatGridListModule,
    MatDividerModule, MatFormFieldModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatDialogModule, MatDatepickerModule,
    MatProgressSpinnerModule, MatTooltipModule, MatSidenavModule, MatToolbarModule, MatRadioModule, MatCardModule, MatInputModule, MatIconModule, MatSliderModule,
    MatAutocompleteModule, MatButtonToggleModule, MatExpansionModule
} from '@angular/material';
import {
    MatSnackBarModule
} from '@angular/material';


import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { ChatService } from 'app/main/apps/chat/chat.service';
import { ChatComponent } from 'app/main/apps/chat/chat.component';
import { ChatStartComponent } from 'app/main/apps/chat/chat-start/chat-start.component';
import { ChatViewComponent } from 'app/main/apps/chat/chat-view/chat-view.component';
import { ChatChatsSidenavComponent } from 'app/main/apps/chat/sidenavs/left/chats/chats.component';
import { ChatUserSidenavComponent } from 'app/main/apps/chat/sidenavs/left/user/user.component';
import { ChatLeftSidenavComponent } from 'app/main/apps/chat/sidenavs/left/left.component';
import { ChatRightSidenavComponent } from 'app/main/apps/chat/sidenavs/right/right.component';
import { ChatContactSidenavComponent } from 'app/main/apps/chat/sidenavs/right/contact/contact.component';

import { GridComponent } from './grid.component';
import { DataComponent } from './data/data.component';
import { NewsComponent } from './news/news.component';
import { FilterService } from 'app/_services/filter.service';
import { FilterComponent } from 'app/main/grid/filter.component';
import { ProfileTimelineComponent } from 'app/main/grid/timeline/timeline.component';
import { CourseDialogComponent } from 'app/course-dialog/course-dialog.component';
import { ViewModalComponent } from './view-modal/view-modal.component';
import { FormComponent } from './form/form.component';
import { DeclineClientComponent } from 'app/dialogs//decline-client/decline-client.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { ModelService } from 'app/_services/model.service';
import { QuillModule } from 'ngx-quill';

const routes = [
    {
        path     : 'data',
        component: DataComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'news',
        component: NewsComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'client',
        component: GridComponent,
        resolve: {
            chat: ChatService
        },
    }
];

@NgModule({
    declarations: [
        GridComponent,
        DataComponent,
        NewsComponent,
        FilterComponent,
        CourseDialogComponent,
        ViewModalComponent,
        FormComponent,
        ProfileTimelineComponent,
        DeclineClientComponent,
        ChatComponent,
        ChatViewComponent,
        ChatStartComponent,
        ChatChatsSidenavComponent,
        ChatUserSidenavComponent,
        ChatLeftSidenavComponent,
        ChatRightSidenavComponent,
        ChatContactSidenavComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,
        // Material moment date module
        MatMomentDateModule,
        NgxDatatableModule,
        FuseWidgetModule,

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
        MatSliderModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatButtonToggleModule,
        MatExpansionModule,

        NgSelectModule,


        FuseSharedModule,
        QuillModule,
    ],
    providers: [
        FilterService,
        ChatService,
        ModelService,
    ],
    entryComponents: [CourseDialogComponent, DeclineClientComponent, ViewModalComponent, FormComponent]

})

export class GridModule
{
}
