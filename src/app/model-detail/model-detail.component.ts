import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {Model} from '../model';
import {ModelService} from '../model.service';

@Component({
    selector: 'app-model-detail',
    templateUrl: './model-detail.component.html',
    styleUrls: ['./model-detail.component.css']
})
export class ModelDetailComponent implements OnInit {
    @Input() model: Model;
    @Input() model_body: string;
    

    constructor(
        private route: ActivatedRoute,
        private modelService: ModelService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.getModel();
    }

    getModel(): void {
        const id = +this.route.snapshot.paramMap.get('id');
        console.log('subscribe');
        
        this.modelService.getModel(id)
            .subscribe(model => this.model = model);
            //.subscribe(model => console.log(model));
        console.log('after subscribe');
        //this.model_body = JSON.stringify(this.model);
        //this.model_body = 'test';
        
    }

    goBack(): void {
        this.location.back();
    }

    save(): void {
        this.modelService.updateModel(this.model)
            .subscribe(() => this.goBack());
    }
}