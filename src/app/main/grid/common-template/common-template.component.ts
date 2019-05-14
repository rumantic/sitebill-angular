import { Component, TemplateRef, ViewChild, Input, Output, EventEmitter, isDevMode, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FilterService } from 'app/_services/filter.service';
import { SitebillEntity } from 'app/_models';
import { AppConfig, APP_CONFIG } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';

@Component({
    selector: 'common-template',
    templateUrl: './common-template.component.html',
    styleUrls: ['./common-template.component.scss'],
    animations: fuseAnimations
})
export class CommonTemplateComponent {
    api_url: string;

    @ViewChild('controlHdrTmpl') controlHdrTmpl: TemplateRef<any>;
    @ViewChild('controlTmpl') controlTmpl: TemplateRef<any>;
    @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
    @ViewChild('imageTmpl') imageTmpl: TemplateRef<any>;
    @ViewChild('photoTmpl') photoTmpl: TemplateRef<any>;
    @ViewChild('geoTmpl') geoTmpl: TemplateRef<any>;
    @ViewChild('dtdatetimeTmpl') dtdatetimeTmpl: TemplateRef<any>;
    @ViewChild('dtdateTmpl') dtdateTmpl: TemplateRef<any>;
    @ViewChild('dttimeTmpl') dttimeTmpl: TemplateRef<any>;
    @ViewChild('textTmpl') textTmpl: TemplateRef<any>;
    @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
    @ViewChild('clientControlTmpl') clientControlTmpl: TemplateRef<any>;
    @ViewChild('clientIdTmpl') clientIdTmpl: TemplateRef<any>;
    @ViewChild('FilterComponent') filterTmpl: TemplateRef<any>;
    @ViewChild('clientStatusIdTmpl') clientStatusIdTmpl: TemplateRef<any>;

    template_loaded: boolean;
    @Input() entity: SitebillEntity;

    @Output() viewEvent = new EventEmitter<number>();
    @Output() edit_formEvent = new EventEmitter<number>();
    @Output() deleteEvent = new EventEmitter<number>();
    @Output() toggle_activeEvent = new EventEmitter<any>();
    @Output() view_galleryEvent = new EventEmitter<any>();


    constructor(
        @Inject(APP_CONFIG) private config: AppConfig,
        private modelSerivce: ModelService,
    ) {
        this.api_url = this.modelSerivce.get_api_url();
    }

    view(item_id: number) {
        this.viewEvent.next(item_id);
    }

    toggle_active(row, value) {
        const event = {row:row, value:value};
        this.toggle_activeEvent.next(event);
    }

    view_gallery(row, column, images) {
        const event = { row: row, column: column, images: images };
        this.view_galleryEvent.next(event);
    }

    edit_form(item_id: number) {
        this.edit_formEvent.next(item_id);
    }

    delete(item_id: number) {
        this.deleteEvent.next(item_id);
    }
}
