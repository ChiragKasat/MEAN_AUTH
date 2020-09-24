import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface UserDetails {
  id: string;
  email: string;
  exp: number;
}

export interface TokenPayload {
  email: string;
  password: string;
}

@Injectable()
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  public saveToken(token: string): void {
    localStorage.setItem('auth-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('auth-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user: UserDetails = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public register(user: TokenPayload) {
    return this.http.post(`http://localhost:3000/api/register`, user);
  }

  public login(user: TokenPayload): Observable<any> {
    const resp = this.http.post('http://localhost:3000/api/login', user);
    resp.pipe(
      map((data: any) => {
        if (data.success) {
          this.saveToken(data.token);
          return data;
        } else {
          console.log(data.error);
        }
      })
    );
    return resp;
  }

  public dashboard(): Observable<any> {
    const resp = this.http.get(`http://localhost:3000/api/dashboard`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return resp;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('auth-token');
    this.router.navigateByUrl('/');
  }
}
