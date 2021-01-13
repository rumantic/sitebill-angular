import {SectionModel} from "./section.model";

export class StairModel {
    _id: string;
    name: string;
    sections: SectionModel[];
    constructor(item: any = clearStair) {
        this._id = item._id;
        this.name = item.name;
        this.sections = item.sections
    }
}

const clearStair = {
    _id: '',
    name: '',
    sections: [],
};
