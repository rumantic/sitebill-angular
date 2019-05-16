import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FuseConfigService } from "@fuse/services/config.service";

@Component({
    selector: 'bitrix24router',
    template: ''
})
export class Bitrix24Router {
    constructor(
        private router: Router,
    ) {
    }

    route(placement: string) {
        if (placement == 'CRM_CONTACT_DETAIL_TAB' || placement == 'CRM_CONTACT_LIST_MENU') {

            this.router.navigate(['/collections/']);
        }
    }
}
