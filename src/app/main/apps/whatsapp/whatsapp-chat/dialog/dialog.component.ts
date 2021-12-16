import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {Message} from "../../types/venom-bot/model/message";
import {
    FusePerfectScrollbarDirective
} from "../../../../../../@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive";
import {Chat} from "../../types/whatsapp.types";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'chat-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;


    @Input("chat")
    chat: Chat;

    @Input("dialog")
    dialog: Message[];

    @Output() onChange = new EventEmitter();

    @ViewChildren('replyInput')
    replyInputField;

    @ViewChild('replyForm')
    replyForm: NgForm;


    constructor() {
    }

    ngOnInit(): void {
        this.readyToReply();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }


    /**
     * Ready to reply
     */
    readyToReply(): void
    {
        setTimeout(() => {
            this.scrollToBottom();
            this.replyForm.reset();
        });

    }


    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }


    /**
     * Reply
     */
    reply(): void
    {
        if ( this.replyForm.form.value.message != null && this.replyForm.form.value.message.trim() !== '' ) {
            this.onChange.emit(this.replyForm.form.value.message);
        }
        this.readyToReply();
    }
}
