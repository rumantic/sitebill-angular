import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';
import 'rxjs/add/operator/map';

import {Model} from './model';
import {MessageService} from './message.service';
import {User} from './_models/user';
import {currentUser} from './_models/currentuser';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class ModelService {
    private modelsUrl = 'http://genplan1/apps/api/rest.php?action=model';  // URL to web api

        constructor(
        private http: HttpClient,
        private messageService: MessageService,
    ) {}

    /** GET heroes from the server */
    getModels(): Observable<Model[]> {
        let currentUser: currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        const url = `${this.modelsUrl}&do=get_models&session_key=${currentUser.session_key}`;
        return this.http.get<Model[]>(url)
            .pipe(
            tap(models => this.log(`fetched models`)),
            catchError(this.handleError('getModels', []))
            );
    }

    /** GET hero by id. Return `undefined` when id not found */
    getModelNo404<Data>(id: number): Observable<Model> {
        const url = `${this.modelsUrl}&do=get_model&id=${id}`;
        return this.http.get<Model[]>(url)
            .pipe(
            map(models => models[0]), // returns a {0|1} element array
            tap(h => {
                const outcome = h ? `fetched` : `did not find`;
                this.log(`${outcome} model id=${id}`);
            }),
            catchError(this.handleError<Model>(`getModel id=${id}`))
            );
    }

    /** GET hero by id. Will 404 if id not found */
    getModel(id: number): Observable<Model> {
        let currentUser: currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        const url = `${this.modelsUrl}&do=get_model&session_key=${currentUser.session_key}&id=${id}`;
        //const url = `${this.modelsUrl}&do=get_model&id=${id}`;
        
        return this.http.get<Model>(url).pipe(
            tap(_ => this.log(`fetched model id=${id}`)),
            catchError(this.handleError<Model>(`getModel id=${id}`))
        );
        
        /*
        
        return this.http.get<Model>(url).map(data=>{
            let modelList = data;
            console.log(modelList);
            return modelList;
            
        });        
        return this.http.get<Model>(url).pipe(
            tap(_ => this.log(`fetched model id=${id}`)),
            catchError(this.handleError<Model>(`getModel id=${id}`))
        );
        */
    }
    
    /** GET hero by id. Will 404 if id not found */
    loadData(id: number): Observable<Model> {
        let currentUser: currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        const url = `${this.modelsUrl}&do=load_data&session_key=${currentUser.session_key}&id=${id}`;
        //const url = `${this.modelsUrl}&do=get_model&id=${id}`;
        
        return this.http.get<Model>(url).pipe(
            tap(_ => this.log(`fetched data_id=${id}`)),
            catchError(this.handleError<Model>(`getModel id=${id}`))
        );
        
        /*
        
        return this.http.get<Model>(url).map(data=>{
            let modelList = data;
            console.log(modelList);
            return modelList;
            
        });        
        return this.http.get<Model>(url).pipe(
            tap(_ => this.log(`fetched model id=${id}`)),
            catchError(this.handleError<Model>(`getModel id=${id}`))
        );
        */
    }
    

    /* GET models whose name contains search term */
    searchModeles(term: string): Observable<Model[]> {
        if (!term.trim()) {
            // if not search term, return empty hero array.
            return of([]);
        }
        return this.http.get<Model[]>(`api/models/?name=${term}`).pipe(
            tap(_ => this.log(`found models matching "${term}"`)),
            catchError(this.handleError<Model[]>('searchModeles', []))
        );
    }

    //////// Save methods //////////

    /** POST: add a new hero to the server */
    addModel(hero: Model): Observable<Model> {
        return this.http.post<Model>(this.modelsUrl, hero, httpOptions).pipe(
            tap((hero: Model) => this.log(`added hero w/ id=${hero.id}`)),
            catchError(this.handleError<Model>('addModel'))
        );
    }

    /** DELETE: delete the hero from the server */
    deleteModel(hero: Model | number): Observable<Model> {
        const id = typeof hero === 'number' ? hero : hero.id;
        const url = `${this.modelsUrl}/${id}`;

        return this.http.delete<Model>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted hero id=${id}`)),
            catchError(this.handleError<Model>('deleteModel'))
        );
    }

    /** PUT: update the hero on the server */
    updateModel(hero: Model): Observable<any> {
        return this.http.put(this.modelsUrl, hero, httpOptions).pipe(
            tap(_ => this.log(`updated hero id=${hero.id}`)),
            catchError(this.handleError<any>('updateModel'))
        );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a ModelService message with the MessageService */
    private log(message: string) {
        console.log(message);
        this.messageService.add('ModelService: ' + message);
    }
}
