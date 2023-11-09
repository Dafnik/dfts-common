import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DfxTableModule } from './table-module';
import { NgbRow } from './row';

describe('dfx-bootstrap-table', () => {
  let de: DebugElement;
  let component: NgbRow;
  let fixture: ComponentFixture<NgbRow>;

  const styleSheet: { [key: string]: { [key: string]: string } } = {
    h2: { border: 'solid 1px' },
    h1: { color: 'red', border: '1px solid' },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DfxTableModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbRow);
    component = fixture.componentInstance;

    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
