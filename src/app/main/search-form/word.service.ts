import {Injectable, Inject, isDevMode} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';


export interface Person {
    id: string;
    isActive: boolean;
    age: number;
    name: string;
    login: string;
    adv: string;
    city: string;
    gender: string;
    company: string;
    email: string;
    phone: string;
    disabled?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    github: any[];
    api_url: string;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private http: HttpClient,
        private modelSerivce: ModelService,
        @Inject(APP_CONFIG) private config: AppConfig
        ) {
        this._unsubscribeAll = new Subject();
        this.api_url = this.modelSerivce.get_api_url();
    }

    getGithubAccounts(term: string = null) {
        if (term) {
            //return this.http.get<any>(`https://api.github.com/search/users?q=${term}`).pipe(map(rsp => rsp.items));
        } else {
            return of([]);
        }
    }

    getAlbums() {
        return this.http.get<any[]>('https://jsonplaceholder.typicode.com/albums');
    }

    getPhotos() {
        return this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos');
    }

    getPeople(term: string = null): Observable<Person[]> {
        //let items = getMockPeople();
        if (term) {
            const request = {action: 'model', do: 'load_ads_by_term', term: term, anonymous: true};
            return this.http.post<any>(`${this.api_url}/apps/api/rest.php`, request).pipe(map(rsp => rsp));
            
            /*
            this.http.post(`http://genplan1/apps/api/rest.php`, request)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    //console.log('selected > ');
                    console.log(result);
                    if (result) {
                        return result.data;
                    }
                });
            */
            //return this.http.get<any>(`http://genplan/search/users?q=${term}`).pipe(map(rsp => rsp.items));

            //items = items.filter(x => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
		return of([]).pipe();
        //return of(items).pipe(delay(500));
    }
}

function getMockPeople() {
    return [
        {
            'id': '5a15b13c36e7a7f00cf0d7cb',
            'index': 2,
            'isActive': true,
            'avatar_url': 'http://placehold.it/32x32',
            'age': 23,
            'name': 'Karyn Wright',
            'login': 'karyn',
            'gender': 'female',
            'company': 'ZOLAR',
            'email': 'karynwright@zolar.com',
            'phone': '+1 (851) 583-2547'
        }
    ]
}