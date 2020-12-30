export class Realty {
    id: number;
    room_count: string;
    square: string;
    type: string;

    constructor(id, room_count, square, type) {
        this.id = id;
        this.room_count = room_count;
        this.square = square;
        this.type = type;
    }

    get_id () {
        return this.id;
    }

    get_type () {
        return this.type;
    }

    get_room_count () {
        return this.room_count;
    }

    get_square () {
        return this.square;
    }
}