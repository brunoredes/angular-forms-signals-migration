import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerDetailsStep } from './passenger-details-step';

describe('PassengerDetailsStep', () => {
  let component: PassengerDetailsStep;
  let fixture: ComponentFixture<PassengerDetailsStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerDetailsStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerDetailsStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
