import { Injectable } from '@angular/core';
import {ModelService} from "./model.service";
import {Message} from "../main/apps/whatsapp/types/venom-bot/model/message";
import {SitebillEntity} from "../_models";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {SitebillResponse} from "../_models/sitebill-response";
import * as moment from "moment";


@Injectable()
export class MessagesService {
    private entity: SitebillEntity;
    protected _unsubscribeAll: Subject<any>;

    constructor(
        private modelService: ModelService,
    ) {
        this._unsubscribeAll = new Subject();
        this.entity = new SitebillEntity();
        this.entity.set_app_name('messages')
        this.entity.set_table_name('messages')
        this.entity.set_primary_key('message_id')

    }

    message(message: Message, client_id?: number, data_id?: number) {
        const chatId = message.chatId;
        const ql_items = {
            id: message.id,
            content: message.content,
            isMedia: message.isMedia,
            chatId: chatId['_serialized'],
            client_id: client_id,
            data_id: data_id,
            created_at: (moment(message.timestamp*1000)).format('YYYY-MM-DD HH:mm:ss')
        };
        this.modelService.native_insert(this.entity.get_app_name(), ql_items)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: SitebillResponse) => {
            });
    }

    OnDestroy () {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
