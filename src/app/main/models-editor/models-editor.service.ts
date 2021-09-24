import {Injectable} from '@angular/core';
import {ModelService} from "../../_services/model.service";
import {SitebillEntity} from "../../_models";

@Injectable()
export class ModelsEditorService {
    private currentModel: SitebillEntity;
    /**
     * Constructor
     */
    constructor(
        private modelService: ModelService,
    ) {

    }

    setCurrentModel(entity: SitebillEntity): void {
        this.currentModel = entity;
    }

    getCurrentModel() : SitebillEntity {
        return this.currentModel;
    }
}
