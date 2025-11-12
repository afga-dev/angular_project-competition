import {
  Component,
  computed,
  effect,
  inject,
  signal,
  HostListener,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompetitionInterface } from '../../models/competition.interface';
import { CompetitionService } from '../../services/competition.service';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { PaginationComponent } from '../../shared/pagination.component/pagination.component';

@Component({
  selector: 'app-competitions-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './competitions-list.component.html',
  styleUrl: './competitions-list.component.css',
})
export class CompetitionsList implements OnInit, AfterViewInit {
  private userService = inject(UserService);
  private competitionService = inject(CompetitionService);

  private _isLoading = signal<boolean>(true);
  readonly isLoading = this._isLoading.asReadonly();

  private _competitions = signal<CompetitionInterface[]>([]);
  readonly competitions = this._competitions.asReadonly();

  private _currentPage = signal<number>(1);
  readonly currentPage = this._currentPage.asReadonly();

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  readonly tableVisible = signal<boolean>(false);
  readonly searchQuery = signal<string>('');
  readonly itemsPerPage = signal<number>(10);

  private _windowWidth = window.innerWidth;

  readonly user = computed(() => this.userService.user());

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
    this.loadCompetitions();
    this.calculateHeight();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tableVisible.set(true);
    });
  }

  private async loadCompetitions() {
    try {
      this._isLoading.set(true);

      const competitions = await firstValueFrom(
        this.competitionService.onRead()
      );
      this._competitions.set(competitions);

      this._currentPage.set(1);
    } catch (err) {
      // console.error(err);
      this._error.set("Sorry, the data can't be retrieved.");
    } finally {
      setTimeout(() => {
        this.tableVisible.set(true);
        this._isLoading.set(false);
      }, 300);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this._windowWidth = window.innerWidth;
    this.calculateHeight();
  }

  getColspan(): number {
    const base = this.user() === 'admin' ? 7 : 6;
    if (this._windowWidth <= 630) return 3;
    if (this._windowWidth <= 1460) return base - 2;
    return base;
  }

  private calculateHeight(): void {
    const navbar = 56,
      card = 64,
      searchBar = 48,
      pagination = 40,
      row = 48;
    const availableHeight =
      window.innerHeight - (navbar + card + searchBar + pagination);
    this.itemsPerPage.set(Math.max(1, Math.floor(availableHeight / row)));

    if (this.currentPage() > this.totalPages())
      this._currentPage.set(this.totalPages());
  }

  setCurrentPage(page: number): void {
    page = Math.max(1, Math.min(page, this.totalPages()));
    this._currentPage.set(page);
  }

  editCompetition(_: CompetitionInterface) {}
  openDeleteModal(_: CompetitionInterface) {}
}
