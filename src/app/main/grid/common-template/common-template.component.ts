import {Component, TemplateRef, ViewChild, Input, Output, EventEmitter, Inject} from '@angular/core';
import {SitebillEntity} from 'app/_models';
import {AppConfig, APP_CONFIG} from 'app/app.config.module';
import {ModelService} from 'app/_services/model.service';
import {WhatsAppService} from "../../apps/whatsapp/whatsapp.service";
import {takeUntil} from "rxjs/operators";
import {SitebillResponse} from "../../../_models/sitebill-response";
import {Subject} from "rxjs";

interface WhatsAppCheckStorage {
    [key: string]: any;
}

@Component({
    selector: 'common-template',
    templateUrl: './common-template.component.html',
    styleUrls: ['./common-template.component.scss'],
})
export class CommonTemplateComponent {
    api_url: string;
    protected _unsubscribeAll: Subject<any>;


    @ViewChild('gridCheckboxHdrTmpl') gridCheckboxHdrTmpl: TemplateRef<any>;
    @ViewChild('gridCheckboxTmpl') gridCheckboxTmpl: TemplateRef<any>;
    @ViewChild('controlHdrTmpl') controlHdrTmpl: TemplateRef<any>;
    @ViewChild('controlTmpl') controlTmpl: TemplateRef<any>;
    @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
    @ViewChild('imageTmpl') imageTmpl: TemplateRef<any>;
    @ViewChild('fileTmpl') fileTmpl: TemplateRef<any>;
    @ViewChild('photoTmpl') photoTmpl: TemplateRef<any>;
    @ViewChild('whatsAppTmpl') whatsAppTmpl: TemplateRef<any>;
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
    @ViewChild('select_by_query_multi_Tmpl') select_by_query_multi_Tmpl: TemplateRef<any>;


    template_loaded: boolean;
    @Input() entity: SitebillEntity;

    @Input("disable_view_button")
    disable_view_button: boolean;

    @Input("enable_coworker_button")
    enable_coworker_button: boolean;

    @Input("enable_testimonials_button")
    enable_testimonials_button: boolean;

    @Input("enable_building_blocks_button")
    enable_building_blocks_button: boolean;

    @Input("disable_edit_button")
    disable_edit_button: boolean;

    @Input("disable_delete_button")
    disable_delete_button: boolean;

    @Input("disable_activation_button")
    disable_activation_button: boolean;

    @Input("disable_gallery_controls")
    disable_gallery_controls: boolean;

    @Input("complaint_mode")
    complaint_mode: boolean;

    @Output() viewEvent = new EventEmitter<number>();
    @Output() edit_formEvent = new EventEmitter<number>();
    @Output() deleteEvent = new EventEmitter<number>();
    @Output() reportEvent = new EventEmitter<number>();
    @Output() coworkersEvent = new EventEmitter<number>();
    @Output() testimonialsEvent = new EventEmitter<number>();
    @Output() building_blocksEvent = new EventEmitter<number>();
    @Output() toggle_activeEvent = new EventEmitter<any>();
    @Output() view_galleryEvent = new EventEmitter<any>();
    @Output() view_injectorEvent = new EventEmitter<any>();
    @Output() toggle_collectionEvent = new EventEmitter<any>();
    @Output() view_whatsappEvent = new EventEmitter<any>();

    private whatsAppCheckStorage: WhatsAppCheckStorage = {};


    constructor(
        @Inject(APP_CONFIG) private config: AppConfig,
        public modelService: ModelService,
        protected whatsAppService: WhatsAppService,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.api_url = this.modelService.get_api_url();
    }

    view(item_id: number) {
        this.viewEvent.next(item_id);
    }

    toggle_active(row, value) {
        const event = {row: row, value: value};
        this.toggle_activeEvent.next(event);
    }

    toggle_collection(row, value) {
        const event = {row: row, value: value};
        this.toggle_collectionEvent.next(event);
    }

    view_injector(row, value) {
        const event = {row: row, value: value};
        this.view_injectorEvent.next(event);
    }

    valid_link(value) {
        const reg = '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        if (value.match(reg)) {
            return true;
        }
        return false;
    }


    view_gallery(row, column, images, disable_gallery_controls) {
        const event = {row: row, column: column, images: images, disable_gallery_controls: disable_gallery_controls};
        this.view_galleryEvent.next(event);
    }

    view_whatsapp(row, column, value, history = false) {
        const event = {row: row, column: column, value: value, history: history};
        this.view_whatsappEvent.next(event);
    }

    edit_form(item_id: number) {
        this.edit_formEvent.next(item_id);
    }

    delete(item_id: number) {
        this.deleteEvent.next(item_id);
    }

    report(item_id: number) {
        this.reportEvent.next(item_id);
    }

    coworkers(item_id: number) {
        this.coworkersEvent.next(item_id);
    }

    testimonials(item_id: number) {
        this.testimonialsEvent.next(item_id);
    }

    building_blocks(item_id: number) {
        this.building_blocksEvent.next(item_id);
    }

    get_status_class(row) {
        try {
            if (row.active.value != '1') {
                return 'red-100';
            } else if (row.active.value === '1') {
                return 'light-green-100';
            }
            if (row.hot.value == 1) {
                return 'amber-100';
            }
        } catch {
        }
        return '';
    }

    get_permission(row, action) {
        if (row[this.entity.get_primary_key()] && row[this.entity.get_primary_key()].permissions != null && row[this.entity.get_primary_key()].permissions !== undefined) {
            if (row[this.entity.get_primary_key()].permissions[action] === true) {
                return true;
            }
            return false;
        }
        return true;
    }

    isWhatsAppAvailable(value: any) {
        if ( localStorage.getItem(value) != undefined ) {
            if (localStorage.getItem(value) === '1') {
                return true;
            }
            return false;
        }

        if (!this.whatsAppService.readyState) {
            return false;
        }
        if (this.whatsAppCheckStorage[value] != undefined) {
            return this.whatsAppCheckStorage[value];
        }
        this.whatsAppCheckStorage[value] = false;

        this.whatsAppService.checkNumberStatus(value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result && result['numberExists']) {
                    console.log(value + ' numberExists');
                    localStorage.setItem(value, '1');
                    this.whatsAppCheckStorage[value] = true;
                } else {
                    localStorage.setItem(value, '0');
                    this.whatsAppCheckStorage[value] = false;
                }
            }, error => {
                console.log(error);
                this.whatsAppCheckStorage[value] = false;
            });
        return false;
    }

    OnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
