import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDetailsStep } from './flight-details-step';

describe('FlightDetailsStep', () => {
  let component: FlightDetailsStep;
  let fixture: ComponentFixture<FlightDetailsStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightDetailsStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightDetailsStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
