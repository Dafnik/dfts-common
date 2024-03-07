import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, Injector, input, Renderer2 } from '@angular/core';

import { BiName, BiNamesEnum } from './generated';
import { DEFAULT_COLOR, DEFAULT_ICON_SIZE, ICON_COLOR, ICON_HEIGHT, ICON_SIZE, ICON_WIDTH, ICONS_LOADER } from './icons.config';
import { ColorValueHex } from './types';
import { take } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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

  clearDimensions = input(false);

  ariaLabel = input<string>();

  #elementRef = inject(ElementRef);
  #renderer = inject(Renderer2);
  #injector = inject(Injector);

  iconLoader = inject(ICONS_LOADER);

  icon = computed(() => {
    const icon = this.iconLoader(this.name());

    if (icon === undefined) {
      console.warn(`BiComponent: Icon ${this.name()} not found`);
      return icon;
    }

    if (typeof icon === 'string') {
      return icon;
    }

    return toSignal(icon.pipe(take(1)), { injector: this.#injector })();
  });

  constructor() {
    effect(() => {
      let icon = this.icon();

      if (!icon) {
        return;
      }

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
    });
  }
}

type DimensionType = 'width' | 'height';

const setSize = (svg: string, type: DimensionType, size: string): string => svg.replace(getSizeText(type), getSizeText(type, size));

const getSizeText = (type: DimensionType, size: string = DEFAULT_ICON_SIZE): string => `${type}="${size}"`;

const setFillColor = (svg: string, color: string): string => svg.replace(getColorText(), getColorText(color));

const getColorText = (color: string = DEFAULT_COLOR): string => `fill="${color}"`;
