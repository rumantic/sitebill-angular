import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subject} from "rxjs";
import {fuseAnimations} from "../../../../../@fuse/animations";
import {WhatsAppService} from "../whatsapp.service";
import {ModelService} from "../../../../_services/model.service";
import {takeUntil} from "rxjs/operators";
import {ResponseState, SitebillResponse} from "../../../../_models/sitebill-response";
import {WhatsappStateTypes} from "../types/whatsapp-state.types";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {SitebillSession} from "../../../../_models/sitebillsession";
import {Chat, DialogPost} from "../types/whatsapp.types";
import {Message} from "../types/venom-bot/model/message";
import {SitebillEntity} from "../../../../_models";
import {SnackService} from "../../../../_services/snack.service";

@Component({
    selector: 'whatsapp-chat',
    templateUrl: './whatsapp-chat.component.html',
    styleUrls: ['./whatsapp-chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WhatsAppChatComponent  implements OnInit, AfterViewChecked {
    protected _unsubscribeAll: Subject<any>;
    public state: WhatsappStateTypes;
    public WhatsappStateTypes = WhatsappStateTypes;

    public qr_image: SafeResourceUrl;
    private wait_qr_ms = 12000;
    private qr_seconds: number = 0;
    private clearInterval: NodeJS.Timeout;

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    @Input("messages")
    messages: any[];

    @Input("phone_number")
    phone_number: string;

    @Input("entity")
    entity: SitebillEntity;

    private chat: Chat;

    public dialog: Message[];
    private subscribed = false;


    constructor(
        protected whatsAppService: WhatsAppService,
        protected modelService: ModelService,
        protected _snackService: SnackService,
        public _sanitizer: DomSanitizer
    ) {
        this._unsubscribeAll = new Subject();
    }


    initGetQrCodeProcess ( session: SitebillSession ) {
        console.log('need qr code');
        this.state = WhatsappStateTypes.wait_qr;
        this.clearInterval = setInterval(this.incrementSeconds.bind(this), 1000);
        setTimeout(() => {
            this.whatsAppService.getQrCode(this.modelService.sitebill_session)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: SitebillResponse) => {
                    clearInterval(this.clearInterval);
                    this.drawQrCode(result.data);
                });
        }, this.wait_qr_ms)
    }

    incrementSeconds() {
        this.qr_seconds += 1;
    }

    ngOnInit() {
        console.log(this.messages);
        this.scrollToBottom();
        //this.getAllChatsGroups();

        this.whatsAppService.isConnected(this.modelService.sitebill_session)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (result: SitebillResponse) => {
                    console.log(result);
                    if ( result ) {
                        if ( result.state === ResponseState.success ) {
                            console.log('client connected');
                            this.drawChat();
                        } else {
                            this.initGetQrCodeProcess(this.modelService.sitebill_session);
                        }
                    } else {
                        this.initGetQrCodeProcess(this.modelService.sitebill_session);
                    }
                },
                error => {
                    //this.getQrCode();
                    console.log('error isConnected');
                    console.log(error);
                    this._snackService.error('Сервис отправки сообщений в WhatsApp временно недоступен');
                }
                );
        if ( !this.subscribed ) {
            this.receiveChatSocketSubscriber();
        }
        /*
        this.whatsAppService.getHostDevice()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                console.log(result);
            });

        this.whatsAppService.getAllMessagesInChat({chatId:'79535888981@c.us'})
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                console.log(result);
            });
         */

    }

    getAllChatsGroups () {
        this.whatsAppService.getGroupMembers(null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (result ) => {
                    console.log(result);
                },
                error => {
                    console.log(error);
                }
            );
    }

    receiveChatSocketSubscriber() {
        console.log('receiveChatSocketSubscriber');
        this.whatsAppService.receiveChatSocket(this.modelService.sitebill_session)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (result: Message ) => {
                    if ( result.from == this.whatsAppService.normalizeNumber(this.phone_number) ) {
                        console.log('got message!');
                        console.log(result);
                        this.dialog.push(result);
                    }
                },
                error => {
                    console.log(error);
                }
            );
        this.subscribed = true;
    }

    drawChat () {
        if ( this.entity ) {
            this.state = WhatsappStateTypes.chat;
        } else {
            this.whatsAppService.getAllMessagesInChat(this.phone_number)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    (result: Message[]) => {
                        this.state = WhatsappStateTypes.chat;
                        this.dialog = result;
                        console.log(result);
                        this.whatsAppService.readyState = true;
                    },
                    error => {
                        console.log(error);
                    }
                );
        }

    }

    drawQrCode ( base64Qr: string ) {
        this.state = WhatsappStateTypes.draw_qr;
        this.qr_image = this._sanitizer.bypassSecurityTrustResourceUrl(base64Qr);
    }


    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }


    OnDestroy () {
        console.log('OnDestroy');
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        clearInterval(this.clearInterval);
    }

    update_chat(dialog_post: DialogPost) {
        console.log(dialog_post);
        if ( dialog_post.phone_list && dialog_post.phone_list.length > 0 ) {
            dialog_post.phone_list.forEach(phone_number => {
                this.sendPost(dialog_post, phone_number, false);
            });
        } else {
            this.sendPost(dialog_post, this.phone_number);
        }
    }

    sendPost (dialog_post: DialogPost, phone_number: string, update_chat = true) {
        if (dialog_post.message) {
            this.whatsAppService.sendText(phone_number, dialog_post.message)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    (result: SitebillResponse) => {
                        if ( update_chat ) {
                            console.log('update chat');
                            this.drawChat();
                        }
                    },
                    error => {
                        console.log(error);
                    }
                );
        }
        if ( dialog_post.files ) {
            this.whatsAppService.sendFile(phone_number, dialog_post.files)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    (result) => {
                        if ( update_chat ) {
                            console.log('update chat after file');
                            setTimeout(this.drawChat.bind(this), 2000);
                        }
                    },
                    error => {
                        console.log(error);
                    }
                );
        }
    }

    getProgressInPercent() {
        return Math.round((1 - ((this.wait_qr_ms - this.qr_seconds*1000)/this.wait_qr_ms))*100);
    }
}
