import { Component, input } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { CardPayment } from '../../../models/flight';
import { isFieldInvalid, getFieldError } from '../../../../../shared/utils/form-validation.utils';

@Component({
  selector: 'app-card-form',
  imports: [Field],
  templateUrl: './card-form.html',
  styleUrl: './card-form.scss',
})
export class CardForm {
  cardPayment = input.required<FieldTree<CardPayment>>();

  // Re-export utility functions for template use
  protected readonly isFieldInvalid = isFieldInvalid;
  protected readonly getFieldError = getFieldError;
}
