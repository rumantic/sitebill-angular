import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FuseConfigService } from "@fuse/services/config.service";
import { ModelService } from "app/_services/model.service";

@Component({
    selector: 'bitrix24router',
    template: ''
})
export class Bitrix24Router {
    constructor(
        private router: Router,
        private modelSerivce: ModelService,
    ) {
    }

    route(placement: string) {
        if (this.modelSerivce.get_user_id() == null) {
            return false;
        }

        if (placement == 'CRM_CONTACT_DETAIL_TAB' || placement == 'CRM_CONTACT_LIST_MENU') {

            this.router.navigate(['/grid/collections/']);
        }
    }
}
