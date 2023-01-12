import {Component, DebugElement} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DfxTranslateModule} from '../dfx-translate.module';
import {TranslateService} from '../translate.service';
import {serviceStub} from '../test-helper';

@Component({
  template: '<div>{{ translateKey | tra | async }}</div>',
})
class TestTranslateDirectiveComponent {
  translateKey?: string;
}

describe('TranslateAutoDirective', () => {
  let component: TestTranslateDirectiveComponent;
  let fixture: ComponentFixture<TestTranslateDirectiveComponent>;
  let de: DebugElement;
  let translateService: TranslateService;

  beforeEach(() => {
    localStorage.clear();

    void TestBed.configureTestingModule({
      declarations: [TestTranslateDirectiveComponent],
      imports: [
        DfxTranslateModule.setup({
          libreTranslateInstanceUrl: 'https://test.i.activate.this.feature',
          useLocalStorage: false,
        }),
      ],
      providers: [{provide: HttpClient, useValue: serviceStub}],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);

    fixture = TestBed.createComponent(TestTranslateDirectiveComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should return undefined', () => {
    expect((de.query(By.css('div')).nativeElement as HTMLElement).innerText).toBe('');
  });

  it('should return other value after selecting other language', async () => {
    await translateService.use('de');
    component.translateKey = 'Hello';
    fixture.detectChanges();
    expect((de.query(By.css('div')).nativeElement as HTMLElement).innerText).toBe('Hallo');
  });
});
