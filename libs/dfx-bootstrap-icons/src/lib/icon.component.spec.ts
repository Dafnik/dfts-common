/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/ban-ts-comment */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiComponent } from './icon.component';
import { provideBi, withIcons } from './icons.provider';
import { allIcons, BiNameList } from './generated';
import { toEscapedName } from './internal/toEscapedName';

describe('SVG Icons', () => {
  let fixture: ComponentFixture<BiComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [BiComponent],
      providers: [provideBi(withIcons(allIcons))],
    }).compileComponents();

    fixture = TestBed.createComponent(BiComponent) as typeof fixture;
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  for (const name of BiNameList) {
    it(`load right svg for ${name} icon`, () => {
      fixture.componentRef.setInput('name', name);
      fixture.detectChanges();
      // @ts-ignore
      expect(nativeElement.querySelector('svg')?.outerHTML).toBe(allIcons[toEscapedName(name)]);
    });
  }

  it(`load right svg changes`, () => {
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.detectChanges();
    // @ts-ignore
    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(allIcons[toEscapedName('x-circle-fill')]);

    fixture.componentRef.setInput('name', 'x-circle');
    fixture.detectChanges();
    // @ts-ignore
    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(allIcons[toEscapedName('x-circle')]);
  });
});

describe('IconComponent', () => {
  let fixture: ComponentFixture<BiComponent>;
  let nativeElement: HTMLElement;
  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [BiComponent],
      providers: [provideBi(withIcons(allIcons))],
    }).compileComponents();
    fixture = TestBed.createComponent(BiComponent) as typeof fixture;
    nativeElement = fixture.nativeElement as HTMLElement;
  });
  it('test default width', () => {
    const attribute = 'width';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, attribute)).toBe('16');
  });
  it('test default height', () => {
    const attribute = 'height';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, attribute)).toBe('16');
  });
  it('test default color', () => {
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });
  it('test width attribute', () => {
    const attribute = 'width';
    const value = '32';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.componentRef.setInput(attribute, value);
    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, attribute)).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe(`0 0 16 16`);
  });
  it('test height attribute', () => {
    const attribute = 'height';
    const value = '32';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.componentRef.setInput(attribute, value);
    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, attribute)).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe(`0 0 16 16`);
  });
  it('test size attribute', () => {
    const value = '32';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.componentRef.setInput('size', value);
    fixture.componentRef.setInput('height', '48');
    fixture.componentRef.setInput('width', '48');
    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe(`0 0 16 16`);
  });
  it('test width & height attribute', () => {
    const value = '32';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.componentRef.setInput('width', value);
    fixture.componentRef.setInput('height', value);
    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe(`0 0 16 16`);
  });
  it('test color attribute', () => {
    const value = '#123456';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.componentRef.setInput('color', value);
    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe(value);
  });
});

function getAttributeValue(text: string | undefined, attributeName: string): string | undefined {
  const match = text?.match(new RegExp(attributeName + '="([^"]+)"'));
  return match ? match[1] : undefined;
}
