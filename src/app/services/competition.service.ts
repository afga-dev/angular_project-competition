import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CompetitionCreateInterface } from '../models/competition-create.interface';
import { Observable } from 'rxjs';
import { CompetitionInterface } from '../models/competition.interface';
import { API_URL } from '../app.config';
import { CompetitionMessageInterface } from '../models/competition-message.interface';
import { SummaryInterface } from '../models/summary.interface';

@Injectable({
  providedIn: 'root',
})
export class CompetitionService {
  private httpClient = inject(HttpClient);
  private baseUrl = inject(API_URL);

  getSummary(): Observable<SummaryInterface> {
    return this.httpClient.get<SummaryInterface>(
      `${this.baseUrl}/getdashboardsummary`
    );
  }

  onCreate(
    createData: CompetitionCreateInterface
  ): Observable<CompetitionInterface> {
    return this.httpClient.post<CompetitionInterface>(
      `${this.baseUrl}/competition`,
      createData
    );
  }

  onRead(): Observable<CompetitionInterface[]> {
    return this.httpClient.get<CompetitionInterface[]>(
      `${this.baseUrl}/getallcompetition`
    );
  }

  onDelete(id: number): Observable<CompetitionMessageInterface> {
    return this.httpClient.delete<CompetitionMessageInterface>(
      `${this.baseUrl}/delete/${id}`
    );
  }

  onUpdate(
    id: number,
    competition: CompetitionInterface
  ): Observable<CompetitionMessageInterface> {
    return this.httpClient.put<CompetitionMessageInterface>(
      `${this.baseUrl}/update/${id}`,
      competition
    );
  }
}
