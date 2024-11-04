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

import { BiName, BiNamesEnum } from './generated-index';
import { DEFAULT_COLOR, DEFAULT_ICON_SIZE, ICON_COLOR, ICON_HEIGHT, ICON_SIZE, ICON_WIDTH, ICONS_LOADER } from './icons.config';
import { ColorValueHex } from './types';
import { filter, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'bi, *[bi]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[style.display]': '"inline-flex"',
    '[style.width]': '(size() ?? width() ?? injectedSize ?? injectedWidth) + "px"',
    '[style.height]': '(size() ?? height() ?? injectedSize ?? injectedHeight) + "px"',
  },
})
export class BiComponent {
  injectedWidth = inject(ICON_WIDTH);
  injectedHeight = inject(ICON_HEIGHT);
  injectedSize = inject(ICON_SIZE);

  name = input.required<BiName | BiNamesEnum>();

  width = input<string>();
  height = input<string>();
  size = input<string>();
  clearDimensions = input(false, { transform: booleanAttribute });

  color = input<ColorValueHex | undefined>(inject(ICON_COLOR));

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
      const width = this.width();
      const height = this.height();
      const size = this.size();
      const color = this.color();
      const ariaLabel = this.ariaLabel();

      const name = this.name();

      const icon = this.#getIcon(name);

      if (!icon) {
        return;
      }

      if (typeof icon === 'string') {
        this.#renderIcon(icon, width, height, size, color, ariaLabel);
        return;
      }

      this.#iconSubscription?.unsubscribe();

      this.#iconSubscription = icon
        .pipe(filter((iconString): iconString is string => !!iconString))
        .subscribe((iconString) => this.#renderIcon(iconString, width, height, size, color, ariaLabel));
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

  #renderIcon(icon: string, width?: string, height?: string, size?: string, color?: string, ariaLabel?: string): void {
    if (!this.clearDimensions()) {
      icon = setSize(icon, 'width', size ?? width ?? this.injectedSize ?? this.injectedWidth);
      icon = setSize(icon, 'height', size ?? height ?? this.injectedSize ?? this.injectedHeight);
    }

    if (color) {
      icon = setFillColor(icon, color);
    }

    this.#renderer.setAttribute(this.#elementRef.nativeElement, 'aria-label', ariaLabel ?? 'Icon');
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
