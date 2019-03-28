export class SitebillEntity {
    app_name: string;
    primary_key: string;
    key_value: number;
    columns: string[];

    constructor() {
        this.columns = [];
    }


    add_column(name: string) {
        this.columns.push(name);
    }
}