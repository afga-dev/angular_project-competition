import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  input,
} from '@angular/core';

@Directive({
  selector: '[appLazyLoadingDirective]',
  standalone: true,
})
export class LazyLoadingDirective implements OnInit, OnDestroy {
  delay = input<number>(0);

  private _intersectionObserver?: IntersectionObserver;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const element = this.element.nativeElement;

    this.renderer.setStyle(element, 'opacity', '0');
    this.renderer.setStyle(element, 'transform', 'translateY(30px)');
    this.renderer.setStyle(
      element,
      'transition',
      'opacity 0.6s ease, transform 0.6s ease'
    );

    this._intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              this.renderer.setStyle(element, 'opacity', '1');
              this.renderer.setStyle(element, 'transform', 'translateY(0)');
            }, this.delay());
            this._intersectionObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    this._intersectionObserver.observe(element);
  }

  ngOnDestroy(): void {
    this._intersectionObserver?.disconnect();
  }
}
