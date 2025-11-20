import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LuggageForm, ServicesForm } from '../../model/flight';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services-step',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './services-step.html',
  styleUrl: './services-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesStep {
  formGroup = input.required<FormGroup<ServicesForm>>();
  next = output<void>();
  previous = output<void>();

  onNext(): void {
    if (this.formGroup().valid) {
      this.next.emit();
    } else {
      this.formGroup().markAllAsTouched();
    }
  }

  onPrevious(): void {
    this.previous.emit();
  }

  get luggageGroup(): FormGroup<LuggageForm> {
    return this.formGroup().controls.luggage;
  }
}
