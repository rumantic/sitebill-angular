import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, isDevMode } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Mail } from 'app/main/apps/mail-ngrx/mail.model';
import { MailNgrxService } from 'app/main/apps/mail-ngrx/mail.service';
import * as fromStore from 'app/main/apps/mail-ngrx/store';

import { locale as english } from 'app/main/apps/mail-ngrx/i18n/en';
import { locale as turkish } from 'app/main/apps/mail-ngrx/i18n/tr';
import {currentUser} from '../../../_models/currentuser';


@Component({
    selector       : 'mail-ngrx',
    templateUrl    : './mail.component.html',
    styleUrls      : ['./mail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailNgrxComponent implements OnInit, OnDestroy
{
    hasSelectedMails: boolean;
    isIndeterminate: boolean;
    searchInput: FormControl;
    mails$: Observable<any>;
    folders$: Observable<any>;
    labels$: Observable<any>;
    currentMail$: Observable<Mail>;
    selectedMailIds$: Observable<string[]>;
    searchText$: Observable<string>;
    mails: Mail[];
    selectedMailIds: string[];
    api_url: string;
    private currentUser: currentUser;
    private _unsubscribeAll: Subject<any>;
    rows: any[];
    
    

    /**
     * Constructor
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {MailNgrxService} _mailNgrxService
     * @param {Store<MailAppState>} _store
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _mailNgrxService: MailNgrxService,
        private _httpClient: HttpClient,        
        private _store: Store<fromStore.MailAppState>
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this.currentMail$ = this._store.select(fromStore.getCurrentMail);
        this.mails$ = this._store.select(fromStore.getMailsArr);
        this.folders$ = this._store.select(fromStore.getFoldersArr);
        this.labels$ = this._store.select(fromStore.getLabelsArr);
        this.selectedMailIds$ = this._store.select(fromStore.getSelectedMailIds);
        this.searchText$ = this._store.select(fromStore.getSearchText);
        this.mails = [];
        this.selectedMailIds = [];
        
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
        this.load_grid_data(null);
        
        this.mails$.subscribe(mails => {
            this.mails = mails;
        });

        this.selectedMailIds$
            .subscribe(selectedMailIds => {
                this.selectedMailIds = selectedMailIds;
                this.hasSelectedMails = selectedMailIds.length > 0;
                this.isIndeterminate = (selectedMailIds.length !== this.mails.length && selectedMailIds.length > 0);
                this.refresh();
            });

        this.searchText$.subscribe(searchText => {
            this.searchInput.setValue(searchText);
        });

        this.searchInput.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(searchText => {
            this._store.dispatch(new fromStore.SetSearchText(searchText));
        });
    }
    
    load_grid_data(selected) {
        console.log('load_grid_data mail');
        console.log(selected);

        this._httpClient.get(`${this.api_url}/apps/api/rest.php?action=model&do=get_data&session_key=${this.currentUser.session_key}`)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log(contacts.rows);
                this.rows = result.rows;
                console.log(this.rows);
                //this.init_selected_rows(this.rows, selected);
                //this.loadingIndicator = false;
            });
    }
    

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        this._changeDetectorRef.detach();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle select all
     *
     * @param ev
     */
    toggleSelectAll(ev): void
    {
        ev.preventDefault();

        if ( this.selectedMailIds.length && this.selectedMailIds.length > 0 )
        {
            this.deselectAllMails();
        }
        else
        {
            this.selectAllMails();
        }
    }

    /**
     * Select all mails
     */
    selectAllMails(): void
    {
        this._store.dispatch(new fromStore.SelectAllMails());
    }

    /**
     * Deselect all mails
     */
    deselectAllMails(): void
    {
        this._store.dispatch(new fromStore.DeselectAllMails());
    }

    /**
     * Select mails by parameter
     *
     * @param parameter
     * @param value
     */
    selectMailsByParameter(parameter, value): void
    {
        this._store.dispatch(new fromStore.SelectMailsByParameter({
            parameter,
            value
        }));
    }

    /**
     * Toggle label on selected mails
     *
     * @param labelId
     */
    toggleLabelOnSelectedMails(labelId): void
    {
        this._store.dispatch(new fromStore.AddLabelOnSelectedMails(labelId));
    }

    /**
     * Set folder on selected mails
     *
     * @param folderId
     */
    setFolderOnSelectedMails(folderId): void
    {
        this._store.dispatch(new fromStore.SetFolderOnSelectedMails(folderId));
    }

    /**
     * Deselect current mail
     */
    deselectCurrentMail(): void
    {
        this._store.dispatch(new fromStore.SetCurrentMail(''));
    }

    /**
     * Refresh
     */
    refresh(): void
    {
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
