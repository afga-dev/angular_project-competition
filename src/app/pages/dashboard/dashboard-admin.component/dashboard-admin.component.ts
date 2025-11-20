import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateValidator } from '../../../validators/date.validator';
import { Competition } from '../../../models/competition.interface';
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
export class DashboardAdmin implements OnInit, AfterViewInit {
  private readonly DEFAULT_STATUS = 'Ongoing';

  private formBuilder = inject(FormBuilder);

  private competitionService = inject(CompetitionService);

  private _loadError = signal<string | null>(null);
  readonly loadError = this._loadError.asReadonly();

  readonly _submitMessage = signal<string | null>(null);
  readonly submitMessage = this._submitMessage.asReadonly();

  readonly _submitError = signal<string | null>(null);
  readonly submitError = this._submitError.asReadonly();

  readonly isSubmitting = signal(false);
  readonly competitions = signal<Competition[]>([]);
  readonly competition = signal<Competition | null>(null);
  readonly isDeleteModalVisible = signal(false);
  readonly formVisible = signal(false);

  readonly dashboardAdminForm = this.formBuilder.nonNullable.group({
    competitionId: [0],
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    startDate: ['', [Validators.required, DateValidator.validDate()]],
    endDate: ['', [Validators.required, DateValidator.validDate()]],
    status: [this.DEFAULT_STATUS],
  });

  ngOnInit(): void {
    this.loadCompetitions();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.formVisible.set(true);
    });
  }

  private async loadCompetitions(): Promise<void> {
    try {
      const competitions = await firstValueFrom(
        this.competitionService.onRead()
      );
      this.competitions.set(competitions);
    } catch (err) {
      // console.error(err);
      this._loadError.set("Sorry, the data can't be retrieved");
    }
  }

  private async handleSubmit(
    request: () => Promise<void>,
    successMessage: string
  ): Promise<void> {
    this.isSubmitting.set(true);

    try {
      await request();

      this.clear();

      this._submitMessage.set(successMessage);
    } catch (err) {
      this._submitError.set('An error occurred');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async submitDashboardAdminForm(): Promise<void> {
    if (this.dashboardAdminForm.invalid || this.isSubmitting()) return;

    const formValue = this.dashboardAdminForm.getRawValue();

    if (!this.competition()) {
      return this.handleSubmit(async () => {
        const newCompetition = await firstValueFrom(
          this.competitionService.onCreate(formValue)
        );

        this.competitions.update((list) => [...list, newCompetition]);
      }, 'Successfully created!');
    }

    const id = this.competition()?.competitionId;
    if (!id) return;

    return this.handleSubmit(async () => {
      await firstValueFrom(this.competitionService.onUpdate(id, formValue));

      const updated: Competition = {
        ...this.competition(),
        ...formValue,
      };

      this.competitions.set(
        this.competitions().map((c) => (c.competitionId === id ? updated : c))
      );
    }, 'Successfully updated!');
  }

  clear() {
    this.dashboardAdminForm.reset({ status: this.DEFAULT_STATUS });
    this._submitMessage.set(null);
    this._submitError.set(null);
    this.competition.set(null);
  }

  editCompetition(c: Competition) {
    this.competition.set(c);
    this.dashboardAdminForm.patchValue(this.mapCompetitionToForm(c));
  }

  private mapCompetitionToForm(c: Competition) {
    return {
      title: c.title,
      description: c.description,
      startDate: c.startDate.split('T')[0],
      endDate: c.endDate.split('T')[0],
      status: c.status,
    };
  }

  openDeleteModal(competition: Competition) {
    this.competition.set(competition);

    this.isDeleteModalVisible.set(true);
  }

  closeDeleteModal() {
    this.competition.set(null);

    this.isDeleteModalVisible.set(false);
  }

  async confirmDelete(): Promise<void> {
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

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeDeleteModal();
    }
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.dashboardAdminForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }
}
