import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from './models';

const API = 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(this.readUser());
  constructor(private http: HttpClient) {}

  private readUser(): User | null {
    const value = localStorage.getItem('hirehub_user');
    try { return value ? JSON.parse(value) as User : null; } catch { return null; }
  }

  register(payload: { name: string; email: string; password: string; role: string; companyName?: string }): Observable<any> {
    return this.http.post<any>(`${API}/auth/register`, payload).pipe(tap((result) => this.saveSession(result)));
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${API}/auth/login`, payload).pipe(tap((result) => this.saveSession(result)));
  }

  private saveSession(result: any): void {
    localStorage.setItem('hirehub_token', result.token);
    localStorage.setItem('hirehub_user', JSON.stringify(result.user));
    this.currentUser.set(result.user);
  }

  logout(): void {
    localStorage.removeItem('hirehub_token');
    localStorage.removeItem('hirehub_user');
    this.currentUser.set(null);
  }

  get token(): string | null { return localStorage.getItem('hirehub_token'); }
}
