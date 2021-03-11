import { Component } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
    selector: 'memorylist-client',
    templateUrl: './memorylist-client.component.html',
    styleUrls: ['./memorylist-client.component.scss'],
    animations: fuseAnimations
})
export class MemorylistClientComponent {
    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.route.paramMap.subscribe((params: ParamMap) => {
            const memorylist_id = params.get('memorylist_id');
            console.log(memorylist_id);
        });
    }
}
