/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/ban-ts-comment */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiNameList } from './generated-index';
import { BiComponent } from './icon.component';
import { awaitTimeout, getAttributeValue, getIcon, provideTestIconsLoader } from './util.spec';

describe('SVG Icons', () => {
  let fixture: ComponentFixture<BiComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [BiComponent],
      providers: [provideTestIconsLoader()],
    }).compileComponents();

    fixture = TestBed.createComponent(BiComponent) as typeof fixture;
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  for (const name of BiNameList) {
    it(`load right svg for ${name} icon`, async () => {
      fixture.componentRef.setInput('name', name);
      fixture.detectChanges();
      await awaitTimeout();
      expect(nativeElement.querySelector('svg')?.outerHTML).toBe(await getIcon(name));
    });
  }

  it(`load right svg changes`, async () => {
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.detectChanges();
    await awaitTimeout();
    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(await getIcon('x-circle-fill'));

    fixture.componentRef.setInput('name', 'x-circle');
    fixture.detectChanges();
    await awaitTimeout();
    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(await getIcon('x-circle'));
  });
});

describe('IconComponent', () => {
  let fixture: ComponentFixture<BiComponent>;
  let nativeElement: HTMLElement;
  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [BiComponent],
      providers: [provideTestIconsLoader()],
    }).compileComponents();
    fixture = TestBed.createComponent(BiComponent) as typeof fixture;
    nativeElement = fixture.nativeElement as HTMLElement;
  });
  it('test default width', async () => {
    const attribute = 'width';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.detectChanges();
    await awaitTimeout();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, attribute)).toBe('16');
  });
  it('test default height', async () => {
    const attribute = 'height';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.detectChanges();
    await awaitTimeout();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, attribute)).toBe('16');
  });
  it('test default color', async () => {
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.detectChanges();
    await awaitTimeout();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });
  it('test width attribute', async () => {
    const attribute = 'width';
    const value = '32';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.componentRef.setInput(attribute, value);
    fixture.detectChanges();
    await awaitTimeout();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, attribute)).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe(`0 0 16 16`);
  });
  it('test height attribute', async () => {
    const attribute = 'height';
    const value = '32';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.componentRef.setInput(attribute, value);
    fixture.detectChanges();
    await awaitTimeout();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, attribute)).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe(`0 0 16 16`);
  });
  it('test size attribute', async () => {
    const value = '32';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.componentRef.setInput('size', value);
    fixture.componentRef.setInput('height', '48');
    fixture.componentRef.setInput('width', '48');
    fixture.detectChanges();
    await awaitTimeout();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe(`0 0 16 16`);
  });
  it('test width & height attribute', async () => {
    const value = '32';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.componentRef.setInput('width', value);
    fixture.componentRef.setInput('height', value);
    fixture.detectChanges();
    await awaitTimeout();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe(`0 0 16 16`);
  });
  it('test color attribute', async () => {
    const value = '#123456';
    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.componentRef.setInput('color', value);
    fixture.detectChanges();
    await awaitTimeout();
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe(value);
  });
});
