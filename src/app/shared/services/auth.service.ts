import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http :HttpClient) { }
  baseURL = 'http://localhost:5265/api';

  createUser(formdata: any) {
    return this.http.post(this.baseURL + '/signup', formdata);
  }

  signin(formdata: any) {
    return this.http.post(this.baseURL + '/signin', formdata);
  }
}
