import { Component, effect, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BoletoAddressForm } from '../../../model/flight';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { FormErrorMessage } from '../../../../../shared/components/form-error-message/form-error-message';

@Component({
  selector: 'app-boleto-form',
  imports: [ReactiveFormsModule, FormErrorMessage],
  templateUrl: './boleto-form.html',
  styleUrls: ['./boleto-form.scss', '../../../shared/flight-booking-shared.styles.scss'],
})
export class BoletoForm {
  formGroup = input.required<FormGroup>();
  zipCodeSearch = output<string>();

  private zipCodeSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.zipCodeSubject.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (zipCode) => {
        const cleanZipCode = zipCode.replace(/\D/g, '');
        if (cleanZipCode.length === 8) {
          this.zipCodeSearch.emit(cleanZipCode);
        }
      }
    });
  }

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

  onZipCodeChange(zipCode: string): void {
    this.zipCodeSubject.next(zipCode);
  }
}
