import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DfxTrackById, DfxTrackByProperty} from './track-by';

interface Player {
  id: number;
  name: string;
}

const players: Player[] = [
  {id: 1, name: 'Playerr 1'},
  {id: 2, name: 'Player 2'},
  {id: 3, name: 'Player 3'},
];

@Component({
  template: `
    <div *ngFor="let player of team; trackByProperty: 'name'">
      {{ player.name }}
    </div>
  `,
})
class TestTrackByPropertyComponent {
  team: Player[];

  constructor() {
    this.team = players;
  }
}

@Component({
  template: `
    <div *ngFor="let player of team; trackById">
      {{ player.name }}
    </div>
  `,
})
class TestTrackByIdComponent {
  team: Player[];

  constructor() {
    this.team = players;
  }
}

describe('TrackByPropertyDirective', () => {
  let listEl: DebugElement;
  let component: TestTrackByPropertyComponent;
  let fixture: ComponentFixture<TestTrackByPropertyComponent>;

  beforeEach(() => {
    // Configure a NgModule-like decorator metadata
    TestBed.configureTestingModule({
      declarations: [TestTrackByPropertyComponent],
      imports: [DfxTrackByProperty],
    });

    // Create a fixture object (that is going to allows us to create an instance of that component)
    fixture = TestBed.createComponent(TestTrackByPropertyComponent);

    // Create a component instance ( ~ new Component)
    component = fixture.componentInstance;

    // Get the button element (on which we tag the directive) to simulate clicks on it
    listEl = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new TestTrackByPropertyComponent();
    expect(directive).toBeTruthy();
  });

  it('list should contain elements', () => {
    expect(component.team.length).toBe(players.length);
  });

  it('list should render 3 elements', () => {
    expect(listEl.children.length).toBe(players.length);
  });
});

describe('TrackByIdDirective', () => {
  let listEl: DebugElement;
  let component: TestTrackByIdComponent;
  let fixture: ComponentFixture<TestTrackByIdComponent>;

  beforeEach(() => {
    // Configure a NgModule-like decorator metadata
    TestBed.configureTestingModule({
      declarations: [TestTrackByIdComponent],
      imports: [DfxTrackById],
    });

    // Create a fixture object (that is going to allows us to create an instance of that component)
    fixture = TestBed.createComponent(TestTrackByIdComponent);

    // Create a component instance ( ~ new Component)
    component = fixture.componentInstance;

    // Get the button element (on which we tag the directive) to simulate clicks on it
    listEl = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new TestTrackByIdComponent();
    expect(directive).toBeTruthy();
  });

  it('list should contain elements', () => {
    expect(component.team.length).toBe(players.length);
  });

  it('list should render 3 elements', () => {
    expect(listEl.children.length).toBe(players.length);
  });
});
