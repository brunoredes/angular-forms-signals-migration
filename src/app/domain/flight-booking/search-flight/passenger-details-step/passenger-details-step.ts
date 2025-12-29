import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Field, FieldState, FieldTree } from '@angular/forms/signals';
import { PassengerDetail } from '../../models/flight';
import { FormErrorMessage } from '../../../../shared/components/form-error-message/form-error-message';

@Component({
  selector: 'app-passenger-details-step',
  imports: [Field, FormErrorMessage],
  templateUrl: './passenger-details-step.html',
  styleUrl: './passenger-details-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassengerDetailsStep {
  passengerDetailsArray = input.required<FieldTree<PassengerDetail[]>>();
  next = output();
  previous = output();

  onNext(): void {
    this.next.emit();
  }

  onPrevious() {
    this.previous.emit();
  }

  getPassengerControl(index: number, field: keyof PassengerDetail) {
    const passengers = this.passengerDetailsArray();
    return passengers[index][field];
  }

  isFieldInvalid(field: FieldState<string | number, string>): boolean {
    return field.invalid() && (field.dirty() || field.touched());
  }

  getFieldError(field: any): string | null {
    const errors = field.errors();
    if (!errors) return null;

    const firstKey = Object.keys(errors)[0];
    return errors[firstKey].message ?? null;
  }
}
