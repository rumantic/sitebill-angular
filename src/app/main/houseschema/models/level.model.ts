import {LevelLocationModel} from "./level-location.model";

export class LevelModel {
    id: string;
    title: string;
    locations: Array<LevelLocationModel>;

    constructor(item: any = clearLevel) {
        this.id = item.id;
        this.title = item.title;
        this.locations = item.locations;
    }

    getTitle() {
        return this.title;
    }
    getId() {
        return this.id;
    }

}
const clearLevel = {
    id: '',
    title: '',
    locations: []
};
