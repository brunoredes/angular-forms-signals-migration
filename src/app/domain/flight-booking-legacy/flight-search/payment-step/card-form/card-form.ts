import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BillingAddressForm } from '../../../model/flight';


@Component({
  selector: 'app-card-form',
  imports: [ReactiveFormsModule],
  templateUrl: './card-form.html',
  styleUrl: './card-form.scss',
})
export class CardForm {
  formGroup = input.required<FormGroup<any>>();

  get billingAddressGroup(): FormGroup<BillingAddressForm> {
    return this.formGroup().get('billingAddress') as FormGroup<BillingAddressForm>;
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
