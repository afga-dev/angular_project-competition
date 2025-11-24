import {
  Component,
  signal,
  input,
  output,
  OnChanges,
  SimpleChanges,
  computed,
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

  // Allows the component to update the page locally before emitting changes to the parent
  private _current = signal(1);
  readonly current = this._current.asReadonly();

  isFirst = computed(() => this.current() === 1);
  isLast = computed(() => this.current() === this.totalPages());

  // Computes the list of pages (numbers and ellipses) to render
  readonly maximum = computed<(number | string)[]>(() => {
    const total = this.totalPages();
    const current = this.current();
    const maxVisible = this.maximumVisible();
    const pages: (number | string)[] = [];

    if (total <= maxVisible + 2) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
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

    return pages;
  });

  // Syncs internal current page when the parent updates input
  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPage']) this._current.set(this.currentPage());
  }

  goTo(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages()) page = this.totalPages();

    this._current.set(page);
    this.pageChange.emit(page);
  }
}
