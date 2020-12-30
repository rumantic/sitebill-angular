export class Realty {
    id: number;
    room_count: string;
    square: string;

    constructor(room_count, square) {
        this.room_count = room_count;
        this.square = square;
    }
}