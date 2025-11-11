import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateValidator } from '../../validators/date.validator';
import { CompetitionInterface } from '../../models/competition.interface';
import { CompetitionCreateInterface } from '../../models/competition-create.interface';
import { firstValueFrom } from 'rxjs';
import { CompetitionService } from '../../services/competition.service';

@Component({
  selector: 'app-competitions-manage',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './competitions-manage.component.html',
  styleUrl: './competitions-manage.component.css',
})
export class CompetitionsManage {
  private formBuilder = inject(FormBuilder);
  private competitionService = inject(CompetitionService);

  readonly dashboardMessage = signal<string | null>(null);
  readonly dashboardError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly competition = signal<CompetitionInterface | null>(null);
  readonly competitions = signal<CompetitionInterface[]>([]);

  readonly dashboardForm = this.formBuilder.nonNullable.group({
    competitionId: [0],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
    startDate: ['', [Validators.required, DateValidator.validDate()]],
    endDate: ['', [Validators.required, DateValidator.validDate()]],
    status: ['Ongoing'],
  });

  async submitDashboardForm() {
    if (this.dashboardForm.invalid || this.isSubmitting()) return;

    if (!this.competition()) {
      const dashboardData: CompetitionCreateInterface =
        this.dashboardForm.getRawValue();

      this.setDashboardStatus();

      try {
        const newCompetition = await firstValueFrom(
          this.competitionService.onCreate(dashboardData)
        );
        this.competitions.set([...this.competitions(), newCompetition]);
        this.dashboardMessage.set('Competition successfully created!');
        this.clearDashboardForm();
      } catch (err) {
        this.dashboardError.set('An error occurred.');
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      const dashboardData: CompetitionInterface =
        this.dashboardForm.getRawValue();
      const id = this.competition()?.competitionId;

      if (!id) return;

      this.setDashboardStatus();

      try {
        await firstValueFrom(
          this.competitionService.onUpdate(id, dashboardData)
        );
        let updatedCompetition: CompetitionInterface = {
          ...this.competition(),
          ...dashboardData,
        };
        this.competitions.set(
          this.competitions().map((c) =>
            c.competitionId === id ? updatedCompetition : c
          )
        );
        this.dashboardMessage.set('Competition successfully updated!');
        this.clearDashboardForm();
        this.competition.set(null);
      } catch (ee) {
        this.dashboardError.set('An error occurred.');
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  setDashboardStatus() {
    this.isSubmitting.set(true);
    this.dashboardMessage.set(null);
    this.dashboardError.set(null);
  }

  clearDashboardForm() {
    this.dashboardForm.reset({ status: 'Ongoing' });
    this.dashboardForm.markAsPristine();
    this.dashboardForm.markAsUntouched();
    this.competition.set(null);
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.dashboardForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }
}
