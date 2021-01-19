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

    mapSchemaModel(input:Array<StairModel>) {

        let new_stairs = [];
        let max_floor = 0;

        Object.entries(input).forEach(
            ([key, stair]) => {
                let new_sections = [];
                if ( stair.sections ) {
                    Object.entries(stair.sections).forEach(
                        ([key, section]) => {
                            // console.log(section);
                            let new_section = new SectionModel({_id: section._id, name: section.name});
                            new_sections.push(new_section);
                        }
                    );
                }
                let new_stair = new StairModel({_id: stair._id, name: stair.name, sections: new_sections});
                new_stairs.push(new_stair);
            }
        );
        // console.log(new_stairs);
        return new_stairs;
    }

    floor_data(floor_count, floor_hash) {
        const rows_data = [];
        let realty = null;
        let stair_id = null;
        let section_id = null;

        for ( let i = floor_count; i > 0; i-- ) {

            const realty_array = [];

            if ( floor_hash[i] ) {
                floor_hash[i].forEach(
                    (element) => {
                        stair_id = element.stair_id;
                        section_id = element.section_id;
                        realty = new Realty(element.id, i, '78', '1к', stair_id, section_id);
                        realty_array.push(realty);
                        //console.log(value);
                    }
                );
                //console.log(floor_hash[i]);
            } else {
                realty = null;
            }


            rows_data.push(
                {
                    'NAME':i,
                    'ID':i,
                    '_id':i,
                    'status':i,
                    'final_destination':i,
                    'name':i,
                    'floor':i,
                    'stair_id':stair_id,
                    'section_id':section_id,
                    'realty': realty,
                    'realty_array': realty_array
                }
            );
        }
        return rows_data;
    }

    ngOnInit() {
        let column = {
            ngx_name: 'test',
            title: 'test',
            prop: 'Этаж'
        }
        this.data_columns.push(column);
        this.houseSchemaService.get_schema().subscribe((result: any) => {
            console.log(result.data);
            this.stairs = this.mapSchemaModel(result.data.stairs);
            this.rows_data = this.floor_data(result.data.floor_count, result.data.floor_hash);
        });
    }


    getRealtyId(section_id: number, stair_id: number, floor: number) {
        // console.log('section_id = ' + section_id + ', stair_id = ' + stair_id + ', floor = ' + floor);
    }
}
