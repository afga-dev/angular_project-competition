import {
  Component,
  computed,
  effect,
  inject,
  signal,
  HostListener,
  OnInit,
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
export class CompetitionsList implements OnInit {
  private userService = inject(UserService);
  private competitionService = inject(CompetitionService);

  private _isLoading = signal<boolean>(true);
  readonly isLoading = this._isLoading.asReadonly();

  private _competitions = signal<CompetitionInterface[]>([]);
  readonly competitions = this._competitions.asReadonly();

  private _currentPage = signal<number>(1);
  readonly currentPage = this._currentPage.asReadonly();

  private _windowWidth = signal(window.innerWidth);
  readonly windowWidth = this._windowWidth.asReadonly();

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  readonly tableVisible = signal<boolean>(false);
  readonly searchQuery = signal<string>('');
  readonly itemsPerPage = signal<number>(10);

  readonly user = computed(() => this.userService.user());

  private filteredCompetitions = computed(() => {
    const term = this.searchQuery().trim().toLowerCase();
    return this.competitions().filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
    );
  });

  readonly paginatedCompetitions = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredCompetitions().slice(
      start,
      start + this.itemsPerPage()
    );
  });

  readonly totalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(this.filteredCompetitions().length / this.itemsPerPage())
    )
  );

  readonly searchEffect = effect(() => {
    this.searchQuery;
    this._currentPage.set(1);
  });

  ngOnInit(): void {
    this.loadCompetitions();
    this.setHeight();
  }

  private async loadCompetitions() {
    this._isLoading.set(true);

    try {
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
      }, 100);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this._windowWidth.set(window.innerWidth);
    this.setHeight();
  }

  getColspan(): number {
    const base = this.user() === 'admin' ? 7 : 6;
    if (this.windowWidth() <= 630) return 3;
    if (this.windowWidth() <= 1460) return base - 2;
    return base;
  }

  private setHeight(): void {
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
