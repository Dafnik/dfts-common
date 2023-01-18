import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DfxTranslateModule} from '../dfx-translate.module';
import {TranslateService} from '../service/translate.service';
import {serviceStub} from '../test-helper';
import {lastValueFrom} from 'rxjs';
import {withLibreTranslate, withRememberLanguage} from '../translate.provider';

@Component({
  template: '<div>{{ translateKey | tra | async }}</div>',
})
class TestTranslateDirectiveComponent {
  translateKey?: string;
}

describe('TranslateAutoDirective', () => {
  let component: TestTranslateDirectiveComponent;
  let fixture: ComponentFixture<TestTranslateDirectiveComponent>;
  let nativeElement: HTMLElement;
  let translateService: TranslateService;

  beforeEach(() => {
    localStorage.clear();

    void TestBed.configureTestingModule({
      declarations: [TestTranslateDirectiveComponent],
      imports: [DfxTranslateModule.setup2(withLibreTranslate('https://test.i.activate.this.feature'), withRememberLanguage(false))],
      providers: [{provide: HttpClient, useValue: serviceStub}],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);

    fixture = TestBed.createComponent(TestTranslateDirectiveComponent);
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

  it('should return other value after selecting other language', async () => {
    await lastValueFrom(translateService.use('de'));
    component.translateKey = 'Hello';
    fixture.detectChanges();
    expect(nativeElement.querySelector('div')?.textContent).toBe('Hallo');
  });
});
