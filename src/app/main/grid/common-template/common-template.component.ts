import {Component, TemplateRef, ViewChild, Input, Output, EventEmitter, isDevMode, Inject, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FilterService } from 'app/_services/filter.service';
import { SitebillEntity } from 'app/_models';
import { AppConfig, APP_CONFIG } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';

@Component({
    selector: 'common-template',
    templateUrl: './common-template.component.html',
    styleUrls: ['./common-template.component.scss'],
})
export class CommonTemplateComponent {
    api_url: string;

    @ViewChild('gridCheckboxHdrTmpl') gridCheckboxHdrTmpl: TemplateRef<any>;
    @ViewChild('gridCheckboxTmpl') gridCheckboxTmpl: TemplateRef<any>;
    @ViewChild('controlHdrTmpl') controlHdrTmpl: TemplateRef<any>;
    @ViewChild('controlTmpl') controlTmpl: TemplateRef<any>;
    @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
    @ViewChild('imageTmpl') imageTmpl: TemplateRef<any>;
    @ViewChild('photoTmpl') photoTmpl: TemplateRef<any>;
    @ViewChild('priceTmpl') priceTmpl: TemplateRef<any>;
    @ViewChild('geoTmpl') geoTmpl: TemplateRef<any>;
    @ViewChild('dtdatetimeTmpl') dtdatetimeTmpl: TemplateRef<any>;
    @ViewChild('dtdateTmpl') dtdateTmpl: TemplateRef<any>;
    @ViewChild('dttimeTmpl') dttimeTmpl: TemplateRef<any>;
    @ViewChild('textTmpl') textTmpl: TemplateRef<any>;
    @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
    @ViewChild('clientControlTmpl') clientControlTmpl: TemplateRef<any>;
    @ViewChild('clientIdTmpl') clientIdTmpl: TemplateRef<any>;
    @ViewChild('injectorTmpl') injectorTmpl: TemplateRef<any>;
    @ViewChild('FilterComponent') filterTmpl: TemplateRef<any>;
    @ViewChild('clientStatusIdTmpl') clientStatusIdTmpl: TemplateRef<any>;

    template_loaded: boolean;
    @Input() entity: SitebillEntity;

    @Input("disable_view_button")
    disable_view_button: boolean;

    @Input("disable_edit_button")
    disable_edit_button: boolean;

    @Input("disable_delete_button")
    disable_delete_button: boolean;

    @Input("disable_activation_button")
    disable_activation_button: boolean;

    @Input("disable_gallery_controls")
    disable_gallery_controls: boolean;

    @Output() viewEvent = new EventEmitter<number>();
    @Output() edit_formEvent = new EventEmitter<number>();
    @Output() deleteEvent = new EventEmitter<number>();
    @Output() toggle_activeEvent = new EventEmitter<any>();
    @Output() view_galleryEvent = new EventEmitter<any>();
    @Output() view_injectorEvent = new EventEmitter<any>();
    @Output() toggle_collectionEvent = new EventEmitter<any>();


    constructor(
        @Inject(APP_CONFIG) private config: AppConfig,
        private modelSerivce: ModelService,
    ) {
        this.api_url = this.modelSerivce.get_api_url();
    }

    ngOnInit () {
    }

    view(item_id: number) {
        this.viewEvent.next(item_id);
    }

    toggle_active(row, value) {
        const event = {row:row, value:value};
        this.toggle_activeEvent.next(event);
    }

    toggle_collection(row, value) {
        const event = { row: row, value: value };
        this.toggle_collectionEvent.next(event);
    }

    view_injector(row, value) {
        const event = { row: row, value: value };
        this.view_injectorEvent.next(event);
    }


    view_gallery(row, column, images, disable_gallery_controls) {
        const event = { row: row, column: column, images: images, disable_gallery_controls: disable_gallery_controls };
        this.view_galleryEvent.next(event);
    }

    edit_form(item_id: number) {
        this.edit_formEvent.next(item_id);
    }

    delete(item_id: number) {
        this.deleteEvent.next(item_id);
    }
    get_permission ( row, action ) {
        if ( row[this.entity.get_primary_key()].permissions != null ) {
            if ( row[this.entity.get_primary_key()].permissions[action] === true ) {
                return true;
            }
            return false;
        }
        return true;
    }
}
