import {Component} from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {Realty} from "../../_models/realty";
import {StairModel} from "./models/stair.model";
import {SectionModel} from "./models/section.model";
import {HouseSchemaService} from "./services/houseschema.service";

@Component({
    selector   : 'house-schema',
    templateUrl: './house-schema.component.html',
    styleUrls  : ['./house-schema.component.scss']
})
export class HouseSchemaComponent
{
    data_columns = [];
    rows_data = [];
    stairs: Array<StairModel> = [];

    /**
     * Constructor
     *
     */
    constructor(
        private modelService: ModelService,
        private houseSchemaService: HouseSchemaService,
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
        this.houseSchemaService.get_schema().subscribe((result: any) => {
            console.log(result);
        });

        const sections = [];
        sections.push(new SectionModel({_id: 1, name: 'Ю'}));
        sections.push(new SectionModel({_id: 2, name: 'С'}));

        let stair = new StairModel({_id: 1, name: 'Лестница 1', sections: sections});
        let stair2 = new StairModel({_id: 1, name: 'Лестница 2', sections: sections});

        this.stairs.push(stair);
        this.stairs.push(stair2);
        this.stairs.push(stair2);

        console.log(this.stairs);

        let realty = new Realty(123, 1, '78', '1к');
        this.rows_data.push(
            {
                'floor':1,
                'stair':'Лестница 1',
                'section':'Ю',
                'realty': realty
            }
        );


        /*
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
         */

        // console.log(this.rows_data);


    }


}
