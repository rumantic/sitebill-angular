import { Component,Input } from '@angular/core';
      
@Component({
    selector: 'filter-comp',
    template: `
<mat-select multiple="true">
    <mat-option *ngFor="let option of options" [value]="option">
     {{ option }}
    </mat-option>
  </mat-select>    
  
    <ng-select [(ngModel)]="selectedCity" [items]="cities" multiple="true" bindLabel="name" bindValue="id"></ng-select>`,
    styles: [`h2, p, div {color:red;}`]
})
export class FilterComponent { 
    name= "Дмитрий";
    selectedCity: any;
    options: any;
    @Input() columnName: string;
    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Москва'},
        {id: 4, name: 'Красноярск'},
        {id: 5, name: 'Новосибирск'},
        {id: 6, name: 'Сочи'},
        {id: 7, name: 'Краснодар'},
        {id: 8, name: 'Волгоград'}
    ];
    ngOnInit(): void {
        switch (this.columnName ) {
            case "city_id.title": {
                this.options = ['Москва', 'Красноярск'];
                break;
            }
            case "street_id.title": {
                this.options = ['Мира', 'Ленина'];
                break;
            }
            
            default: {
                this.options = ['Angular', 'PHP'];
                break;
            }
        }
    }
    
}