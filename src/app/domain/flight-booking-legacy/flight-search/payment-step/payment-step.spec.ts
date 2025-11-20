import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStep } from './payment-step';

describe('PaymentStep', () => {
  let component: PaymentStep;
  let fixture: ComponentFixture<PaymentStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
