import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {env} from "../../../environments/environment";

const HEADERS = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}` });

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http: HttpClient) {

  }

  index(path: string, params = {}): Observable<any> {
    return this.http.get(env.apiUrl + path + '.json', {
      headers: HEADERS,
      params,
    });
  }

  create(path:string, body: any): Observable<any> {
    return this.http.post(env.apiUrl + path + '.json', JSON.stringify(body), {headers: HEADERS});
  }

  show(path: string): Observable<any> {
    return this.http.get(env.apiUrl + path + '.json', {headers: HEADERS});
  }

  update(path: string, body: any): Observable<any> {
    return this.http.patch(env.apiUrl + path + '.json', body, {headers: HEADERS});
  }

  get(path: string): Observable<any> {
    return this.http.get(env.apiUrl + path + '.json', {headers: HEADERS});
  }

  post(path:string, body: any): Observable<any> {
    return this.http.post(env.apiUrl + path + '.json',JSON.stringify(body), {headers: HEADERS});
  }

  // Delete
  destroy(path: string): Observable<any> {
    return this.http.delete(env.apiUrl + path + '.json', {headers: HEADERS});
  }

  login(credentails :any): Observable<any> {
    return this.post('signin', {
      userid: credentails.userid,
      password: credentails.password
    });

  }

  getWordUrl() :string {
    return env.wordUrl;
  }
}
