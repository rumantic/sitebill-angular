export class SectionModel {
    _id: string;
    name: string;
    constructor(item: any = clearSection) {
        this._id = item._id;
        this.name = item.name;
    }
}

const clearSection = {
    _id: '',
    name: '',
};
