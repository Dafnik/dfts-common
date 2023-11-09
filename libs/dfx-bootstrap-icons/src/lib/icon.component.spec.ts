/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/ban-ts-comment */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BiComponent } from "./icon.component";
import { provideBi, withIcons } from "./icons.provider";
import { allIcons, BiNameList } from "./generated";
import { toEscapedName } from "./internal/toEscapedName";

describe("SVG Icons", () => {
  let component: BiComponent;
  let fixture: ComponentFixture<BiComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [BiComponent],
      providers: [
        provideBi(withIcons(allIcons))
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BiComponent) as typeof fixture;
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  for (const name of BiNameList) {
    it(`load right svg for ${name} icon`, () => {
      component.name = name;
      fixture.detectChanges();
      // @ts-ignore
      expect(nativeElement.querySelector("svg")?.outerHTML).toBe(allIcons[toEscapedName(name)]);
    });
  }

  it(`load right svg changes`, () => {
    component.name = "x-circle-fill";
    fixture.detectChanges();
    // @ts-ignore
    expect(nativeElement.querySelector("svg")?.outerHTML).toBe(allIcons[toEscapedName("x-circle-fill")]);

    component.name = "x-circle";
    fixture.detectChanges();
    // @ts-ignore
    // expect(nativeElement.querySelector("div")?.innerHTML).toBe(allIcons[toEscapedName("x-circle")]);
  });
});


describe("IconComponent", () => {
  let component: BiComponent;
  let fixture: ComponentFixture<BiComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [BiComponent],
      providers: [
        provideBi(withIcons(allIcons))
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BiComponent) as typeof fixture;
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
  });


  it("test default width", () => {
    const attribute = "width";
    component.name = "x-circle-fill";

    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector("svg")?.outerHTML, attribute)).toBe("16");
  });

  it("test default height", () => {
    const attribute = "height";
    component.name = "x-circle-fill";

    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector("svg")?.outerHTML, attribute)).toBe("16");
  });

  it("test default color", () => {
    component.name = "x-circle-fill";

    fixture.detectChanges();

    expect(getAttributeValue(nativeElement.querySelector("svg")?.outerHTML, "fill")).toBe("currentColor");
  });

  it("test width attribute", () => {
    const attribute = "width";
    const value = "32";
    component.name = "x-circle-fill";

    component[attribute] = value;
    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector("svg")?.outerHTML, attribute)).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector("svg")?.outerHTML, 'viewBox')).toBe(`0 0 16 16`);
  });

  it("test height attribute", () => {
    const attribute = "height";
    const value = "32";
    component.name = "x-circle-fill";

    component[attribute] = value;
    fixture.detectChanges();

    expect(getAttributeValue(nativeElement.querySelector("svg")?.outerHTML, attribute)).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector("svg")?.outerHTML, 'viewBox')).toBe(`0 0 16 16`);
  });


  it("test width & height attribute", () => {
    const value = "32";
    component.name = "x-circle-fill";

    component["width"] = value;
    component["height"] = value;
    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector("svg")?.outerHTML, "width")).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector("svg")?.outerHTML, "height")).toBe(value);
    expect(getAttributeValue(nativeElement.querySelector("svg")?.outerHTML, 'viewBox')).toBe(`0 0 16 16`);
  });

  it("test color attribute", () => {
    const value = "#123456";
    component.name = "x-circle-fill";

    component.color = value;
    fixture.detectChanges();
    expect(getAttributeValue(nativeElement.querySelector("svg")?.outerHTML, 'fill')).toBe(value);
  });
});

function getAttributeValue(text: string|undefined, attributeName: string): string|undefined {
  const match = text?.match(new RegExp(attributeName + '="([^"]+)"'))
  return match ? match[1] : undefined;
}
