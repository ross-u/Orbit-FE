import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(
    private http: HttpClient,
  ) { }

  baseUrl = "http://localhost:3000";
  token = "0a2b9680-1bda-11e9-8fc5-4df11c3c732b";

  login(email, password): Observable<any> {
    let base64Encoded = btoa(`${email}:${password}`);

    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Basic ${base64Encoded}`
    });

    return this.http.get(`${this.baseUrl}/log-in`, { headers: headers })
      .pipe(catchError(res => res.error.errors));
  }

  signup(name, email, password): Observable<any> {
    let newUser ={ name, email, password};

    let headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http.post(`${this.baseUrl}/sign-up`, newUser, { headers: headers })
      .pipe(catchError(res => res.error.errors));
  }

  verifyToken() {
    let headers = this.setHeadersWithToken();
    return this.http.get(`${this.baseUrl}/verify`, { headers: headers })
      .pipe(catchError(res => res.error.errors));
  }

  //WORKSPACES
  getWorkspaces() {
    let headers = this.setHeadersWithToken();
    return this.http.get(`${this.baseUrl}/dashboard`, { headers: headers });
  }

  addWorkspace(category, wsName, metricsArr) {
    const payload = JSON.stringify({
      name: wsName,
      category: category,
      metricLabels: metricsArr
    });

    let headers = this.setHeadersWithToken();
    return this.http.post(`${this.baseUrl}/dashboard`, payload, { headers: headers });
  }

  //ENTRIES
  getEntries(workspaceId): any {
    let headers = this.setHeadersWithToken();
    return this.http.get(`${this.baseUrl}/dashboard/${workspaceId}`, { headers: headers });
  }

  //SNAPSHOTS
  addNewSnapshot(workspaceId, entryId, payload) {
    let headers = this.setHeadersWithToken();
    return this.http.post(`${this.baseUrl}/dashboard/${workspaceId}/${entryId}`, payload, { headers: headers });
  }

  //HELPER FUNCTION
  setHeadersWithToken() {
    //get token from local storage
    let stored = JSON.parse(localStorage.getItem('currentUser'));
    let token =  stored && stored.token;

    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    });

    return headers;
  }

}
