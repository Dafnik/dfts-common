import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DfxTableModule } from './table-module';
import { NgbRow } from './row';

describe('dfx-bootstrap-table', () => {
  let component: NgbRow;
  let fixture: ComponentFixture<NgbRow>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DfxTableModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbRow);
    component = fixture.componentInstance;


    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
