/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/ban-ts-comment */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiComponent } from './icon.component';
import { provideBi, provideIcons, withColor, withHeight, withIcons, withWidth } from './icons.provider';
import { allIcons, xCircleFill, zeroCircle } from './generated';
import { IconFeatures } from './icons.feature';
import { DEFAULT_ICON_SIZE } from './icons.config';
import { toEscapedName } from './internal/toEscapedName';

describe('IconFeatures ', () => {
  it('test defaults', () => {
    const { fixture, component, nativeElement } = getNewConfiguration(withIcons({ xCircleFill }));
    component.name = 'x-circle-fill';

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

    expect(component.pickedIcons['xCircleFill']).toBeDefined();
    expect(component.pickedIcons['zeroCircle']).toBeDefined();
    expect(component.pickedIcons['xCircle']).toBeUndefined();

    component.name = 'x-circle-fill';

    fixture.detectChanges();

    // @ts-ignore
    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(allIcons[toEscapedName('x-circle-fill')]);

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withWidth', () => {
    const { fixture, component, nativeElement } = getNewConfiguration(withIcons({ xCircleFill }), withWidth('32'));

    component.name = 'x-circle-fill';

    fixture.detectChanges();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe('32');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withHeight', () => {
    const { fixture, component, nativeElement } = getNewConfiguration(withIcons({ xCircleFill }), withHeight('32'));

    component.name = 'x-circle-fill';

    fixture.detectChanges();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe('32');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withColor', () => {
    const { fixture, component, nativeElement } = getNewConfiguration(withIcons({ xCircleFill }), withColor('#123456'));

    component.name = 'x-circle-fill';

    fixture.detectChanges();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('#123456');
  });

  it('test provideIcons', () => {
    void TestBed.configureTestingModule({
      imports: [BiComponent],
      providers: [provideIcons({ xCircleFill, zeroCircle })],
    }).compileComponents();

    const fixture = TestBed.createComponent(BiComponent) as ComponentFixture<BiComponent>;

    const component = fixture.componentInstance,
      nativeElement = fixture.nativeElement as HTMLElement;

    expect(component.pickedIcons['xCircleFill']).toBeDefined();
    expect(component.pickedIcons['zeroCircle']).toBeDefined();
    expect(component.pickedIcons['xCircle']).toBeUndefined();

    component.name = 'x-circle-fill';

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

    expect(component.pickedIcons['xCircleFill']).toBeDefined();
    expect(component.pickedIcons['zeroCircle']).toBeDefined();
    expect(component.pickedIcons['xCircle']).toBeUndefined();

    component.name = 'x-circle-fill';

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
