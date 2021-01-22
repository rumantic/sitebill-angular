export class LevelLocationModel {
    id: string;
    title: string;
    description: string;
    category: string;
    x: number;
    y: number;
    constructor(item: any = clearLevelLocation) {
        this.id = item.id;
        this.title = item.title;
        this.description = item.description;
        this.category = item.category;
        this.x = item.x;
        this.y = item.y;
    }

    getTitle() {
        return this.title;
    }
    getId() {
        return this.id;
    }

}
const clearLevelLocation = {
    id: '',
    title: '',
    description: '',
    category: '',
    x: '',
    y: '',
};
