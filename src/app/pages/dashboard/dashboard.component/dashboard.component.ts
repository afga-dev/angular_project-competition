import {
  Component,
  computed,
  effect,
  inject,
  signal,
  HostListener,
  OnInit,
  AfterViewInit,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Competition } from '../../../models/competition.interface';
import { CompetitionService } from '../../../services/competition.service';
import { UserService } from '../../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { PaginationComponent } from '../../../shared/pagination.component/pagination.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class Dashboard implements OnInit, AfterViewInit {
  private userService = inject(UserService);
  private competitionService = inject(CompetitionService);

  private _isLoading = signal<boolean>(true);
  readonly isLoading = this._isLoading.asReadonly();

  private _competitions = signal<Competition[]>([]);
  readonly competitions = computed(() =>
    this.parentCompetitions()?.length
      ? this.parentCompetitions()!
      : this._competitions()
  );

  private _currentPage = signal<number>(1);
  readonly currentPage = this._currentPage.asReadonly();

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  private _windowWidth = signal(window.innerWidth);

  readonly tableVisible = signal<boolean>(false);
  readonly searchQuery = signal<string>('');
  readonly itemsPerPage = signal<number>(10);

  isEmbedded = input<boolean>(false);
  parentCompetitions = input<Competition[] | null>(null);
  childEditCompetition = output<Competition>();
  childDeleteCompetition = output<Competition>();

  readonly user = computed(() => this.userService.user());

  private _parentCompetitions = computed(
    () => !!this.parentCompetitions()?.length
  );

  readonly filteredCompetitions = computed(() => {
    const term = this.searchQuery().trim().toLowerCase();
    return this.competitions().filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
    );
  });

  readonly displayedRows = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredCompetitions()
      .slice(start, end)
      .map((competition, i) => ({
        competition,
        index: start + i + 1,
      }));
  });

  readonly totalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(this.filteredCompetitions().length / this.itemsPerPage())
    )
  );

  readonly loadingArray = computed(() =>
    Array.from({ length: this.itemsPerPage() }, (_, i) => ({ id: i }))
  );

  readonly searchEffect = effect(() => {
    this.searchQuery();
    this._currentPage.set(1);
  });

  ngOnInit(): void {
    if (!this._parentCompetitions()) {
      this.loadCompetitions();
    }

    this.calculateHeight();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tableVisible.set(true);
    });
  }

  private async loadCompetitions(): Promise<void> {
    try {
      this._isLoading.set(true);

      const competitions = await firstValueFrom(
        this.competitionService.onRead()
      );
      this._competitions.set(competitions);

      this._currentPage.set(1);
    } catch (err) {
      // console.error(err);
      this._error.set("Sorry, the data can't be retrieved");
    } finally {
      setTimeout(() => {
        this.tableVisible.set(true);
        this._isLoading.set(false);
      }, 300);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this._windowWidth.set(window.innerWidth);
    this.calculateHeight();
  }

  getColspan(): number {
    const width = this._windowWidth();
    const base = this.user() === 'admin' ? 7 : 6;

    if (width <= 630) return 3;
    if (width <= 1460) return base - 2;
    return base;
  }

  private calculateHeight(): void {
    const constants = {
      navbar: 56,
      card: 64,
      searchBar: 48,
      pagination: 40,
      row: 48,
    };

    const usedHeight =
      constants.navbar +
      constants.card +
      constants.searchBar +
      constants.pagination;

    const availableHeight = window.innerHeight - usedHeight;

    this.itemsPerPage.set(
      Math.max(1, Math.floor(availableHeight / constants.row))
    );

    const maxPages = this.totalPages();
    if (this.currentPage() > maxPages) {
      this._currentPage.set(maxPages);
    }
  }

  setCurrentPage(page: number): void {
    page = Math.max(1, Math.min(page, this.totalPages()));
    this._currentPage.set(page);
  }

  editCompetition(competition: Competition) {
    this.childEditCompetition.emit(competition);
  }

  deleteCompetition(competition: Competition) {
    this.childDeleteCompetition.emit(competition);
  }
}
