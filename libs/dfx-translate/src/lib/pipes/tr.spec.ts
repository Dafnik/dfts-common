import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {subscribeSpyTo} from '@hirez_io/observer-spy';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {serviceStub, TRANSLATE_SET_LANGUAGE_FN} from '../test-helper';
import {provideDfxTranslate} from '../translate.provider';
import {TranslateStore} from '../service/translate.store';
import {DfxTr} from './tr';
import {dfxTranslateSetLanguage} from '../service/set-language';
import {dfxTranslateSetLanguageFn} from '../types';
import {TRANSLATE_DEFAULT_LANGUAGE} from '../features/default-language/default-language';
import {TRANSLATE_REMEMBER_LANGUAGE, withRememberLanguage} from '../features/remember-language/remember-language';
import {
  TRANSLATE_AUTO_TRANSLATED_LANGUAGES,
  withAutoTranslatedLanguages,
} from '../features/auto-translated-languages/auto-translated-languages';

@Component({
  template: '<div>{{ translateKey | tr }}</div>',
})
class TestTranslateDirectiveComponent {
  translateKey?: string;
}

describe('TranslateDirective', () => {
  let component: TestTranslateDirectiveComponent;
  let fixture: ComponentFixture<TestTranslateDirectiveComponent>;
  let nativeElement: HTMLElement;
  let translateStore: TranslateStore;
  let setLanguage: dfxTranslateSetLanguageFn;

  beforeEach(() => {
    localStorage.clear();

    void TestBed.configureTestingModule({
      declarations: [TestTranslateDirectiveComponent],
      imports: [DfxTr],
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

  it('should return key', () => {
    component.translateKey = 'key';
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('key');
  });

  it('should return value', () => {
    component.translateKey = 'testkey1';
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('testanswer1');
  });

  it('should return other value', () => {
    component.translateKey = 'testkey2';
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('testanswer2');
  });

  it('should return other value after selecting other language', () => {
    component.translateKey = 'testkey1';
    setLanguage('de');
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('testanswer1_DE');
    setLanguage('en');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div')?.textContent).toBe('testanswer1');
  });

  it('should return other value after selecting other language', () => {
    component.translateKey = 'testkey2';
    setLanguage('de');
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('testanswer2_DE');
  });
});

describe('TranslateDirectiveWithAuto', () => {
  let component: TestTranslateDirectiveComponent;
  let fixture: ComponentFixture<TestTranslateDirectiveComponent>;
  let nativeElement: HTMLElement;
  let translateStore: TranslateStore;
  let setLanguage: dfxTranslateSetLanguageFn;

  beforeEach(() => {
    localStorage.clear();

    void TestBed.configureTestingModule({
      declarations: [TestTranslateDirectiveComponent],
      imports: [DfxTr],
      providers: [
        {provide: HttpClient, useValue: serviceStub},
        provideDfxTranslate(withRememberLanguage(false), withAutoTranslatedLanguages(['de'])),
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
    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES).length).toBe(1);
    expect(TestBed.inject(TRANSLATE_REMEMBER_LANGUAGE)).toBeFalsy();

    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('en');

    expect(localStorage.getItem('language')).toBeNull();
  });

  it('should autotranslated language be defined', () => {
    expect(subscribeSpyTo(translateStore.autoGeneratedTranslations$).getLastValue()).toStrictEqual({});
    setLanguage('de');
    expect(subscribeSpyTo(translateStore.autoGeneratedTranslations$).getLastValue()).not.toBe({});
  });

  it('should return empty with auto generated', () => {
    expect(nativeElement.querySelector('div')?.textContent).toBe('');
  });

  it('should return key with auto generated', () => {
    component.translateKey = 'key';
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('key');
  });

  it('should return value', () => {
    component.translateKey = 'testkey1';
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('testanswer1');
  });

  it('should return other value', () => {
    component.translateKey = 'testkey2';
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('testanswer2');
  });

  it('should return autogenerated value', () => {
    component.translateKey = 'testkey4';
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('testanswer4');
  });

  it('should return value after selecting other language', () => {
    component.translateKey = 'testkey1';
    setLanguage('de');
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('testanswer1_DE');
  });

  it('should return autogenerated value after selecting other language', () => {
    component.translateKey = 'testkey4';
    setLanguage('de');
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('testanswer4_DE_auto');
  });

  it('should return other value after selecting other language', () => {
    component.translateKey = 'testkey2';
    setLanguage('de');
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('testanswer2_DE');
  });
});
