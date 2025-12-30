import { Component, input, output, signal } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { BoletoPayment } from '../../../models/flight';
import { isFieldInvalid, getFieldError } from '../../../../../shared/utils/form-validation.utils';

@Component({
  selector: 'app-boleto-form',
  imports: [Field],
  templateUrl: './boleto-form.html',
  styleUrl: './boleto-form.scss',
})
export class BoletoForm {
  boletoPayment = input.required<FieldTree<BoletoPayment>>();
  zipCodeSearch = output<string>();

  private lastZipCode = signal('');
  private debounceTimer: number | null = null;

  // Re-export utility functions for template use
  protected readonly isFieldInvalid = isFieldInvalid;
  protected readonly getFieldError = getFieldError;

  onZipCodeChange(zipCode: string): void {
    const cleanZipCode = zipCode.replace(/\D/g, '');
    
    // Debounce logic
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      if (cleanZipCode.length === 8 && cleanZipCode !== this.lastZipCode()) {
        this.lastZipCode.set(cleanZipCode);
        this.zipCodeSearch.emit(cleanZipCode);
      }
    }, 200);
  }
}
