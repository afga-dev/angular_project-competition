import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CompetitionService } from '../../core/services/competition.service';
import { SummaryInterface } from '../../core/models/summary.interface';
import { firstValueFrom } from 'rxjs';
import { LazyLoadingDirective } from '../../shared/directives/lazy-loading.directive';

@Component({
  selector: 'app-home-stats',
  standalone: true,
  imports: [LazyLoadingDirective],
  templateUrl: './home-stats.component.html',
  styleUrl: './home-stats.component.css',
})
export class HomeStatsComponent implements OnInit {
  private competitionService = inject(CompetitionService);

  private _summary = signal<SummaryInterface | null>(null);
  readonly summary = this._summary.asReadonly();

  readonly _isLoading = signal<boolean>(true);
  readonly isLoading = this._isLoading.asReadonly();

  readonly stats = computed(() =>
    [
      { key: 'totalUsers', title: 'Total users' },
      { key: 'totalCompetitions', title: 'Total competitions' },
      { key: 'ongoingCompetitions', title: 'Ongoing competitions' },
      { key: 'upcomingCompetitions', title: 'Upcoming competitions' },
    ].map((stat, index) => ({
      ...stat,
      value: this.summary()?.[stat.key as keyof SummaryInterface],
      index,
    }))
  );

  ngOnInit(): void {
    this.loadSummary();
  }

  private async loadSummary() {
    try {
      const summary = await firstValueFrom(
        this.competitionService.getSummary()
      );
      this._summary.set(summary);
    } catch (err) {
      this._summary.set({
        totalUsers: 0,
        totalCompetitions: 0,
        ongoingCompetitions: 0,
        upcomingCompetitions: 0,
      } as SummaryInterface);
      // console.error(err);
    } finally {
      this._isLoading.set(false);
    }
  }
}
