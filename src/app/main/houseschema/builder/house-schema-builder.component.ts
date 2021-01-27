import {Component, Inject, Input} from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import {ModelService} from "../../../_services/model.service";
import {HouseSchemaService} from "../services/houseschema.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {SitebillEntity} from "../../../_models";
import {FormComponent} from "../../grid/form/form.component";
import {NgxGalleryImage} from "ngx-gallery-9";
import {SafeResourceUrl} from "@angular/platform-browser";
import { fabric } from "fabric";
import {LabelSelectorComponent} from "./modal/label-selector/label-selector.component";
import {LevelLocationModel} from "../models/level-location.model";
import {LevelModel} from "../models/level.model";
import {SectionModel} from "../models/section.model";
import {StairModel} from "../models/stair.model";
import {element} from "protractor";

@Component({
    selector   : 'house-schema-builder',
    templateUrl: './house-schema-builder.component.html',
    styleUrls  : ['./house-schema-builder.component.scss']
})
export class HouseSchemaBuilderComponent
{
    public canvas: any;
    public textString: string;
    private size: any = {
        width: 1200,
        height: 1000
    };
    public OutputContent: string;
    public label_entity: SitebillEntity;
    public input_entity: SitebillEntity;

    @Input("_data")
    _data: {
        entity: SitebillEntity,
        image_field: string,
        image_index: number,
        galleryImages: NgxGalleryImage[],
    }

    schema_url: SafeResourceUrl;
    private field_name: string;
    private current_position: number;
    private level: LevelModel;

    /**
     * Constructor
     *
     */
    constructor(
        private modelService: ModelService,
        protected dialog: MatDialog,
        private houseSchemaService: HouseSchemaService,
    )
    {
        this.initLabelEntity();
    }

    initLabelEntity() {
        this.label_entity = new SitebillEntity();
        this.label_entity.set_app_name('labels');
        this.label_entity.set_table_name('labels');
        this.label_entity.set_primary_key('id');
    }


    ngOnInit() {
        if ( this._data ) {
            const image_index = this._data.image_index;
            this.schema_url = this._data.galleryImages[image_index].big;
            this.input_entity = this._data.entity;
            this.field_name = this._data.image_field;
            this.current_position = this._data.image_index;
            // console.log(this._data);
        } else {
            this.input_entity = new SitebillEntity();
            this.input_entity.set_app_name('complex');
            this.input_entity.set_table_name('complex');
            this.input_entity.set_primary_key('complex_id');
            this.input_entity.set_key_value(17);
            this.field_name = 'image';
            this.current_position = 1;

            this.schema_url = "https://qplan.sitebill.site/img/data/20210121/jpg_6008feb8a8b6e_1611202232_1.svg?1611206294340";
        }

        this.canvas = new fabric.Canvas('canvas', {
            hoverCursor: 'pointer',
            selection: true,
            selectionBorderColor: 'blue'
        });
        this.textString = null;
        this.canvas.setWidth(this.getWidth(''));
        this.canvas.setHeight(this.getHeight(''));
        this.OutputContent = null;
        this.load_level();
    }

    load_level() {
        this.level = new LevelModel({
            id: '234',
            title: 'fdsdfs',
            locations: null
        });


        this.houseSchemaService.load_level(this.input_entity, this.getFieldName(), this.getCurrentPosition()).subscribe((result: any) => {
            if ( result.status === 'ok' ) {
                // console.log(result.level);
                Object.entries(result.level.locations).forEach(
                    ([key, location]) => {

                        if ( location ) {
                            let nlocation = new LevelLocationModel(location);
                             console.log(location);
                            if ( nlocation.id ) {
                                const current_location = new LevelLocationModel({
                                    id: nlocation.id,
                                    title: '',
                                    description: '',
                                    category: '',
                                    x: nlocation.x,
                                    y: nlocation.y,
                                    realty_id: (nlocation.realty_id ? nlocation.realty_id : 0)
                                });

                                this.addLabel(current_location);
                            }
                        }

                        /*
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
                         */
                    }
                );

            }
        });
    }

    addText() {
        let textString = this.textString;
        let text = new fabric.IText(textString, {
            left: 10,
            top: 10,
            fontFamily: 'helvetica',
            angle: 0,
            fill: '#000000',
            scaleX: 0.5,
            scaleY: 0.5,
            fontWeight: '',
            hasRotatingPoint: true
        });
        this.extend(text, this.randomId());
        this.canvas.add(text);
        this.selectItemAfterAdded(text);
        this.textString = '';
    }

    extend(obj, id) {
        obj.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    id: id
                });
            };
        })(obj.toObject);
    }
    //======= this is used to generate random id of every object ===========
    randomId() {
        return Math.floor(Math.random() * 999999) + 1;
    }
    //== this function is used to active the object after creation ==========
    selectItemAfterAdded(obj) {
        this.canvas.discardActiveObject().renderAll();
        this.canvas.setActiveObject(obj);
    }

    /*
    addFigure(figure) {
        let add: any;
        switch (figure) {
            case 'rectangle':
                add = new fabric.Rect({
                    width: 200, height: 100, left: 10, top: 10, angle: 0,
                    fill: '#3f51b5'
                });
                break;
            case 'square':
                add = new fabric.Rect({
                    width: 100, height: 100, left: 10, top: 10, angle: 0,
                    fill: '#4caf50'
                });
                break;
            case 'triangle':
                add = new fabric.Triangle({
                    width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
                });
                break;
            case 'circle':
                add = new fabric.Circle({
                    radius: 20, left: 10, top: 10, fill: '#ff5722'
                });
                add.on('mousedblclick', function(opt){
                    console.log('mousedblclick fired with opts: ');
                    console.log(opt);
                    this.editLabel();
                    this.updateImageLevel(opt);
                }.bind(this));

                add.on('moved', function(opt){
                    console.log('mouseout fired with opts: ');
                    console.log(opt.target);
                    this.updateImageLevel(opt);
                }.bind(this));

                break;
        }
        this.extend(add, this.randomId());
        this.canvas.add(add);
        this.selectItemAfterAdded(add);
    }
     */

    addLabel (location: LevelLocationModel) {
        // console.log(location);

        let add: any;

        add = new fabric.Circle({
            radius: 20, left: location.x, top: location.y, fill: location.getColor()
        });
        this.extend(add, location.getId());

        add.on('mousedblclick', function(opt){
            console.log('mousedblclick fired with opts: ');
            console.log(opt.target);
            console.log(opt.target.fill);
            console.log(opt.target.toObject().id);

            opt.target.set("fill", '#00e676');
            opt.target.set("fillColor", '#00e676');
            this.setRealtyId(opt.target.toObject().id, 111);
            this.canvas.renderAll();


            this.editLabel();
            this.updateImageLevel();
        }.bind(this));

        add.on('moved', function(opt){
            console.log('mouseout fired with opts: ');
            //console.log(opt.target);
            console.log(opt.target.toObject().id);
            this.updateXY(opt.target.toObject().id, opt.target.left, opt.target.top);
        }.bind(this));
        // console.log(add);
        this.canvas.add(add);
        this.selectItemAfterAdded(add);
        this.level.pushLocation(location);
    }

    setRealtyId ( id, realty_id ) {
        this.level.locations.forEach((element) => {
            if (id === element.id) {
                element.setRealtyId(realty_id);
            }
        });
        this.updateImageLevel();
    }

    updateXY( id, x, y ) {

        this.level.locations.forEach((element) => {
            if (id === element.id) {
                element.x = x;
                element.y = y;
                console.log(element);
            }
        });


        this.updateImageLevel();
    }

    addEmptyLabel(top = 10, left = 10) {
        const current_location = new LevelLocationModel({
            id: this.randomId(),
            title: '',
            description: '',
            category: '',
            x: left,
            y: top,
        });
        this.addLabel(current_location);
        this.updateImageLevel();

    }

    ExportToContent(input) {
        if(input == 'json'){
            this.OutputContent = JSON.stringify(this.canvas);
        }else if(input == 'svg'){
            this.OutputContent = this.canvas.toSVG();
        }
    }
    getWidth(postfix = 'px') {
        return '1000' + postfix;
    }
    getHeight(postfix = 'px') {
        return '600' + postfix;
    }

    private getFieldName() {
        return this.field_name;
    }

    private getCurrentPosition() {
        return this.current_position;
    }


    updateImageLevel() {
        console.log('update image level');
        this.houseSchemaService.update_level(this.input_entity, this.getFieldName(), this.getCurrentPosition(), this.level).subscribe((result: any) => {
            console.log(result);
        });

    }

    editLabel() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        //dialogConfig.width = '99vw';
        //dialogConfig.maxWidth = '99vw';
        //dialogConfig.data = { app_name: this.entity.get_table_name(), primary_key: this.entity.primary_key, key_value: item_id };
        //this.entity.set_key_value(item_id);
        dialogConfig.data = this.label_entity;
        //console.log(dialogConfig.data);
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';


        this.dialog.open(LabelSelectorComponent, dialogConfig);
    }

}
