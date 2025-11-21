import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixForm } from './pix-form';

describe('PixForm', () => {
  let component: PixForm;
  let fixture: ComponentFixture<PixForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PixForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
