import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {subscribeSpyTo} from '@hirez_io/observer-spy';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {serviceStub, TRANSLATE_SET_LANGUAGE_FN} from '../test-helper';
import {provideDfxTranslate} from '../translate.provider';
import {TranslateStore} from '../service/translate.store';
import {dfxTranslateSetLanguage} from '../service/set-language';
import {dfxTranslateSetLanguageFn} from '../types';
import {TRANSLATE_DEFAULT_LANGUAGE, withDefaultLanguage} from '../features/default-language/default-language';
import {TRANSLATE_REMEMBER_LANGUAGE, withRememberLanguage} from '../features/remember-language/remember-language';
import {TRANSLATE_AUTO_TRANSLATED_LANGUAGES} from '../features/auto-translated-languages/auto-translated-languages';
import {DfxTrB} from './trb';
import {withDefaultUndefinedOrNullBooleanTo} from '../features/default-undefined-boolean-to/default-undefined-boolean-to';

@Component({
  template: '<div>{{ translateKey | trb }}</div>',
})
class TestTranslateDirectiveComponent {
  translateKey?: boolean;
}

describe('TranslateBooleanDirective', () => {
  let component: TestTranslateDirectiveComponent;
  let fixture: ComponentFixture<TestTranslateDirectiveComponent>;
  let nativeElement: HTMLElement;
  let translateStore: TranslateStore;
  let setLanguage: dfxTranslateSetLanguageFn;

  beforeEach(() => {
    localStorage.clear();

    void TestBed.configureTestingModule({
      declarations: [TestTranslateDirectiveComponent],
      imports: [DfxTrB],
      providers: [
        {provide: HttpClient, useValue: serviceStub},
        provideDfxTranslate(withRememberLanguage(false)),
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

  it('should use configured values', () => {
    expect(TestBed.inject(TRANSLATE_DEFAULT_LANGUAGE)).toBe('en');
    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES).length).toBe(0);
    expect(TestBed.inject(TRANSLATE_REMEMBER_LANGUAGE)).toBeFalsy();

    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('en');

    expect(localStorage.getItem('language')).toBeNull();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty', () => {
    expect(nativeElement.querySelector('div')?.textContent).toBe('');
  });

  it('should return true', () => {
    component.translateKey = true;
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('TRUE');
  });

  it('should return false', () => {
    component.translateKey = false;
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('FALSE');
  });

  it('should return value after selecting other language', () => {
    component.translateKey = true;
    setLanguage('de');
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('Richtig');
  });

  it('should return other value after selecting other language', () => {
    component.translateKey = false;
    setLanguage('de');
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('Falsch');
  });
});

describe('TranslateBooleanDirective with default undefined to', () => {
  it('should return true on undefined', () => {
    void TestBed.configureTestingModule({
      declarations: [TestTranslateDirectiveComponent],
      imports: [DfxTrB],
      providers: [
        {provide: HttpClient, useValue: serviceStub},
        provideDfxTranslate(withRememberLanguage(false), withDefaultUndefinedOrNullBooleanTo(true)),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestTranslateDirectiveComponent);
    const nativeElement = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    expect(nativeElement.querySelector('div')?.textContent).toBe('TRUE');
  });

  it('should return false on undefined', () => {
    void TestBed.configureTestingModule({
      declarations: [TestTranslateDirectiveComponent],
      imports: [DfxTrB],
      providers: [
        {provide: HttpClient, useValue: serviceStub},
        provideDfxTranslate(withRememberLanguage(false), withDefaultUndefinedOrNullBooleanTo(false)),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestTranslateDirectiveComponent);
    const nativeElement = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    expect(nativeElement.querySelector('div')?.textContent).toBe('FALSE');
  });

  it('should return Falsch on undefined', () => {
    void TestBed.configureTestingModule({
      declarations: [TestTranslateDirectiveComponent],
      imports: [DfxTrB],
      providers: [
        {provide: HttpClient, useValue: serviceStub},
        provideDfxTranslate(withRememberLanguage(false), withDefaultUndefinedOrNullBooleanTo(false), withDefaultLanguage('de')),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestTranslateDirectiveComponent);
    const nativeElement = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    expect(nativeElement.querySelector('div')?.textContent).toBe('Falsch');
  });

  it('should return Richtig on undefined', () => {
    void TestBed.configureTestingModule({
      declarations: [TestTranslateDirectiveComponent],
      imports: [DfxTrB],
      providers: [
        {provide: HttpClient, useValue: serviceStub},
        provideDfxTranslate(withRememberLanguage(false), withDefaultUndefinedOrNullBooleanTo(true), withDefaultLanguage('de')),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestTranslateDirectiveComponent);
    const nativeElement = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    expect(nativeElement.querySelector('div')?.textContent).toBe('Richtig');
  });
});
