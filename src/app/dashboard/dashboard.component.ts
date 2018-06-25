import { Component, OnInit } from '@angular/core';
import { Model } from '../model';
import { ModelService } from '../model.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  models: Model[] = [];

  constructor(private modelService: ModelService) { }

  ngOnInit() {
    this.getModels();
  }

  getModels(): void {
    this.modelService.getModels()
      .subscribe(models => this.models = models);
    console.log('models = ' + this.models);
  }
}
