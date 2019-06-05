import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import {
    MatButtonModule, MatCheckboxModule, MatGridListModule,
    MatDividerModule, MatFormFieldModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatDialogModule, MatDatepickerModule,
    MatProgressSpinnerModule, MatTooltipModule, MatSidenavModule, MatToolbarModule, MatRadioModule, MatCardModule, MatInputModule, MatIconModule, MatSliderModule,
    MatAutocompleteModule, MatButtonToggleModule, MatExpansionModule, MatBadgeModule, MAT_DATE_LOCALE
} from '@angular/material';
import {
    MatSnackBarModule
} from '@angular/material';


import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { ConfirmDialogModule } from 'app/dialogs/confirm/confirm.module';
import { ChatService } from 'app/main/apps/chat/chat.service';
import { SnackService } from 'app/_services/snack.service';
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
import { CountryComponent } from './entity/country/country.component';
import { MyClientComponent } from './entity/lead/myclient.component';
import { FreeClientComponent } from './entity/lead/freeclient.component';
import { LeadComponent } from './entity/lead/lead.component';
import { RegionComponent } from './entity/region/region.component';
import { FilterService } from 'app/_services/filter.service';
import { FilterComponent } from 'app/main/grid/filter.component';
import { ProfileTimelineComponent } from 'app/main/grid/timeline/timeline.component';
import { CourseDialogComponent } from 'app/course-dialog/course-dialog.component';
import { ViewModalComponent } from './view-modal/view-modal.component';
import { FormComponent } from './form/form.component';
import { DeclineClientComponent } from 'app/dialogs//decline-client/decline-client.component';
import { GridSettingsSidenavComponent } from 'app/main/grid/sidenavs/settings/settings.component';
import { CommonTemplateComponent } from 'app/main/grid/common-template/common-template.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';

import { NgxUploaderModule } from 'ngx-uploader';
import { UploaderComponent } from 'app/main/uploader/uploader.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { GalleryComponent } from 'app/main/gallery/gallery.component';
import { Ng5SliderModule } from 'ng5-slider';
import { ReplacePipe } from 'app/pipes/replace.pipe';
import { UserComponent } from './user/user.component';
import { AgmCoreModule } from '@agm/core';
import { CityComponent } from './entity/city/city.component';
import { DistrictComponent } from './entity/district/district.component';
import { MetroComponent } from './entity/metro/metro.component';
import { StreetComponent } from './entity/street/street.component';
import { GalleryModalComponent } from '../gallery/modal/gallery-modal.component';
import { GroupComponent } from './entity/group/group.component';
import { ComponentComponent } from './entity/component/component.component';
import { FunctionComponent } from './entity/function/function.component';
import { PageComponent } from './entity/page/page.component';
import { MenuComponent } from './entity/menu/menu.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CollectionsComponent } from '../collections/collections.component';
import { Bitrix24Service } from 'app/integrations/bitrix24/bitrix24.service';
import {MemoryListComponent} from '../collections/memorylist.component';


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
        path: 'page',
        component: PageComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'menu',
        component: MenuComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'country',
        component: CountryComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'region',
        component: RegionComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'city',
        component: CityComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'district',
        component: DistrictComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'metro',
        component: MetroComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'street',
        component: StreetComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'user',
        component: UserComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'group',
        component: GroupComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'component',
        component: ComponentComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'function',
        component: FunctionComponent,
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
    },
    {
        path: 'collections',
        component: CollectionsComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'lead',
        component: LeadComponent,
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
        MyClientComponent,
        FreeClientComponent,
        LeadComponent,
        MenuComponent,
        PageComponent,
        CountryComponent,
        RegionComponent,
        CityComponent,
        DistrictComponent,
        MetroComponent,
        StreetComponent,
        GroupComponent,
        ComponentComponent,
        FunctionComponent,
        UserComponent,
        FilterComponent,
        CourseDialogComponent,
        ViewModalComponent,
        GalleryModalComponent,
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
        UploaderComponent,
        GalleryComponent,
        FormComponent,
        GridSettingsSidenavComponent,
        ReplacePipe,
        CommonTemplateComponent,
        CollectionsComponent,
        MemoryListComponent,
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
        MatBadgeModule,
        NgxMaterialTimepickerModule,
        NgxDaterangepickerMd.forRoot(),
        NgSelectModule,
        Ng5SliderModule,

        FuseSharedModule,
        QuillModule,
        NgxUploaderModule,
        NgxGalleryModule,
        ConfirmDialogModule,
        DragDropModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAIujOA0HllbFQKc7rXEoAXbsAQ-2whqzQ'
        })
    ],
    exports: [
        NgxUploaderModule
    ],
    providers: [
        FilterService,
        ChatService,
        CommonTemplateComponent,
        SnackService,
        Bitrix24Service,
        { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    ],
    entryComponents: [CourseDialogComponent, DeclineClientComponent, ViewModalComponent, GalleryModalComponent, FormComponent, CommonTemplateComponent]

})

export class GridModule
{
}
