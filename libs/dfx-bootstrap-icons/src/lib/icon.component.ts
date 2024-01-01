import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnChanges, Renderer2 } from '@angular/core';

import { BiName, BiNamesEnum } from './generated';
import { DEFAULT_COLOR, DEFAULT_ICON_SIZE, ICON_COLOR, ICON_HEIGHT, ICON_WIDTH, ICONS_LOADER, ICONS_PICKED } from './icons.config';
import { ColorValueHex } from './types';
import { take } from 'rxjs';

@Component({
  selector: 'bi, *[bi]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class BiComponent {
  @Input({ required: true }) set name(it: BiName | BiNamesEnum) {
    this._name = it;
    this.setIcon();
  }
  _name!: BiName | BiNamesEnum;

  @Input() set width(it: string) {
    this._width = it;
    this.setIcon();
  }
  _width: string = inject(ICON_WIDTH);

  @Input() set height(it: string) {
    this._height = it;
    this.setIcon();
  }
  _height: string = inject(ICON_HEIGHT);

  @Input() set size(it: string) {
    this._size = it;
    this.setIcon();
  }
  _size?: string;

  @Input() set color(it: ColorValueHex) {
    this._color = it;
    this.setIcon();
  }
  _color?: ColorValueHex = inject(ICON_COLOR);

  @Input({ transform: booleanAttribute }) set clearDimensions(it: boolean) {
    this._clearDimensions = it;
    this.setIcon();
  }
  _clearDimensions = false;

  @Input() set ariaLabel(it: string) {
    this._ariaLabel = it;
    this.setIcon();
  }
  _ariaLabel?: string;

  private elementRef = inject(ElementRef);

  private renderer = inject(Renderer2);

  iconLoader = inject(ICONS_LOADER);

  setIcon(): void {
    if (!this._name) {
      this.renderIcon();
      return;
    }

    const icon = this.iconLoader(this._name);

    if (icon === undefined || typeof icon === 'string') {
      this.renderIcon(icon);
      return;
    }

    icon.pipe(take(1)).subscribe((it) => this.renderIcon(it));
  }

  private renderIcon(icon?: string) {
    if (!icon) {
      console.warn(`BiComponent: Icon ${this._name} not found`);
      return;
    }

    if (!this._clearDimensions) {
      icon = setSize(icon, 'width', this.size ?? this._width);
      icon = setSize(icon, 'height', this.size ?? this._height);
    }

    if (this._color) {
      icon = setFillColor(icon, this._color);
    }

    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-label', this._ariaLabel ?? '');
    if (this._ariaLabel) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'role', 'img');
    }

    this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', icon);
  }
}

type DimensionType = 'width' | 'height';

const setSize = (svg: string, type: DimensionType, size: string): string => svg.replace(getSizeText(type), getSizeText(type, size));

const getSizeText = (type: DimensionType, size: string = DEFAULT_ICON_SIZE): string => `${type}="${size}"`;

const setFillColor = (svg: string, color: string): string => svg.replace(getColorText(), getColorText(color));

const getColorText = (color: string = DEFAULT_COLOR): string => `fill="${color}"`;
