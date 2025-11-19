import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBookingLegacy } from './flight-booking-legacy';

describe('FlightBookingLegacy', () => {
  let component: FlightBookingLegacy;
  let fixture: ComponentFixture<FlightBookingLegacy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightBookingLegacy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightBookingLegacy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
