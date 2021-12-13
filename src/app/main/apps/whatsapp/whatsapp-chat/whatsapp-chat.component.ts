import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subject} from "rxjs";
import {fuseAnimations} from "../../../../../@fuse/animations";
import {WhatsAppService} from "../whatsapp.service";
import {ModelService} from "../../../../_services/model.service";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'whatsapp-chat',
    templateUrl: './whatsapp-chat.component.html',
    styleUrls: ['./whatsapp-chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WhatsAppChatComponent  implements OnInit, AfterViewChecked {
    protected _unsubscribeAll: Subject<any>;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    @Input("messages")
    messages: any[];

    constructor(
        protected whatsAppService: WhatsAppService,
        protected modelService: ModelService,

    ) {
        this._unsubscribeAll = new Subject();
    }


    ngOnInit() {
        console.log(this.messages);
        this.scrollToBottom();
        this.whatsAppService.getHostDevice()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                console.log(result);
            });
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
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
