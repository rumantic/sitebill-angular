import {Component, OnInit, Output, EventEmitter }  from '@angular/core';
import {Subject} from 'rxjs';
import {FuseConfigService} from '@fuse/services/config.service';

import { ModelService } from 'app/_services/model.service';
import { fuseAnimations } from '@fuse/animations';
import { Bitrix24Service } from 'app/integrations/bitrix24/bitrix24.service';
import { takeUntil } from 'rxjs/operators';
import {SitebillEntity} from '../../_models';
import {FilterService} from '../../_services/filter.service';


@Component({
    selector: 'collections',
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.css'],
    animations: fuseAnimations
})
export class CollectionsComponent implements OnInit {
    @Output() submitEvent = new EventEmitter<string>();
    protected _unsubscribeAll: Subject<any>;
    private collections_total_counter: number;
    private data_total_counter: number;

    response: any;




    constructor(
        private _fuseConfigService: FuseConfigService,
        protected modelSerivce: ModelService,
        protected bitrix24Service: Bitrix24Service,
        private filterService: FilterService
        ) {
        this._unsubscribeAll = new Subject();

    }

    disable_menu() {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                }
            }
        };
    }

    set_total_counter_collections(event) {
        this.collections_total_counter = event;
        this.bitrix24Service.set_collections_count(event);
    }

    set_total_counter_data(event) {
        this.data_total_counter = event;
    }

    ngOnInit() {
        //this.test_bitrix24();
        this.disable_menu();
        this.bitrix24Service.init_input_parameters();
        this.bitrix24Service.set_collections_count(this.collections_total_counter);

        this.bitrix24Service.get_client()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log(result);
            },
                err => {
                    console.log(err);
                    return false;
                }
            );
        this.filterService.share.subscribe((entity: SitebillEntity) => {
            this.set_total_counter_collections(this.bitrix24Service.get_collections_count());
            //console.log('subscribe collections');
            //console.log(this.collections_total_counter);
        });


    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
