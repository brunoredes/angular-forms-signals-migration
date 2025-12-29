import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesStep } from './services-step';

describe('ServicesStep', () => {
  let component: ServicesStep;
  let fixture: ComponentFixture<ServicesStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
