import {Component, Input} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import {SitebillEntity} from "../../../../../_models";
import {delay, takeUntil} from "rxjs/operators";
import {labelColors} from "../../../../houseschema/models/level-location.model";
import {FilterService} from "../../../../../_services/filter.service";
import {Subject} from "rxjs";

@Component({
    selector: 'auto-resolver-form',
    templateUrl: './auto-resolver-form.component.html',
    styleUrls: ['./auto-resolver-form.component.scss'],
    animations: fuseAnimations
})
export class AutoResolverFormComponent {
    entity: SitebillEntity;

    @Input('app_name')
    app_name: string;

    @Input('table_name')
    table_name: string;

    @Input('primary_key')
    primary_key: string;

    @Input('success_message')
    success_message: string;

    private _unsubscribeAll: Subject<any>;
    show_form: boolean = true;


    constructor(
        public filterService: FilterService,
    ) {
        this._unsubscribeAll = new Subject();
    }


    ngOnInit() {
        this.entity = new SitebillEntity();
        this.entity.set_app_name(this.app_name);
        this.entity.set_table_name(this.table_name);
        this.entity.primary_key = this.primary_key;

        this.filterService.share
            .pipe(
                delay(500),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((entity: SitebillEntity) => {
                if (entity.get_app_name() == this.entity.get_app_name()) {
                    // console.log(entity);
                    // console.log(entity.get_ql_items());
                    if (entity.get_hook() === 'afterSuccessCreate' && entity.get_key_value()) {
                        this.show_form = false;
                    }
                }
            });

    }

    ngOnDestroy () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
