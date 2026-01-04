import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PassengerDetailForm } from '../../model/flight';


@Component({
  selector: 'app-passenger-details-step',
  imports: [ReactiveFormsModule],
  templateUrl: './passenger-details-step.html',
  styleUrls: ['./passenger-details-step.scss', '../../shared/flight-booking-shared.styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassengerDetailsStep {
  passengerDetailsArray = input.required<FormArray<FormGroup<PassengerDetailForm>>>();
  next = output<void>();
  previous = output<void>();

  onNext(): void {
    if (this.passengerDetailsArray().valid) {
      this.next.emit();
    } else {
      this.passengerDetailsArray().markAllAsTouched();
    }
  }

  onPrevious(): void {
    this.previous.emit();
  }

  getPassengerControl(index: number, field: string): any {
    return this.passengerDetailsArray().at(index).get(field);
  }

  isFieldInvalid(control: AbstractControl<PassengerDetailForm>): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(control: AbstractControl<PassengerDetailForm>): string {
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    if (control.errors['pattern']) return 'Invalid format';

    return 'Invalid field';
  }
}
