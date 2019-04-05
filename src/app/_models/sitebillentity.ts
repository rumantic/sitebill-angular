export class SitebillEntity {
    app_name: string;
    primary_key: string;
    key_value: number;
    columns: string[];
    columns_index: any[];
    default_columns_list: string[];
    model: SitebillModelItem[];

    constructor() {
        this.columns = [];
        this.model = [];
        this.columns_index = [];
        this.default_columns_list = [];
    }


    add_column(name: string) {
        this.columns.push(name);
    }

}
export class SitebillModelItem {
    action: string;
    active_in_topic: number[];
    name: string;
    select_data_indexed: any;
}