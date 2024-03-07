import { ChangeDetectorRef, DestroyRef, Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class NgSubsContext<T> {
  public $implicit!: T[];
  public ngSub!: T[];
}

/**
 * @deprecated Please use Signals
 */
@Directive({
  selector: '[ngSubs]',
  standalone: true,
})
export class NgSubs<T> implements OnInit {
  #destroyRef = inject(DestroyRef);
  #viewContainer = inject(ViewContainerRef);
  #templateRef: TemplateRef<NgSubsContext<T>> = inject(TemplateRef);
  #changeDetector = inject(ChangeDetectorRef);

  #subscribable$: Array<Observable<T> | BehaviorSubject<T> | Subject<T>> = [of({} as T)];
  readonly #context: NgSubsContext<T> = new NgSubsContext<T>();
  #subscription?: Subscription;

  @Input()
  set ngSub(inputSubscribable: Array<Observable<T> | BehaviorSubject<T> | Subject<T>>) {
    if (this.#subscription) {
      this.#subscription.unsubscribe();
    }

    this.#subscribable$ = inputSubscribable;
    this.#subscription = combineLatest(this.#subscribable$)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((values) => {
        this.#context.$implicit = values;
        this.#context.ngSub = values;
        this.#changeDetector.markForCheck();
      });
  }

  ngOnInit(): void {
    this.#viewContainer.createEmbeddedView(this.#templateRef, this.#context);
  }
}

export class NgSubContext<T> {
  public $implicit!: T;
  public ngSub!: T;
}

/**
 * @deprecated Please use Signals
 */
@Directive({
  selector: '[ngSub]',
  standalone: true,
})
export class NgSub<T> implements OnInit {
  #viewContainer = inject(ViewContainerRef);
  #templateRef: TemplateRef<NgSubContext<T>> = inject(TemplateRef);
  #changeDetector = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);

  #subscribable$: Observable<T> | BehaviorSubject<T> | Subject<T> = of({} as T);
  readonly #context = new NgSubContext<T>();
  #subscription?: Subscription;

  @Input()
  set ngSub(inputSubscribable: Observable<T> | BehaviorSubject<T> | Subject<T>) {
    if (this.#subscription) {
      this.#subscription.unsubscribe();
    }

    this.#subscribable$ = inputSubscribable;
    this.#subscription = this.#subscribable$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((value) => {
      this.#context.$implicit = value;
      this.#context.ngSub = value;
      this.#changeDetector.markForCheck();
    });
  }

  ngOnInit(): void {
    this.#viewContainer.createEmbeddedView(this.#templateRef, this.#context);
  }
}
