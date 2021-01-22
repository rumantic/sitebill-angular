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

    @Input("_data")
    _data: {
        entity: SitebillEntity,
        image_field: string,
        image_index: number,
        galleryImages: NgxGalleryImage[],
    }

    schema_url: SafeResourceUrl;

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
            // console.log(this._data);
        } else {
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
                    console.log(opt);
                    this.updateImageLevel(opt);
                }.bind(this));

                break;
        }
        this.extend(add, this.randomId());
        this.canvas.add(add);
        this.selectItemAfterAdded(add);
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

    updateImageLevel(opt: any) {
        console.log('update image level');
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
