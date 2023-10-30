import { ChangeDetectorRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, of, Subject } from "rxjs";
import { ADirective } from "../components/abstract-directive";

export class NgSubsContext<T> {
  public $implicit!: T[];
  public ngSub!: T[];
}

@Directive({
  selector: '[ngSubs]',
  standalone: true,
})
export class NgSubs<T> extends ADirective implements OnInit {
  private subscribable$: Array<Observable<T> | BehaviorSubject<T> | Subject<T>>;
  private readonly context: NgSubsContext<T>;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<NgSubsContext<T>>,
    private changeDetector: ChangeDetectorRef,
  ) {
    super();

    this.subscribable$ = [of({} as T)];
    this.context = new NgSubsContext<T>();
  }

  @Input()
  set ngSub(inputSubscribable: Array<Observable<T> | BehaviorSubject<T> | Subject<T>>) {
    this.subscribable$ = inputSubscribable;
    this.unsubscribeAll();
    this.unsubscribe(
      combineLatest(this.subscribable$).subscribe((values) => {
        this.context.$implicit = values;
        this.context.ngSub = values;
        this.changeDetector.markForCheck();
      }),
    );
  }

  ngOnInit(): void {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }
}

export class NgSubContext<T> {
  public $implicit!: T;
  public ngSub!: T;
}

@Directive({
  selector: '[ngSub]',
  standalone: true,
})
export class NgSub<T> extends ADirective implements OnInit {
  private subscribable$: Observable<T> | BehaviorSubject<T> | Subject<T>;
  private readonly context: NgSubContext<T>;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<NgSubContext<T>>,
    private changeDetector: ChangeDetectorRef,
  ) {
    super();

    this.subscribable$ = of({} as T);
    this.context = new NgSubContext<T>();
  }

  @Input()
  set ngSub(inputSubscribable: Observable<T> | BehaviorSubject<T> | Subject<T>) {
    this.subscribable$ = inputSubscribable;
    this.unsubscribeAll();
    this.unsubscribe(
      this.subscribable$.subscribe((value) => {
        this.context.$implicit = value;
        this.context.ngSub = value;
        this.changeDetector.markForCheck();
      }),
    );
  }

  ngOnInit(): void {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }
}
