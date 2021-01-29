export class LevelLocationModel {
    id: number;
    title: string;
    description: string;
    category: string;
    x: number;
    y: number;
    realty_id: number;
    private label_id: number;

    constructor(item: any = clearLevelLocation) {
        this.id = item.id;
        this.title = item.title;
        this.description = item.description;
        this.category = item.category;
        this.x = item.x;
        this.y = item.y;
        this.realty_id = item.realty_id;
        this.label_id = item.label_id;
    }

    getTitle() {
        return this.title;
    }
    getId() {
        return this.id;
    }
    getRealtyId() {
        return this.realty_id;
    }
    setRealtyId(realty_id:number) {
        this.realty_id = realty_id;
    }
    getColor() {
        if ( this.getLabelId() ) {
            return '#00e676';
        }
        return '#ff5722';
    }

    setLabelId(label_id:number) {
        this.label_id = label_id;
    }
    getLabelId() {
        return this.label_id;
    }
}
const clearLevelLocation = {
    id: 0,
    title: '',
    description: '',
    category: '',
    x: '',
    y: '',
    realty_id: 0,
    label_id: null
};
