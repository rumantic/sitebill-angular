import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ModelService} from "../../../_services/model.service";
import {Chat} from "./types/whatsapp.types";
import {SitebillSession} from "../../../_models/sitebillsession";

@Injectable()
export class WhatsAppService {
    public schema = "http"

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
        return 'localhost'
    }

    get port(): string {
        return '3000'
    }

    get api_uri(): string {
        return 'api'
    }

    getHostDevice() {
        return this.http.get(`${this.api_url}/getHostDevice`);
    }

    getAllMessagesInChat ( chat: Chat ) {
        return this.http.post(`${this.api_url}/getAllMessagesInChat`, chat);
    }

    isConnected (session: SitebillSession) {
        return this.http.post(`${this.api_url}/isConnected`, session);
    }
    getQrCode (session: SitebillSession) {
        return this.http.post(`${this.api_url}/getQrCode`, session);
    }
}
