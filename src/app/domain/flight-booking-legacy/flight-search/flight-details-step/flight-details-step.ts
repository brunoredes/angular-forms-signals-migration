import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlightDetailsForm, PassengersForm } from '../../model/flight';


@Component({
  selector: 'app-flight-details-step',
  imports: [ReactiveFormsModule],
  templateUrl: './flight-details-step.html',
  styleUrl: './flight-details-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightDetailsStep {
  formGroup = input.required<FormGroup<FlightDetailsForm>>();;
  next = output();

  onNext(): void {
    if (this.formGroup().valid) {
      this.next.emit();
    } else {
      this.formGroup().markAllAsTouched();
    }
  }

  get passengersGroup(): FormGroup<PassengersForm> {
    return this.formGroup().controls.passengers;
  }

  isFieldInvalid(control: any): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(control: any): string {
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    if (control.errors['min']) return `Minimum value is ${control.errors['min'].min}`;
    if (control.errors['max']) return `Maximum value is ${control.errors['max'].max}`;

    return 'Invalid field';
  }
}
