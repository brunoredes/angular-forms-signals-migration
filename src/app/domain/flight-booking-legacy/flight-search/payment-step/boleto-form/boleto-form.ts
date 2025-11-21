import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BoletoAddressForm } from '../../../model/flight';

@Component({
  selector: 'app-boleto-form',
  imports: [ReactiveFormsModule],
  templateUrl: './boleto-form.html',
  styleUrls: ['./boleto-form.scss', '../../../shared/flight-booking-shared.styles.scss'],
})
export class BoletoForm {
  formGroup = input.required<FormGroup>();

  get boletoAddressGroup(): FormGroup<BoletoAddressForm> {
    return this.formGroup().get('boletoAddress') as FormGroup<BoletoAddressForm>;
  }

  isFieldInvalid(control: any): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(control: any): string {
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    if (control.errors['pattern']) return 'Invalid format';

    return 'Invalid field';
  }
}
