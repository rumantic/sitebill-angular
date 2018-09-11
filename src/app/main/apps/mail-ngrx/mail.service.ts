import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Mail } from 'app/main/apps/mail-ngrx/mail.model';
import { MailAppState } from 'app/main/apps/mail-ngrx/store/reducers';
import { getFiltersArr, getFoldersArr, getLabelsArr, getMailsArr } from 'app/main/apps/mail-ngrx/store/selectors';
import {currentUser} from '../../../_models/currentuser';

@Injectable()
export class MailNgrxService
{
    foldersArr: any;
    filtersArr: any;
    labelsArr: any;
    selectedMails: Mail[];
    mails: Mail[];
    api_url: string;
    private currentUser: currentUser;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {Store<MailAppState>} _store
     */
    constructor(
        private _httpClient: HttpClient,
        private _store: Store<MailAppState>
    )
    {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        if (isDevMode()) {
            this.api_url = 'http://genplan1';
        } else {
            this.api_url = '';
        }
        
        this._store.select(getFoldersArr).subscribe(folders => {
            this.foldersArr = folders;
        });

        this._store.select(getFiltersArr).subscribe(filters => {
            this.filtersArr = filters;
        });

        this._store.select(getLabelsArr).subscribe(labels => {
            this.labelsArr = labels;
        });

        this._store.select(getMailsArr).subscribe(mails => {
            this.mails = mails;
        });

        this.selectedMails = [];
        
    }

    /**
     * Get all mails
     *
     * @returns {Observable<Mail[]>}
     */
    getAllMails(): Observable<Mail[]>
    {
        return this._httpClient.get<Mail[]>('api/mail-mails');
    }

    /**
     * Get folders
     *
     * @returns {Observable<any>}
     */
    getFolders(): Observable<any>
    {
        return this._httpClient.get('api/mail-folders');
    }

    /**
     * Get filters
     *
     * @returns {Observable<any>}
     */
    getFilters(): Observable<any>
    {
        return this._httpClient.get('api/mail-filters');
    }

    /**
     * Get labels
     *
     * @returns {Observable<any>}
     */
    getLabels(): Observable<any>
    {
        return this._httpClient.get('api/mail-labels');
    }

    /**
     * Get mails
     *
     * @param handle
     * @returns {Observable<Mail[]>}
     */
    getMails(handle): Observable<Mail[]>
    {
        if ( handle.id === 'labelHandle' )
        {
            const labelId = this.labelsArr.find(label => label.handle === handle.value).id;
            return this._httpClient.get<Mail[]>('api/mail-mails?labels=' + labelId);
        }
        else if ( handle.id === 'filterHandle' )
        {
            return this._httpClient.get<Mail[]>('api/mail-mails?' + handle.value + '=true');
        }
        else // folderHandle
        {
            const folderId = this.foldersArr.find(folder => folder.handle === handle.value).id;
            return this._httpClient.get<any>('api/mail-mails?folder=' + folderId);
            //return this._httpClient.get<any>(`http://genplan1/apps/api/rest.php?action=model&do=get_data&session_key=${this.currentUser.session_key}` + folderId);
        }
    }

    /**
     * Update the mail
     *
     * @param mail
     * @returns {Promise<any>}
     */
    updateMail(mail): any
    {
        return this._httpClient.post('api/mail-mails/' + mail.id, {...mail});
    }
}
