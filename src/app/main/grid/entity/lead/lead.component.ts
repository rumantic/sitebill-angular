import { Component } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FilterService } from 'app/_services/filter.service';
import { MyClientComponent } from './myclient.component';

@Component({
    selector: 'lead-component',
    templateUrl: './lead.component.html',
    styleUrls: ['./lead.component.scss'],
    animations: fuseAnimations
})
export class LeadComponent {
    constructor(
        private filterService: FilterService
    ) {
    }

    ngOnInit() {
    }
    

    getMyClientCounter() {
        return this.filterService.get_counter_value('myclient', 'total_count');
    }
    getFreeClientCounter() {
        return this.filterService.get_counter_value('freeclient', 'total_count');
    }
}
