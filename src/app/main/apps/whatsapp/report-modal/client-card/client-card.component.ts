import {Component, Input, OnInit} from '@angular/core';
import {SitebillEntity} from "../../../../../_models";

@Component({
    selector: 'client-card',
    templateUrl: './client-card.component.html',
    styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent implements OnInit {
    @Input("messages")
    entity: SitebillEntity;

    constructor() {
    }

    ngOnInit(): void {
    }

}
