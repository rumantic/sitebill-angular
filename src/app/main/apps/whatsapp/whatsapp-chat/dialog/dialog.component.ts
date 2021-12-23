import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {Message} from "../../types/venom-bot/model/message";
import {Chat} from "../../types/whatsapp.types";
import {NgForm} from "@angular/forms";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AttachModalComponent} from "./attach-modal/attach-modal.component";
import {SitebillEntity} from "../../../../../_models";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
    selector: 'chat-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    protected _unsubscribeAll: Subject<any>;

    public show_gallery = false;

    @Input("chat")
    chat: Chat;

    @Input("dialog")
    dialog: Message[];

    @Output() onChange = new EventEmitter();

    @ViewChildren('replyInput')
    replyInputField;

    @ViewChild('replyForm')
    replyForm: NgForm;
    files_field = 'files';
    files_entity: SitebillEntity;


    constructor(
        protected dialog_modal: MatDialog,
    ) {
        this._unsubscribeAll = new Subject();
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
    readyToReply(): void {
        setTimeout(() => {
            this.scrollToBottom();
            this.replyForm.reset();
        });

    }


    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
        }
    }


    /**
     * Reply
     */
    reply(): void {
        if (this.replyForm.form.value.message != null && this.replyForm.form.value.message.trim() !== '') {
            this.onChange.emit(this.replyForm.form.value.message);
        }
        this.readyToReply();
    }

    attach_modal() {


        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'regular-modal';
        dialogConfig.minWidth = '50vw';
        dialogConfig.data = {entity: this.files_entity};

        const modalRef = this.dialog_modal.open(AttachModalComponent, dialogConfig);
        modalRef.componentInstance.attach_entity
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if ( result.model && result.model['files'] && result.model['files'].value.length > 0 ) {
                    this.show_gallery = true;
                    this.files_entity = new SitebillEntity();
                    this.files_entity = result;
                    console.log(result.model['files'].value);
                }
            });
    }

    OnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

