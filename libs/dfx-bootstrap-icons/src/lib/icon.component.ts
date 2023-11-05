import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Renderer2
} from "@angular/core";

import { IconName, IconNamesEnum } from "./generated";
import { DEFAULT_COLOR, DEFAULT_ICON_SIZE, ICON_COLOR, ICON_HEIGHT, ICON_WIDTH, ICONS_PICKED } from "./icons.config";
import { ColorValueHex, IconsType } from "./types";
import { toEscapedName } from "./internal/toEscapedName";

@Component({
  selector: 'bi, *[bi]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class IconComponent implements OnInit, OnChanges {
  @Input({required: true}) name!: IconName | IconNamesEnum;

  @Input() public width : string = inject(ICON_WIDTH);

  @Input() public height : string= inject(ICON_HEIGHT);

  @Input() public color?: ColorValueHex = inject(ICON_COLOR);

  @Input({transform: booleanAttribute}) public clearDimensions = false;

  @Input() public ariaLabel?: string;

  private elementRef = inject(ElementRef);

  private renderer = inject(Renderer2);

  readonly pickedIcons: IconsType;

  constructor() {
    // icons are provided as an array of objects because of "multi: true"
    this.pickedIcons = Object.assign({}, ...(inject(ICONS_PICKED) as unknown as object[])) as IconsType
  }

  ngOnInit(): void {
    this.renderIcon();
  }

  ngOnChanges(): void {
    this.renderIcon();
  }

  renderIcon(): void {
    const escapedName = toEscapedName(this.name)

    let svg = this.pickedIcons[escapedName] || undefined;

    if (!svg) {
      console.warn(`IconComponent: Icon ${this.name} not found, path: ${escapedName}`);
      return;
    }

    if (!this.clearDimensions) {
      svg = this.setSize(svg, 'width', this.width);
      svg = this.setSize(svg, 'height', this.height);
    }

    if (this.color) {
      svg = this.setFillColor(svg, this.color);
    }

    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-label', this.ariaLabel ?? '');
    if (this.ariaLabel) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'role', 'img');
    }

    this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', svg);
  }

  private setSize = (svg: string, type: DimensionType, size: string): string =>
    svg.replace(this.getSizeText(type), this.getSizeText(type, size));

  private getSizeText = (type: DimensionType, size: string = DEFAULT_ICON_SIZE): string => `${type}="${size}"`;

  private setFillColor = (svg: string, color: string): string =>
    svg.replace(this.getColorText(), this.getColorText(color));

  private getColorText = (color: string = DEFAULT_COLOR): string => `fill="${color}"`;
}

type DimensionType = 'width' | 'height';

