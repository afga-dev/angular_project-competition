import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Competition,
  CompetitionCreate,
  CompetitionResponse,
} from '../models/competition.interface';
import { SummaryInterface } from '../models/summary.interface';
import { API_URL } from './api.tokens';

@Injectable({
  providedIn: 'root',
})
export class CompetitionService {
  private httpClient = inject(HttpClient);
  private baseUrl = inject(API_URL);

  // Dashboard summary information
  getSummary(): Observable<SummaryInterface> {
    return this.httpClient.get<SummaryInterface>(
      `${this.baseUrl}/getdashboardsummary`
    );
  }

  // Create a competition
  create(createData: CompetitionCreate): Observable<Competition> {
    return this.httpClient.post<Competition>(
      `${this.baseUrl}/competition`,
      createData
    );
  }

  // Fetch all competitions
  findAll(): Observable<Competition[]> {
    return this.httpClient.get<Competition[]>(
      `${this.baseUrl}/getallcompetition`
    );
  }

  // Delete a competition by ID
  delete(id: number): Observable<CompetitionResponse> {
    return this.httpClient.delete<CompetitionResponse>(
      `${this.baseUrl}/delete/${id}`
    );
  }

  // Update competition
  update(
    id: number,
    competition: Competition
  ): Observable<CompetitionResponse> {
    return this.httpClient.put<CompetitionResponse>(
      `${this.baseUrl}/update/${id}`,
      competition
    );
  }
}
