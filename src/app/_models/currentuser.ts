export class currentUser {
    admin_panel_login: number;
    session_key: string;
    success: number;
    user_id: number;
    profile: UserProfile;
}

export class UserProfile {
    fio: ModelItem;
    phone: ModelItem;
    email: ModelItem;
    constructor () {
        this.fio = new ModelItem();
        this.phone = new ModelItem();
        this.email = new ModelItem();
    }
}

export class ModelItem {
    value: string;
    value_string: string;
    constructor () {
        this.value = null;
        this.value_string = null;
    }
}
