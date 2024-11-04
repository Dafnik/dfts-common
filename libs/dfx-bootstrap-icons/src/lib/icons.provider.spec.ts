/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/ban-ts-comment */
// noinspection DuplicatedCode,ES6PreferShortImport

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiComponent } from './icon.component';
import { provideBi, provideIcons, provideLocalIconsLoader, withColor, withHeight, withIcons, withSize, withWidth } from './icons.provider';
import { allIcons, xCircleFill, zeroCircle } from './generated-index';
import { IconFeatures } from './icons.feature';
import { DEFAULT_ICON_SIZE } from './icons.config';
import { toEscapedName } from './internal/toEscapedName';

describe('IconFeatures ', () => {
  it('test defaults', () => {
    const { fixture, nativeElement } = getNewConfiguration(withIcons({ xCircleFill }));
    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    // @ts-ignore
    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(allIcons[toEscapedName('x-circle-fill')]);

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withIcons', () => {
    const { fixture, component, nativeElement } = getNewConfiguration(withIcons({ xCircleFill, zeroCircle }));

    expect(component.iconLoader('xCircleFill')).toBeDefined();
    expect(component.iconLoader('zeroCircle')).toBeDefined();
    expect(component.iconLoader('xCircle')).toBeUndefined();

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    // @ts-ignore
    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(allIcons[toEscapedName('x-circle-fill')]);

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withWidth', () => {
    const { fixture, nativeElement } = getNewConfiguration(withIcons({ xCircleFill }), withWidth('32'));

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe('32');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withHeight', () => {
    const { fixture, nativeElement } = getNewConfiguration(withIcons({ xCircleFill }), withHeight('32'));

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe('32');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withWidth and withHeight with size input', () => {
    const { fixture, nativeElement } = getNewConfiguration(withIcons({ xCircleFill }), withHeight('48'), withWidth('48'));

    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.componentRef.setInput('size', '36');

    fixture.detectChanges();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe('36');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe('36');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withSize', () => {
    const { fixture, nativeElement } = getNewConfiguration(withIcons({ xCircleFill }), withSize('32'), withWidth('48'));

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe('32');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe('32');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withColor', () => {
    const { fixture, nativeElement } = getNewConfiguration(withIcons({ xCircleFill }), withColor('#123456'));

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('#123456');
  });

  it('test provideIcons', () => {
    void TestBed.configureTestingModule({
      imports: [BiComponent],
      providers: [provideIcons({ xCircleFill, zeroCircle }), provideLocalIconsLoader()],
    }).compileComponents();

    const fixture = TestBed.createComponent(BiComponent) as ComponentFixture<BiComponent>;

    const component = fixture.componentInstance,
      nativeElement = fixture.nativeElement as HTMLElement;

    expect(component.iconLoader('xCircleFill')).toBeDefined();
    expect(component.iconLoader('zeroCircle')).toBeDefined();
    expect(component.iconLoader('xCircle')).toBeUndefined();

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    // @ts-ignore
    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(allIcons[toEscapedName('x-circle-fill')]);

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withIcons & provideIcons', () => {
    void TestBed.configureTestingModule({
      imports: [BiComponent],
      providers: [provideBi(withIcons({ zeroCircle })), provideIcons({ xCircleFill })],
    }).compileComponents();

    const fixture = TestBed.createComponent(BiComponent) as ComponentFixture<BiComponent>;

    const component = fixture.componentInstance,
      nativeElement = fixture.nativeElement as HTMLElement;

    expect(component.iconLoader('xCircleFill')).toBeDefined();
    expect(component.iconLoader('zeroCircle')).toBeDefined();
    expect(component.iconLoader('xCircle')).toBeUndefined();

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    // @ts-ignore
    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(allIcons[toEscapedName('x-circle-fill')]);

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });
});

function getAttributeValue(text: string | undefined, attributeName: string): string | undefined {
  const match = text?.match(new RegExp(attributeName + '="([^"]+)"'));
  return match ? match[1] : undefined;
}

function getNewConfiguration(...features: IconFeatures[]) {
  void TestBed.configureTestingModule({
    imports: [BiComponent],
    providers: [provideBi(...features)],
  }).compileComponents();

  const fixture = TestBed.createComponent(BiComponent) as ComponentFixture<BiComponent>;

  return {
    fixture,
    component: fixture.componentInstance,
    nativeElement: fixture.nativeElement as HTMLElement,
  };
}
