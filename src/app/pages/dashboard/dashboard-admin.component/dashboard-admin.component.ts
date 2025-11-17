import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateValidator } from '../../../validators/date.validator';
import {
  Competition,
  CompetitionCreate,
} from '../../../models/competition.interface';
import { firstValueFrom } from 'rxjs';
import { CompetitionService } from '../../../services/competition.service';
import { Dashboard } from '../dashboard.component/dashboard.component';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [Dashboard, ReactiveFormsModule, Dashboard],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css',
})
export class DashboardAdmin implements OnInit {
  private formBuilder = inject(FormBuilder);
  private competitionService = inject(CompetitionService);

  readonly dashboardMessage = signal<string | null>(null);
  readonly dashboardError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly competition = signal<Competition | null>(null);
  readonly competitions = signal<Competition[]>([]);
  readonly isDeleteModalVisible = signal(false);

  readonly dashboardForm = this.formBuilder.nonNullable.group({
    competitionId: [0],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
    startDate: ['', [Validators.required, DateValidator.validDate()]],
    endDate: ['', [Validators.required, DateValidator.validDate()]],
    status: ['Ongoing'],
  });

  ngOnInit(): void {
    this.loadCompetitions();
  }

  private async loadCompetitions(): Promise<void> {
    try {
      const competitions = await firstValueFrom(
        this.competitionService.onRead()
      );
      this.competitions.set(competitions);
    } catch (err) {
      // console.error(err);
    }
  }

  async submitDashboardForm(): Promise<void> {
    if (this.dashboardForm.invalid || this.isSubmitting()) return;

    if (!this.competition()) {
      const dashboardData: CompetitionCreate = this.dashboardForm.getRawValue();

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
      console.log(dashboardData);
    } else {
      const dashboardData: Competition = this.dashboardForm.getRawValue();
      const id = this.competition()?.competitionId;

      if (!id) return;

      this.setDashboardStatus();

      try {
        await firstValueFrom(
          this.competitionService.onUpdate(id, dashboardData)
        );
        let updatedCompetition: Competition = {
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

  editCompetition(competition: Competition) {
    this.competition.set(competition);
    this.dashboardForm.patchValue({
      title: competition.title,
      description: competition.description,
      startDate: competition.startDate.split('T')[0],
      endDate: competition.endDate.split('T')[0],
      status:
        competition.status === 'Completed'
          ? 'Completed'
          : competition.status === 'Upcoming'
          ? 'Upcoming'
          : 'Ongoing',
    });
  }

  openDeleteModal(competition: Competition) {
    this.competition.set(competition);
    this.isDeleteModalVisible.set(true);
  }

  closeDeleteModal() {
    this.competition.set(null);
    this.isDeleteModalVisible.set(false);
  }

  async confirmDelete() {
    const id = this.competition()?.competitionId;

    if (!id) return;

    try {
      await firstValueFrom(this.competitionService.onDelete(id));
      this.competitions.update((list) =>
        list.filter((c) => c.competitionId !== id)
      );
      this.closeDeleteModal();
    } catch (err) {
      //console.log(err);
    }
  }
}
