import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Prompt {
  id: number;
  title: string;
  content: string;
  complexity: number;
  created_at: string;
  view_count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private apiUrl = 'http://localhost:8000/api/prompts/';

  constructor(private http: HttpClient) {}

  getPrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(this.apiUrl);
  }

  getPrompt(id: string): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.apiUrl}${id}/`);
  }

  createPrompt(data: any): Observable<Prompt> {
    return this.http.post<Prompt>(this.apiUrl, data);
  }
}