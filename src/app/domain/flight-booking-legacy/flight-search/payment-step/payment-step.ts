
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaymentBaseForm } from '../../model/flight';
import { CardForm } from './card-form/card-form';
import { PixForm } from './pix-form/pix-form';
import { BoletoForm } from './boleto-form/boleto-form';

@Component({
  selector: 'app-payment-step',
  imports: [ReactiveFormsModule, CardForm, PixForm, BoletoForm],
  templateUrl: './payment-step.html',
  styleUrls: ['./payment-step.scss', '../../shared/flight-booking-shared.styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentStep {
  formGroup = input.required<FormGroup<PaymentBaseForm>>();
  methodChange = output<string>();
  previous = output<void>();
  submit = output<void>();

  onMethodChange(method: string): void {
    this.methodChange.emit(method);
  }

  onPrevious(): void {
    this.previous.emit();
  }

  onSubmit(): void {
    if (this.formGroup().valid) {
      this.submit.emit();
    } else {
      this.formGroup().markAllAsTouched();
    }
  }

  get selectedPaymentMethod(): string {
    return this.formGroup().controls.method.value;
  }

  isFieldInvalid(control: any): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(control: any): string {
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';

    return 'Invalid field';
  }
}
