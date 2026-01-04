import { Component, computed, input, output } from '@angular/core';
import { Field, FieldState, FieldTree } from '@angular/forms/signals';
import { BoletoPayment, CardPayment, Payment, PixPayment } from '../../models/flight';
import { CardForm } from './card-form/card-form';
import { PixForm } from './pix-form/pix-form';
import { BoletoForm } from './boleto-form/boleto-form';

@Component({
  selector: 'app-payment-step',
  imports: [Field, CardForm, PixForm, BoletoForm],
  templateUrl: './payment-step.html',
  styleUrls: ['./payment-step.scss', '../../../flight-booking-legacy/shared/flight-booking-shared.styles.scss'],
})
export class PaymentStep {
  paymentForm = input.required<FieldTree<Payment>>();
  submit = output();
  previous = output();
  boletoZipCodeSearch = output<string>();
  methodChange = output<string>();

  // Get current payment method from form
  protected readonly selectedMethod = computed(() => {
    try {
      const paymentForm = this.paymentForm();
      if (!paymentForm || !paymentForm.method) {
        return '';
      }
      const methodField = paymentForm.method();
      return methodField.value();
    } catch (error) {
      console.error('Error getting selected method:', error);
      return '';
    }
  });

  // Type-safe getters for specific payment forms
  protected get cardPaymentForm(): FieldTree<CardPayment> {
    return this.paymentForm() as FieldTree<CardPayment>;
  }

  protected get pixPaymentForm(): FieldTree<PixPayment> {
    return this.paymentForm() as FieldTree<PixPayment>;
  }

  protected get boletoPaymentForm(): FieldTree<BoletoPayment> {
    return this.paymentForm() as FieldTree<BoletoPayment>;
  }

  onNext(): void {
    this.submit.emit();
  }

  onPrevious(): void {
    this.previous.emit();
  }

  onMethodChange(method: string): void {
    this.methodChange.emit(method);
  }

  onBoletoZipCodeSearch(zipCode: string): void {
    this.boletoZipCodeSearch.emit(zipCode);
  }
}
