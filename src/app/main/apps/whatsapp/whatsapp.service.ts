import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ModelService} from "../../../_services/model.service";
import {Chat} from "./types/whatsapp.types";
import {SitebillSession} from "../../../_models/sitebillsession";

@Injectable()
export class WhatsAppService {
    public schema = "https"

    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        private modelService: ModelService,
    )
    {
        console.log('WhatsAppService constructor');
    }

    get api_url(): string {
        return `${this.schema}://${this.hostname}:${this.port}/${this.api_uri}`
    }

    get hostname(): string {
        return 'whatsapp.sitebill.site'
    }

    get port(): string {
        return '443'
    }

    get api_uri(): string {
        return 'api'
    }

    getHostDevice() {
        return this.http.get(`${this.api_url}/getHostDevice`);
    }

    getAllMessagesInChat ( chat: Chat ) {
        const chat_session = {
            session: this.modelService.sitebill_session,
            chat: chat
        };
        console.log(chat_session);
        return this.http.post(`${this.api_url}/getAllMessagesInChat`, chat_session);
    }

    sendText ( chat: Chat, message: string ) {
        const chat_session = {
            session: this.modelService.sitebill_session,
            chat: chat,
            message: message
        };
        console.log(chat_session);
        return this.http.post(`${this.api_url}/sendText`, chat_session);
    }


    isConnected (session: SitebillSession) {
        return this.http.post(`${this.api_url}/isConnected`, session);
    }
    getQrCode (session: SitebillSession) {
        return this.http.post(`${this.api_url}/getQrCode`, session);
    }
}
