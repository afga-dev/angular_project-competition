import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { CompetitionService } from "../../services/competition.service";
import { SummaryInterface } from "../../models/summary.interface";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  private competitionService = inject(CompetitionService);

  readonly summary = signal<SummaryInterface | null>(null);

  readonly isLoading = computed(() => this.summary() === null);

  readonly stats = computed(() => [
    { title: "Total users", value: this.summary()?.totalUsers },
    { title: "Total competitions", value: this.summary()?.totalCompetitions },
    {
      title: "Ongoing competitions",
      value: this.summary()?.ongoingCompetitions,
    },
    {
      title: "Completed competitions",
      value: this.summary()?.completedCompetitions,
    },
    {
      title: "Upcoming competitions",
      value: this.summary()?.upcomingCompetitions,
    },
  ]);

  constructor() {
    this.loadSummary();
  }

  private async loadSummary() {
    try {
      const summary = await firstValueFrom(
        this.competitionService.getSummary(),
      );
      this.summary.set(summary);
    } catch (err) {
      //console.log(err);
    }
  }
}
