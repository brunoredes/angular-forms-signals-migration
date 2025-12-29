import { Component, input, output } from '@angular/core';
import { Field, FieldState, FieldTree } from '@angular/forms/signals';
import { FormErrorMessage } from '../../../../shared/components/form-error-message/form-error-message';
import { FlightDetails } from '../../models/flight';

@Component({
  selector: 'app-flight-details-step',
  imports: [FormErrorMessage, Field],
  templateUrl: './flight-details-step.html',
  styleUrls: ['./flight-details-step.scss', '../../../flight-booking-legacy/shared/flight-booking-shared.styles.scss'],
})
export class FlightDetailsStep {
  flightDetails = input.required<FieldTree<FlightDetails>>();
  next = output();

  onNext(): void {
    this.next.emit();
  }

  isFieldInvalid(field: FieldState<string | number, string>): boolean {
    return field.invalid() && (field.dirty() || field.touched());
  }

  getFieldError(field: any): string | null {
    const errors = field.errors();
    if (!errors) return null;

    // Como você já está registrando messages nos validators, basta retornar a first.
    const firstKey = Object.keys(errors)[0];
    return errors[firstKey].message ?? null;
  }
}
