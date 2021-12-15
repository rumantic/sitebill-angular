import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
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
    @ViewChild(FusePerfectScrollbarDirective)
    directiveScroll: FusePerfectScrollbarDirective;

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

    /**
     * Ready to reply
     */
    readyToReply(): void
    {
        setTimeout(() => {
            this.scrollToBottom();
        });

    }

    /**
     * Scroll to the bottom
     *
     * @param {number} speed
     */
    scrollToBottom(speed?: number): void
    {
        speed = speed || 400;
        if ( this.directiveScroll )
        {
            this.directiveScroll.update();

            setTimeout(() => {
                this.directiveScroll.scrollToBottom(0, speed);
            });
        }
    }

    /**
     * Reply
     */
    reply(): void
    {
        this.readyToReply();
        if ( this.replyForm.form.value.message != null && this.replyForm.form.value.message.trim() !== '' ) {
            this.onChange.emit(this.replyForm.form.value.message);
        }


    }
}
