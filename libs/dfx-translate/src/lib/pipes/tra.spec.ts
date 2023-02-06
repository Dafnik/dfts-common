import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {serviceStub, TRANSLATE_SET_LANGUAGE_FN} from '../test-helper';
import {provideDfxTranslate} from '../translate.provider';
import {TranslateStore} from '../service/translate.store';
import {dfxTranslateSetLanguage} from '../service/set-language';
import {DfxTrA} from './tra';
import {dfxTranslateSetLanguageFn} from '../types';
import {withLibreTranslate} from '../features/libre-translate/libre-translate';
import {withRememberLanguage} from '../features/remember-language/remember-language';

@Component({
  template: '<div>{{ translateKey | tra }}</div>',
})
class TestTranslateDirectiveComponent {
  translateKey?: string;
}

describe('TranslateAutoDirective', () => {
  let component: TestTranslateDirectiveComponent;
  let fixture: ComponentFixture<TestTranslateDirectiveComponent>;
  let nativeElement: HTMLElement;
  let translateStore: TranslateStore;
  let setLanguage: dfxTranslateSetLanguageFn;

  beforeEach(() => {
    localStorage.clear();

    void TestBed.configureTestingModule({
      declarations: [TestTranslateDirectiveComponent],
      imports: [DfxTrA],
      providers: [
        {provide: HttpClient, useValue: serviceStub},
        provideDfxTranslate(withRememberLanguage(false), withLibreTranslate('https://test.i.activate.this.feature')),
        {
          provide: TRANSLATE_SET_LANGUAGE_FN,
          useFactory: () => dfxTranslateSetLanguage(),
        },
      ],
    }).compileComponents();

    translateStore = TestBed.inject(TranslateStore);
    setLanguage = TestBed.inject(TRANSLATE_SET_LANGUAGE_FN);

    fixture = TestBed.createComponent(TestTranslateDirectiveComponent) as typeof fixture;
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should return undefined', () => {
    expect(nativeElement.querySelector('div')?.textContent).toBe('');
  });

  it('should return other value after selecting other language', () => {
    setLanguage('de');
    component.translateKey = 'Hello';
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('Hallo');
  });
});

describe('TranslateAutoDirective disabled', () => {
  let component: TestTranslateDirectiveComponent;
  let fixture: ComponentFixture<TestTranslateDirectiveComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    localStorage.clear();

    void TestBed.configureTestingModule({
      declarations: [TestTranslateDirectiveComponent],
      imports: [DfxTrA],
      providers: [{provide: HttpClient, useValue: serviceStub}, provideDfxTranslate(withRememberLanguage(false))],
    }).compileComponents();

    fixture = TestBed.createComponent(TestTranslateDirectiveComponent) as typeof fixture;
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should return undefined', () => {
    expect(nativeElement.querySelector('div')?.textContent).toBe('');
  });

  it('should be disabled', () => {
    component.translateKey = 'Hello';
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('Feature disabled');
  });
});
