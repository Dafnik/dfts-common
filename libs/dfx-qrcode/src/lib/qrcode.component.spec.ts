import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QRCodeComponent } from './qrcode.component';
import { provideQRCode, withAllowEmptyString } from './qrcode.provider';

describe('dfx-qrcode', () => {
  let de: DebugElement;
  let component: QRCodeComponent;
  let fixture: ComponentFixture<QRCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [QRCodeComponent],
      providers: [provideQRCode(withAllowEmptyString(true))],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QRCodeComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
