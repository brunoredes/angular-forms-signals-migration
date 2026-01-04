import { Component, input } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { PixPayment } from '../../../models/flight';
import { isFieldInvalid, getFieldError } from '../../../../../shared/utils/form-validation.utils';

@Component({
  selector: 'app-pix-form',
  imports: [Field],
  templateUrl: './pix-form.html',
  styleUrls: ['./pix-form.scss', '../../../../flight-booking-legacy/shared/flight-booking-shared.styles.scss'],
})
export class PixForm {
  pixPayment = input.required<FieldTree<PixPayment>>();

  // Re-export utility functions for template use
  protected readonly isFieldInvalid = isFieldInvalid;
  protected readonly getFieldError = getFieldError;
}
