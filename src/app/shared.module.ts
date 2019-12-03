import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RegisterModalComponent} from './login/register-modal/register-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    MAT_DATE_LOCALE,
    MatAutocompleteModule, MatBadgeModule,
    MatButtonModule, MatButtonToggleModule, MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule, MatDialogModule, MatDividerModule, MatExpansionModule,
    MatFormFieldModule, MatGridListModule, MatIconModule,
    MatInputModule, MatMenuModule, MatOptionModule,
    MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSnackBarModule, MatTableModule,
    MatTabsModule,
    MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {FuseSharedModule} from '../@fuse/shared.module';
import {LoginModalComponent} from './login/modal/login-modal.component';
import {RouterModule} from '@angular/router';
import {FormComponent} from './main/grid/form/form.component';
import {GalleryModalComponent} from './main/gallery/modal/gallery-modal.component';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {NgxGalleryModule} from 'ngx-gallery';
import {NgxUploaderModule} from 'ngx-uploader';
import {UploaderComponent} from './main/uploader/uploader.component';
import {GalleryComponent} from './main/gallery/gallery.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {QuillModule} from 'ngx-quill';
import {AgmCoreModule} from '@agm/core';
import {SbCalendarModule} from './main/sb-calendar/sb-calendar.module';
import {FuseWidgetModule} from '../@fuse/components';
import {ViewModalComponent} from './main/grid/view-modal/view-modal.component';
import {ProfileTimelineComponent} from './main/grid/timeline/timeline.component';
import {ChatComponent} from './main/apps/chat/chat.component';
import {ChatViewComponent} from './main/apps/chat/chat-view/chat-view.component';
import {ChatStartComponent} from './main/apps/chat/chat-start/chat-start.component';
import {ChatChatsSidenavComponent} from './main/apps/chat/sidenavs/left/chats/chats.component';
import {ChatUserSidenavComponent} from './main/apps/chat/sidenavs/left/user/user.component';
import {ChatLeftSidenavComponent} from './main/apps/chat/sidenavs/left/left.component';
import {ChatRightSidenavComponent} from './main/apps/chat/sidenavs/right/right.component';
import {ChatContactSidenavComponent} from './main/apps/chat/sidenavs/right/contact/contact.component';
import {ChatService} from './main/apps/chat/chat.service';
import {TranslateModule} from '@ngx-translate/core';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {Ng5SliderModule} from 'ng5-slider';
import {ConfirmDialogModule} from './dialogs/confirm/confirm.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CourseDialogComponent} from './course-dialog/course-dialog.component';
import {FormConstructorComponent} from './main/grid/form/form-constructor.component';
import {FormStaticComponent} from './main/grid/form/form-static.component';
import {Bitrix24Service} from './integrations/bitrix24/bitrix24.service';
import {ViewStaticComponent} from './main/grid/view-modal/view-static.component';
import {BillingService} from './_services/billing.service';
import {ProfileCardComponent} from './main/profile/card/profile-card.component';
import {GatewaysComponent} from './main/gateways/gateways.component';
import {GatewaysModalComponent} from './main/gateways/modal/gateways-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatTooltipModule,
        MatToolbarModule,
        MatRadioModule,
        MatOptionModule,
        MatCardModule,
        MatSliderModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatMenuModule,
        TranslateModule,
        // Material moment date module
        MatMomentDateModule,
        NgxDatatableModule,
        FuseWidgetModule,

        // Material
        MatButtonModule,
        MatCheckboxModule,
        MatGridListModule,
        MatDividerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTableModule,
        MatDialogModule,
        MatButtonToggleModule,
        MatBadgeModule,
        Ng5SliderModule,

        ConfirmDialogModule,
        DragDropModule,


        MatProgressSpinnerModule,
        FuseSharedModule,
        RouterModule,
        MatToolbarModule,
        MatTabsModule,
        MatExpansionModule,
        MatDatepickerModule,
        NgxDaterangepickerMd.forRoot(),
        NgxMaterialTimepickerModule,
        NgxGalleryModule,
        NgxUploaderModule,
        NgSelectModule,
        QuillModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDRh-zcFa78SH-njTu5V6-zrvfIsgqTJPQ'
        }),
        SbCalendarModule,
        FuseWidgetModule,
    ],
    declarations: [
        RegisterModalComponent,
        LoginModalComponent,
        FormComponent,
        FormConstructorComponent,
        FormStaticComponent,
        ViewStaticComponent,
        UploaderComponent,
        GalleryComponent,
        GalleryModalComponent,
        ViewModalComponent,
        ProfileTimelineComponent,
        ChatComponent,
        ChatViewComponent,
        ChatStartComponent,
        ChatChatsSidenavComponent,
        ChatUserSidenavComponent,
        ChatLeftSidenavComponent,
        ChatRightSidenavComponent,
        ChatContactSidenavComponent,
        CourseDialogComponent,
        ProfileCardComponent,
        GatewaysComponent,
        GatewaysModalComponent,
    ],
    providers: [
        ChatService,
        Bitrix24Service,
        BillingService,
        { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    ],
    exports: [
        RegisterModalComponent,
        NgxUploaderModule,
        FormComponent,
        FormStaticComponent,
        ViewStaticComponent,
        ProfileTimelineComponent,
        ProfileCardComponent,
        GatewaysComponent,
    ],
    entryComponents: [
        LoginModalComponent,
        FormComponent,
        GalleryModalComponent,
        ViewModalComponent,
        CourseDialogComponent,
        FormStaticComponent,
        ViewStaticComponent,
        ProfileCardComponent,
        GatewaysComponent,
        GatewaysModalComponent,
    ]

})
export class SharedModule {

}
