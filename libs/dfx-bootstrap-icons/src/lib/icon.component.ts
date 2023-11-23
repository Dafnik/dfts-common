import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
} from '@angular/core';

import { BiName, BiNamesEnum } from './generated';
import { DEFAULT_COLOR, DEFAULT_ICON_SIZE, ICON_COLOR, ICON_HEIGHT, ICON_WIDTH, ICONS_PICKED } from './icons.config';
import { ColorValueHex, IconsType } from './types';
import { toEscapedName } from './internal/toEscapedName';

@Component({
  selector: 'bi, *[bi]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class BiComponent implements OnInit, OnChanges {
  @Input({ required: true }) name!: BiName | BiNamesEnum;

  @Input() width: string = inject(ICON_WIDTH);

  @Input() height: string = inject(ICON_HEIGHT);

  @Input() color?: ColorValueHex = inject(ICON_COLOR);

  @Input({ transform: booleanAttribute }) clearDimensions = false;

  @Input() ariaLabel?: string;

  private elementRef = inject(ElementRef);

  private renderer = inject(Renderer2);

  // icons are provided as an array of objects because of "multi: true"
  readonly pickedIcons: IconsType = Object.assign({}, ...(inject(ICONS_PICKED) as unknown as object[])) as IconsType;

  ngOnInit(): void {
    this.renderIcon();
  }

  ngOnChanges(): void {
    this.renderIcon();
  }

  renderIcon(): void {
    const escapedName = toEscapedName(this.name);

    let svg = this.pickedIcons[escapedName] || undefined;

    if (!svg) {
      console.warn(`BiComponent: Icon ${this.name} not found, path: ${escapedName}`);
      return;
    }

    if (!this.clearDimensions) {
      svg = setSize(svg, 'width', this.width);
      svg = setSize(svg, 'height', this.height);
    }

    if (this.color) {
      svg = setFillColor(svg, this.color);
    }

    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-label', this.ariaLabel ?? '');
    if (this.ariaLabel) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'role', 'img');
    }

    this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', svg);
  }
}

type DimensionType = 'width' | 'height';

const setSize = (svg: string, type: DimensionType, size: string): string => svg.replace(getSizeText(type), getSizeText(type, size));

const getSizeText = (type: DimensionType, size: string = DEFAULT_ICON_SIZE): string => `${type}="${size}"`;

const setFillColor = (svg: string, color: string): string => svg.replace(getColorText(), getColorText(color));

const getColorText = (color: string = DEFAULT_COLOR): string => `fill="${color}"`;
