export class LevelLocationModel {
    id: number;
    title: string;
    description: string;
    category: string;
    x: number;
    y: number;
    realty_id: number;
    constructor(item: any = clearLevelLocation) {
        this.id = item.id;
        this.title = item.title;
        this.description = item.description;
        this.category = item.category;
        this.x = item.x;
        this.y = item.y;
        this.realty_id = item.realty_id;
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
        if ( this.realty_id === 0 ) {
            return '#ff5722';
        }
        return '#00e676';
    }
}
const clearLevelLocation = {
    id: 0,
    title: '',
    description: '',
    category: '',
    x: '',
    y: '',
    realty_id: 0
};
