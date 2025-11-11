import {
  Component,
  signal,
  input,
  output,
  OnChanges,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent implements OnChanges {
  currentPage = input<number>(1);
  totalPages = input<number>(1);
  maximumVisible = input<number>(3);
  disabled = input<boolean>(false);
  pageChange = output<number>();

  private _current = signal(1);
  readonly current = this._current.asReadonly();

  private _totalPages = signal(1);

  private _visiblePages = signal<(number | string)[]>([]);
  readonly visiblePages = this._visiblePages.asReadonly();

  readonly _computePages = effect(() => {
    const total = this._totalPages();
    const current = this._current();
    const maxVisible = this.maximumVisible();
    const pages: (number | string)[] = [];

    if (total <= maxVisible + 2) {
      for (let i = 1; i <= total; i++) pages.push(i);
      this._visiblePages.set(pages);
      return;
    }

    pages.push(1);

    let windowStart = Math.max(current - 1, 2);
    let windowEnd = Math.min(windowStart + maxVisible - 1, total - 1);

    if (windowEnd - windowStart + 1 < maxVisible) {
      windowStart = Math.max(windowEnd - maxVisible + 1, 2);
    }

    pages.push('…');

    for (let i = windowStart; i <= windowEnd; i++) pages.push(i);

    pages.push('…');
    pages.push(total);

    this._visiblePages.set(pages);
  });

  ngOnChanges() {
    if (this.currentPage()) this._current.set(this.currentPage());
    if (this.totalPages()) this._totalPages.set(this.totalPages());
  }

  goTo(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages()) page = this.totalPages();

    this._current.set(page);
    this.pageChange.emit(page);
  }
}
