import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletoForm } from './boleto-form';

describe('BoletoForm', () => {
  let component: BoletoForm;
  let fixture: ComponentFixture<BoletoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoletoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoletoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
