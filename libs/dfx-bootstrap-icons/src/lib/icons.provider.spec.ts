// noinspection DuplicatedCode,ES6PreferShortImport
import { isPlatformBrowser } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiComponent } from './icon.component';
import { DEFAULT_ICON_SIZE } from './icons.config';
import { IconFeatures } from './icons.feature';
import { provideBi, provideCDNIconsLoader, withCDN, withColor, withHeight, withSize, withWidth } from './icons.provider';
import { awaitTimeout, getAttributeValue, getIcon, provideTestIconsLoader } from './util.spec';

describe('IconFeatures ', () => {
  it('test defaults', async () => {
    const { fixture, nativeElement } = getNewConfiguration([withCDN('https://playground.dafnik.me/bootstrap-icons/icons')], {
      testIconsLoader: false,
    });
    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    await awaitTimeout(1000);

    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(await getIcon('x-circle-fill'));

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withCDN string', async () => {
    const { fixture, component, nativeElement } = getNewConfiguration([withCDN('https://playground.dafnik.me/bootstrap-icons/icons')], {
      testIconsLoader: false,
    });

    expect(component.iconLoader).toBeDefined();

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    await awaitTimeout(1000);

    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(await getIcon('x-circle-fill'));

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withCDN function', async () => {
    const { fixture, component, nativeElement } = getNewConfiguration(
      [
        withCDN(() => {
          const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

          console.log('injection test', isBrowser);

          return 'https://playground.dafnik.me/bootstrap-icons/icons';
        }),
      ],
      { testIconsLoader: false },
    );

    expect(component.iconLoader).toBeDefined();

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    await awaitTimeout(1000);

    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(await getIcon('x-circle-fill'));

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withWidth', async () => {
    const { fixture, nativeElement } = getNewConfiguration([withWidth('32')]);

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    await awaitTimeout();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe('32');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withHeight', async () => {
    const { fixture, nativeElement } = getNewConfiguration([withHeight('32')]);

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    await awaitTimeout();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe('32');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withWidth and withHeight with size input', async () => {
    const { fixture, nativeElement } = getNewConfiguration([withHeight('48'), withWidth('48')]);

    fixture.componentRef.setInput('name', 'x-circle-fill');
    fixture.componentRef.setInput('size', '36');

    fixture.detectChanges();

    await awaitTimeout();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe('36');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe('36');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withSize', async () => {
    const { fixture, nativeElement } = getNewConfiguration([withSize('32'), withWidth('48')]);

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    await awaitTimeout();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe('32');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe('32');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withColor', async () => {
    const { fixture, nativeElement } = getNewConfiguration([withColor('#123456')]);

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    await awaitTimeout();

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('#123456');
  });

  it('test provideIcons', async () => {
    void TestBed.configureTestingModule({
      imports: [BiComponent],
      providers: [provideHttpClient(), provideCDNIconsLoader('https://playground.dafnik.me/bootstrap-icons/icons')],
    }).compileComponents();

    const fixture = TestBed.createComponent(BiComponent) as ComponentFixture<BiComponent>;

    const component = fixture.componentInstance,
      nativeElement = fixture.nativeElement as HTMLElement;

    expect(component.iconLoader('xCircleFill')).toBeDefined();
    expect(component.iconLoader('zeroCircle')).toBeDefined();
    expect(component.iconLoader('xCircle')).toBeDefined();

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    await awaitTimeout(1000);

    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(await getIcon('x-circle-fill'));

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });

  it('test withIcons & provideIcons', async () => {
    void TestBed.configureTestingModule({
      imports: [BiComponent],
      providers: [
        provideHttpClient(),
        provideBi(withCDN('https://playground.dafnik.me/bootstrap-icons/icons')),
        provideCDNIconsLoader('https://playground.dafnik.me/bootstrap-icons/icons'),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(BiComponent) as ComponentFixture<BiComponent>;

    const component = fixture.componentInstance,
      nativeElement = fixture.nativeElement as HTMLElement;

    expect(component.iconLoader('xCircleFill')).toBeDefined();
    expect(component.iconLoader('zeroCircle')).toBeDefined();
    expect(component.iconLoader('xCircle')).toBeDefined();

    fixture.componentRef.setInput('name', 'x-circle-fill');

    fixture.detectChanges();

    await awaitTimeout(1000);

    expect(nativeElement.querySelector('svg')?.outerHTML).toBe(await getIcon('x-circle-fill'));

    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'width')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'height')).toBe(DEFAULT_ICON_SIZE);
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'viewBox')).toBe('0 0 16 16');
    expect(getAttributeValue(nativeElement.querySelector('svg')?.outerHTML, 'fill')).toBe('currentColor');
  });
});

function getNewConfiguration(features: IconFeatures[], options: { testIconsLoader: boolean } = { testIconsLoader: true }) {
  void TestBed.configureTestingModule({
    imports: [BiComponent],
    providers: [provideBi(...features), options.testIconsLoader ? provideTestIconsLoader() : provideHttpClient()],
  }).compileComponents();

  const fixture = TestBed.createComponent(BiComponent) as ComponentFixture<BiComponent>;

  return {
    fixture,
    component: fixture.componentInstance,
    nativeElement: fixture.nativeElement as HTMLElement,
  };
}
