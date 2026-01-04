import { Component, input, output, signal } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { BoletoPayment } from '../../../models/flight';
import { isFieldInvalid, getFieldError } from '../../../../../shared/utils/form-validation.utils';

@Component({
  selector: 'app-boleto-form',
  imports: [Field],
  templateUrl: './boleto-form.html',
  styleUrls: ['./boleto-form.scss', '../../../../flight-booking-legacy/shared/flight-booking-shared.styles.scss'],
})
export class BoletoForm {
  boletoPayment = input.required<FieldTree<BoletoPayment>>();
  zipCodeSearch = output<string>();

  // Re-export utility functions for template use
  protected readonly isFieldInvalid = isFieldInvalid;
  protected readonly getFieldError = getFieldError;

  onZipCodeChange(zipCode: string): void {
    const cleanZipCode = zipCode.replace(/\D/g, '');
    this.zipCodeSearch.emit(cleanZipCode);
  }
}
