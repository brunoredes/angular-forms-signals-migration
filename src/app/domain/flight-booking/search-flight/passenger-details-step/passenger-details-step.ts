import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Field, FieldState, FieldTree } from '@angular/forms/signals';
import { PassengerDetail } from '../../models/flight';
import { FormErrorMessage } from '../../../../shared/components/form-error-message/form-error-message';

@Component({
  selector: 'app-passenger-details-step',
  imports: [Field, FormErrorMessage],
  templateUrl: './passenger-details-step.html',
  styleUrls: ['./passenger-details-step.scss', '../../../flight-booking-legacy/shared/flight-booking-shared.styles.scss'],
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
}
