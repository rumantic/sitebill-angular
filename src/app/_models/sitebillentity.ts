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
    private hook: string;
    private readonly: boolean;
    private enable_comment: boolean;

    constructor() {
        this.columns = [];
        this.model = [];
        this.columns_index = [];
        this.default_columns_list = [];
        this.enable_collections = false;
        this.hook = null;
        this.readonly = false;
        this.enable_comment = true;
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

    get_primary_key() {
        return this.primary_key;
    }

    set_primary_key(name: string) {
        this.primary_key = name;
    }

    set_enable_comment () {
        this.enable_comment = true;
    }
    set_disable_comment () {
        this.enable_comment = false;
    }
    is_enable_comment () {
        return this.enable_comment;
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

    get_hook() {
        return this.hook;
    }

    set_hook(hook: string) {
        this.hook = hook;
    }

    get_readonly() {
        return this.readonly;
    }

    set_readonly(readonly: boolean) {
        this.readonly = readonly;
    }

}
export class SitebillModelItem {
    action: string;
    active_in_topic: number[];
    name: string;
    select_data_indexed: any;
}
