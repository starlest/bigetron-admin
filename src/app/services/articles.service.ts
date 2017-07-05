import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { AuthHttp } from '../auth.http';
import { Response, URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import { getRequestOptions, handleError } from './util';
import { Observable } from 'rxjs';
import { Article } from '../models';
import { DatePipe } from '@angular/common';

@Injectable()
export class ArticlesService {
    private baseUrl: string = environment.apiEndpoint + 'articles';

    constructor(private http: AuthHttp,
                private datePipe: DatePipe) {
    }

    /**
     * Calls the [GET] /articles Web API method to retrieve articles
     * @returns {Observable<any>} rxjs Observable encapsulating the response's
     * result
     */
    get(filter: any = {},
        sortOrder: string = '',
        pageIndex: number = 0,
        pageSize: number = 0): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('pageIndex', pageIndex.toLocaleString());
        params.set('pageSize', pageSize.toLocaleString());
        Object.keys(filter).forEach(function (key) {
            params.set(key, filter[key]);
        });
        params.set('sortOrder', sortOrder);
        return this.http.get(this.baseUrl, { search: params })
            .map((response: Response) => response.json())
            .catch(handleError);
    }

    /**
     * Calls the [GET] /articles/id Web API method to retrieve a single
     * article
     * @returns {Observable<any>} rxjs Observable encapsulating the response's
     * result
     */
    getSingle(id: number): Observable<any> {
        const url = this.baseUrl + '/' + id;
        return this.http.get(url)
            .map((response: Response) => response.json())
            .catch(handleError);
    }

    /**
     * Calls the [POST] /articles Web API method to add a new article
     * @returns {Observable<any>} rxjs Observable encapsulating the response's
     * result
     */
    public add(ledgerAccount: Article): Observable<any> {
        const url = this.baseUrl;
        return this.http.post(url, JSON.stringify(ledgerAccount),
            getRequestOptions())
            .map((response: Response) => response.json())
            .catch(handleError);
    }
}
