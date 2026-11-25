import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, Application } from './models';

const API = 'https://hirehub-xbmg.onrender.com/api';

@Injectable({ providedIn: 'root' })
export class JobService {
  constructor(private http: HttpClient) {}
  getJobs(filters: { search?: string; location?: string; type?: string } = {}): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => { if (value) params = params.set(key, value); });
    return this.http.get<any>(`${API}/jobs`, { params });
  }
  createJob(payload: Partial<Job>): Observable<any> { return this.http.post<any>(`${API}/jobs`, payload); }
  apply(jobId: string, coverLetter: string): Observable<any> { return this.http.post<any>(`${API}/applications/${jobId}`, { coverLetter }); }
  myApplications(): Observable<{ applications: Application[] }> { return this.http.get<{ applications: Application[] }>(`${API}/applications/my`); }
  receivedApplications(): Observable<{ applications: Application[] }> { return this.http.get<{ applications: Application[] }>(`${API}/applications/received`); }
  updateStatus(id: string, status: string): Observable<any> { return this.http.patch<any>(`${API}/applications/${id}/status`, { status }); }
}
