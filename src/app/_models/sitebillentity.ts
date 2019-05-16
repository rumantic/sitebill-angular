export class SitebillEntity {
    private app_name: string;
    private table_name: string;
    primary_key: string;
    key_value: number;
    columns: string[];
    columns_index: any[];
    default_columns_list: string[];
    model: SitebillModelItem[];
    private enable_collections: boolean;

    constructor() {
        this.columns = [];
        this.model = [];
        this.columns_index = [];
        this.default_columns_list = [];
        this.enable_collections = false;
    }

    get_app_name() {
        return this.app_name;
    }

    set_app_name(app_name: string) {
        this.app_name = app_name;
    }

    get_table_name() {
        return this.table_name;
    }

    set_table_name(table_name: string) {
        this.table_name = table_name;
    }

    add_column(name: string) {
        this.columns.push(name);
    }

    get_key_value() {
        return this.key_value;
    }

    set_enable_collections() {
        this.enable_collections = true;
    }

    set_disable_collections() {
        this.enable_collections = false;
    }

    is_enable_collections() {
        return this.enable_collections;
    }

    set_key_value(key_value: any) {
        this.key_value = key_value;
    }

}
export class SitebillModelItem {
    action: string;
    active_in_topic: number[];
    name: string;
    select_data_indexed: any;
}
