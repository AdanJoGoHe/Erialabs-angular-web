import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpResponse, HttpClientXsrfModule} from "@angular/common/http";
import {Observable} from "rxjs";
import * as cons from "../constants.module";
import { UserInfo } from '../interfaces/user-info';

@Injectable()
export class DataService {

  SERVER_URL: string = "http://localhost:8080";

  constructor(private http:HttpClient) { }

  getAll(): Observable<any>{
    return this.http.get<any>(this.SERVER_URL + '/api/image');
  }

  postAll(url: string, formData: FormData, httpOptions?: any): Observable<any>{
    return this.http.post<any>(this.SERVER_URL  + url,FormData, httpOptions);
  }

  upload(file: File, thumbnail: File, name: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('thumbnail', thumbnail);
    formData.append('name', name);
    const req = new HttpRequest('POST', `${this.SERVER_URL}/upload`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.SERVER_URL}/files`);
  }

  downloadFile(fileName:string): Observable<HttpResponse<any>>{		
		return this.http.get(`${this.SERVER_URL}/files/${fileName}`, {observe: 'response', responseType: 'blob'});    
   }

   oauthLogin(): Observable<any>{
    return this.http.get(`${this.SERVER_URL}/user`);   
   }
}


