import {Component} from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {Realty} from "../../_models/realty";

@Component({
    selector   : 'house-schema',
    templateUrl: './house-schema.component.html',
    styleUrls  : ['./house-schema.component.scss']
})
export class HouseSchemaComponent
{
    data_columns = [];
    rows_data = [];

    /**
     * Constructor
     *
     */
    constructor(
        private modelService: ModelService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
    }
    ngOnInit() {
        let column = {
            ngx_name: 'test',
            title: 'test',
            prop: 'Этаж'
        }
        this.data_columns.push(column);
        for ( let i = 23; i > 0; i-- ) {
            let realty = new Realty(123, i, '78', '1к');

            this.rows_data.push(
                {
                    'NAME':i,
                    'ID':i,
                    '_id':i,
                    'status':i,
                    'final_destination':i,
                    'name':i,
                    'Этаж':i,
                    'realty': realty
                }
                );
        }

        console.log(this.rows_data);


    }


}
