// rest-connect.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestConnectService {

  private apiUrl = 'https://0990-34-168-242-42.ngrok-free.app/api/question';
  

  constructor(private http: HttpClient) { }
  search(query: string,context:string): Observable<any> {
   
    const body = {
      question: query,
      context: context
    };

    // Customize headers to avoid triggering preflight OPTIONS requests
    const headers = new HttpHeaders({
      // Optionally, set other headers if required
    });

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
