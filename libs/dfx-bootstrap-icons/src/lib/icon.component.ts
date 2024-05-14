import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';

import { BiName, BiNamesEnum } from './generated';
import { DEFAULT_COLOR, DEFAULT_ICON_SIZE, ICON_COLOR, ICON_HEIGHT, ICON_SIZE, ICON_WIDTH, ICONS_LOADER } from './icons.config';
import { ColorValueHex } from './types';
import { filter, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'bi, *[bi]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class BiComponent {
  name = input.required<BiName | BiNamesEnum>();

  width = input<string>(inject(ICON_WIDTH));

  height = input<string>(inject(ICON_HEIGHT));

  size = input<string | undefined>(inject(ICON_SIZE));

  color = input<ColorValueHex | undefined>(inject(ICON_COLOR));

  clearDimensions = input(false, { transform: booleanAttribute });

  ariaLabel = input<string>();

  #elementRef = inject(ElementRef);
  #renderer = inject(Renderer2);
  #iconSubscription?: Subscription;

  iconLoader = inject(ICONS_LOADER);

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.#iconSubscription?.unsubscribe();
    });

    effect(() => {
      const name = this.name();

      const icon = this.#getIcon(name);

      if (!icon) {
        return;
      }

      if (typeof icon === 'string') {
        this.#renderIcon(icon);
        return;
      }

      this.#iconSubscription?.unsubscribe();

      this.#iconSubscription = icon.pipe(filter((icon): icon is string => !!icon)).subscribe((icon) => this.#renderIcon(icon));
    });
  }

  #getIcon(name: string): Observable<string | undefined> | string | undefined {
    const icon = this.iconLoader(name);

    if (icon === undefined) {
      if (name) {
        console.warn(`BiComponent: Icon ${name} not found`);
      }
      return undefined;
    }

    return icon;
  }

  #renderIcon(icon: string): void {
    if (!this.clearDimensions()) {
      icon = setSize(icon, 'width', this.size() ?? this.width());
      icon = setSize(icon, 'height', this.size() ?? this.height());
    }

    const color = this.color();
    if (color) {
      icon = setFillColor(icon, color);
    }

    const ariaLabel = this.ariaLabel();
    this.#renderer.setAttribute(this.#elementRef.nativeElement, 'aria-label', ariaLabel ?? '');
    if (ariaLabel) {
      this.#renderer.setAttribute(this.#elementRef.nativeElement, 'role', 'img');
    }

    this.#renderer.setProperty(this.#elementRef.nativeElement, 'innerHTML', icon);
  }
}

type DimensionType = 'width' | 'height';

const setSize = (svg: string, type: DimensionType, size: string): string => svg.replace(getSizeText(type), getSizeText(type, size));

const getSizeText = (type: DimensionType, size: string = DEFAULT_ICON_SIZE): string => `${type}="${size}"`;

const setFillColor = (svg: string, color: string): string => svg.replace(getColorText(), getColorText(color));

const getColorText = (color: string = DEFAULT_COLOR): string => `fill="${color}"`;
