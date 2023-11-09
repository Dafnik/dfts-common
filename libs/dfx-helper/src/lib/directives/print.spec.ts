/*
Copyright belongs to https://github.com/selemxmn/ngx-print
Licensed under MIT license
 */
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DfxPrint } from './print';

@Component({
  template: `
    <div id="print-section">
      <h1>Welcome to ngx-print</h1>
      <img
        width="300"
        alt="Angular Logo"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg=="
      />
      <h2>Here are some links to help you start:</h2>
      <ul>
        <li>
          <h2><a target="_blank" rel="noopener" href="https://angular.io/tutorial">Tour of Heroes</a></h2>
        </li>
        <li>
          <h2><a target="_blank" rel="noopener" href="https://github.com/angular/angular-cli/wiki">CLI Documentation</a></h2>
        </li>
        <li>
          <h2><a target="_blank" rel="noopener" href="https://blog.angular.io/">Angular blog</a></h2>
        </li>
      </ul>
      <table>
        <tr>
          <td>Row 1, Column 1</td>
          <td>Row 1, Column 2</td>
        </tr>
        <tr>
          <td>Row 2, Column 1</td>
          <td>Row 2, Column 2</td>
        </tr>
      </table>
    </div>
    <button printSectionId="print-section" print></button>
  `,
})
class TestDfxPrintComponent {}

describe('DfxPrintDirective', () => {
  let buttonEl: DebugElement;
  let de: DebugElement;
  let component: TestDfxPrintComponent;
  let fixture: ComponentFixture<TestDfxPrintComponent>;

  const styleSheet: { [key: string]: { [key: string]: string } } = {
    h2: { border: 'solid 1px' },
    h1: { color: 'red', border: '1px solid' },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestDfxPrintComponent],
      imports: [DfxPrint],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDfxPrintComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement;

    // Get the button element (on which we tag the directive) to simulate clicks on it
    buttonEl = de.query(By.directive(DfxPrint));

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should test the input printStyle via object', () => {
    const directive = new DfxPrint();
    directive.printStyle = styleSheet;

    expect(directive.getStyleValues()).toEqual('<style> h2{border:solid 1px} h1{color:red;border:1px solid} </style>');
  });

  it('should test the input printStyle via array', () => {
    const directive = new DfxPrint();
    directive.printStyle = ['h2{border:solid 1px}', 'h1{color:red,border:1px solid}'];

    expect(directive.getStyleValues()).toEqual('<style> h2{border:solid 1px} h1{color:red;border:1px solid} </style>');
  });

  it('should popup a new window', () => {
    window.open = jest.fn();
    // simulate click
    buttonEl.triggerEventHandler('click', {});
    expect(window.open).toHaveBeenCalled();
  });
});
