import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ModelService} from "../../../_services/model.service";
import {SitebillSession} from "../../../_models/sitebillsession";
import parsePhoneNumber from 'libphonenumber-js';

@Injectable()
export class WhatsAppService {
    public schema = "https";
    private ready: boolean = false;


    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        private modelService: ModelService,
    )
    {
        console.log('WhatsAppService constructor');
        this.isLoggedIn(this.modelService.sitebill_session)
            .subscribe(
                (result ) => {
                    if ( result ) {
                        console.log('WhatsAppService isConnected');
                        this.readyState = true;
                    }
                }
            );
    }

    get readyState(): boolean {
        return this.ready;
    }

    set readyState (state) {
        this.ready = state;
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

    normalizeNumber ( number: string ) {
        const phoneNumber = parsePhoneNumber(number, 'RU');
        if (phoneNumber && phoneNumber.isValid()) {
            return phoneNumber.number.replace('+','') + '@c.us';
        }
        return '';
    }

    getAllMessagesInChat ( number: string ) {
        number = this.normalizeNumber(number);
        const chat_session = {
            session: this.modelService.sitebill_session,
            chat: {chatId: number}
        };
        console.log(chat_session);
        return this.http.post(`${this.api_url}/getAllMessagesInChat`, chat_session);
    }

    sendText ( number: string, message: string ) {
        number = this.normalizeNumber(number);
        const chat_session = {
            session: this.modelService.sitebill_session,
            chat: {chatId: number},
            message: message
        };
        console.log(chat_session);
        return this.http.post(`${this.api_url}/sendText`, chat_session);
    }

    checkNumberStatus ( number: string ) {
        number = this.normalizeNumber(number);
        const chat_session = {
            session: this.modelService.sitebill_session,
            chat: {chatId: number},
        };
        return this.http.post(`${this.api_url}/checkNumberStatus`, chat_session);
    }
    isConnectedOnStart (session: SitebillSession) {
        return this.http.post(`${this.api_url}/isConnected`, session);
    }
    isConnected (session: SitebillSession) {
        return this.http.post(`${this.api_url}/isConnected`, session);
    }

    isLoggedIn (session: SitebillSession) {
        return this.http.post(`${this.api_url}/isLoggedIn`, session);
    }

    getQrCode (session: SitebillSession) {
        return this.http.post(`${this.api_url}/getQrCode`, session);
    }
}
