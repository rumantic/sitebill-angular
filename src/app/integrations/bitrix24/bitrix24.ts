export class Bitrix24Entity {
    private DEAL_ID: number;
    constructor() {
        this.set_deal_id(null);
    }

    set_deal_id(id: number) {
        this.DEAL_ID = id;
    }
    get_deal_id() {
        return this.DEAL_ID;
    }
}

export class Bitrix24PlacementOptions {
    private ID: number;
    constructor() {
        this.set_id(null);
    }

    set_id( id: number) {
        this.ID = id;
    }
    get_id() {
        return this.ID;
    }
}
