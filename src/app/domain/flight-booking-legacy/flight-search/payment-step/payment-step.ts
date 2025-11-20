import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaymentBaseForm } from '../../model/flight';

@Component({
  selector: 'app-payment-step',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './payment-step.html',
  styleUrl: './payment-step.scss',
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
