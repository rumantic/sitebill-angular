import { Component, OnDestroy, isDevMode, OnInit, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { CommentService } from '../comment.service';
import { ChatService } from 'app/main/apps/chat/chat.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {currentUser} from 'app/_models/currentuser';

@Component({
    selector   : 'profile-timeline',
    templateUrl: './timeline.component.html',
    styleUrls  : ['./timeline.component.scss'],
    animations : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ProfileTimelineComponent implements OnInit, OnDestroy
{
    timeline: any;
    selectedChat: any;
    
    // Private
    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;
    api_url: string;

    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     */
    constructor(
        private _commentService: CommentService,
        private _chatService: ChatService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        if (isDevMode()) {
            this.api_url = 'http://genplan1';
        } else {
            this.api_url = '';
        }
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        //console.log('init timeline');
        
        //this._chatService.getChat('5725a680b3249760ea21de52');
        
        this._commentService.object_id = Math.random();
        this._commentService.timelineOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(timeline => {
            this.timeline = timeline;
        });
        
        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
                console.log('chatData' + chatData);
                this.selectedChat = chatData;
            });
        
    }
    
    

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    
}
