import { Component, OnInit } from '@angular/core';
import { SearchFormComponent } from 'app/main/search-form/search-form.component';

@Component({
  selector: 'ankonsul',
  templateUrl: './search-form.component_konsul.html',
  styleUrls: ['../search-form.component.css']
})
export class AnkonsulSearchFormComponent extends SearchFormComponent implements OnInit {
    price_options: any[] = [{id: 0, value: 'Все', actual: 0}, {id: 5, value: 'range'}];
    
    public init_price_params (params: any) {
        this.form.controls.price_min.patchValue(0);
        
        if (params["price_min"] != null) {
            if ( params["price_min"] >= 0) {
                this.form.controls.price_selector.patchValue(5);
            }
            
            this.form.controls.price_min.patchValue(params["price_min"]);
            if (params["price"] != null) {
                this.form.controls.price_max.patchValue(params["price"]);
            }
        }
    }
    
    render_price_parts() {
        let query_parts = [];
        try {
            if (this.form.controls.price_selector.value == 5) {
                query_parts.push('price_min=' + this.form.controls.price_min.value);
                query_parts.push('price=' + this.form.controls.price_max.value);
            } else {
                query_parts.push('price=' + this.price_options[this.form.controls.price_selector.value].actual);
            }
        } catch {

        }
        return query_parts;
    }
}