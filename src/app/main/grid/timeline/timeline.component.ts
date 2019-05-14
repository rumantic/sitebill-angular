import { Component, OnDestroy, isDevMode, OnInit, ViewEncapsulation, Inject } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { CommentService } from 'app/_services/comment.service';
import { ChatService } from 'app/main/apps/chat/chat.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {currentUser} from 'app/_models/currentuser';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';


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
        private _chatService: ChatService,
        private modelSerivce: ModelService,
        @Inject(APP_CONFIG) private config: AppConfig
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        this.api_url = this.modelSerivce.get_api_url();
        
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
        
        
        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
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
