import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-flight-search',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class FlightSearch {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected bookingForm!: FormGroup;

  protected currentStep = 0;
  protected steps = ['Flight Details', 'Passenger Information', 'Additional Services', 'Payment'];

  constructor() {
    this.#initializeBookingForm();
  }


  #initializeBookingForm() {
    this.bookingForm = this.formBuilder.group({
      // Step 1: Flight Details
      flightDetails: this.formBuilder.group({
        flightType: ['roundtrip', Validators.required],
        origin: ['', [Validators.required, Validators.minLength(3)]],
        destination: ['', [Validators.required, Validators.minLength(3)]],
        departureDate: ['', Validators.required],
        returnDate: [''],
        passengers: this.formBuilder.group({
          adults: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
          children: [0, [Validators.required, Validators.min(0), Validators.max(9)]],
          infants: [0, [Validators.required, Validators.min(0), Validators.max(9)]]
        }),
        class: ['economy', Validators.required]
      }, { validators: this.#returnDateValidator }),

      // Step 2: Passenger Information
      passengerDetails: this.formBuilder.array([]),

      // Step 3: Additional Services
      services: this.formBuilder.group({
        luggage: this.formBuilder.group({
          checkedBags: [0, [Validators.min(0), Validators.max(5)]],
          carryOn: [1, [Validators.min(1), Validators.max(2)]]
        }),
        seatSelection: this.formBuilder.array([]),
        meals: this.formBuilder.array([]),
        insurance: [false]
      }),

      // Step 4: Payment - starts with method selection
      payment: this.formBuilder.group({
        method: ['', Validators.required]
      })
    });

    // Subscribe to passenger count changes
    this.passengersGroup.valueChanges.subscribe(() => {
      this.updatePassengerDetailsArray();
    });

    // Subscribe to payment method changes
    this.paymentGroup.get('method')?.valueChanges.subscribe((method) => {
      this.onPaymentMethodChange(method);
    });
  }

  #returnDateValidator(control: AbstractControl): ValidationErrors | null {
    const flightType = control.get('flightType')?.value;
    const returnDate = control.get('returnDate')?.value;
    const departureDate = control.get('departureDate')?.value;

    if (flightType === 'roundtrip') {
      if (!returnDate) {
        return { returnDateRequired: true };
      }
      if (departureDate && returnDate && new Date(returnDate) <= new Date(departureDate)) {
        return { returnDateInvalid: true };
      }
    }
    return null;
  }
  onPaymentMethodChange(method: string): void {
    const paymentGroup = this.paymentGroup;

    // Remove all controls except 'method'
    Object.keys(paymentGroup.controls).forEach(key => {
      if (key !== 'method') {
        paymentGroup.removeControl(key);
      }
    });

    // Add controls based on selected method
    switch (method) {
      case 'credit':
      case 'debit':
        this.setupCardPayment(paymentGroup, method);
        break;
      case 'pix':
        this.setupPixPayment(paymentGroup);
        break;
      case 'boleto':
        this.setupBoletoPayment(paymentGroup);
        break;
    }
  }

  private setupCardPayment(paymentGroup: FormGroup, cardType: string): void {
    paymentGroup.addControl('cardType', this.formBuilder.control(cardType, Validators.required));
    paymentGroup.addControl('cardNumber', this.formBuilder.control('', [
      Validators.required,
      Validators.pattern(/^\d{16}$/)
    ]));
    paymentGroup.addControl('cardHolder', this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(3)
    ]));
    paymentGroup.addControl('expiryDate', this.formBuilder.control('', [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
    ]));
    paymentGroup.addControl('cvv', this.formBuilder.control('', [
      Validators.required,
      Validators.pattern(/^\d{3,4}$/)
    ]));
    paymentGroup.addControl('billingAddress', this.formBuilder.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.minLength(5)]]
    }));
  }

  private setupPixPayment(paymentGroup: FormGroup): void {
    paymentGroup.addControl('cpf', this.formBuilder.control('cpf', Validators.required));
    paymentGroup.addControl('pixEmail', this.formBuilder.control('', [Validators.email]));
    paymentGroup.addControl('pixName', this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(3)
    ]));
  }

  private setupBoletoPayment(paymentGroup: FormGroup): void {
    paymentGroup.addControl('boletoDocument', this.formBuilder.control('', [
      Validators.required,
      Validators.pattern(/^\d{11}$|^\d{14}$/) // CPF or CNPJ
    ]));
    paymentGroup.addControl('boletoName', this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(3)
    ]));
    paymentGroup.addControl('boletoAddress', this.formBuilder.group({
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]]
    }));
  }

  // Custom validator for return date
  returnDateValidator(control: AbstractControl): ValidationErrors | null {
    const flightType = control.get('flightType')?.value;
    const returnDate = control.get('returnDate')?.value;
    const departureDate = control.get('departureDate')?.value;

    if (flightType === 'roundtrip') {
      if (!returnDate) {
        return { returnDateRequired: true };
      }
      if (departureDate && returnDate && new Date(returnDate) <= new Date(departureDate)) {
        return { returnDateInvalid: true };
      }
    }
    return null;
  }

  // Getters for easy access
  get flightDetailsGroup(): FormGroup {
    return this.bookingForm.get('flightDetails') as FormGroup;
  }

  get passengersGroup(): FormGroup {
    return this.flightDetailsGroup.get('passengers') as FormGroup;
  }

  get passengerDetailsArray(): FormArray {
    return this.bookingForm.get('passengerDetails') as FormArray;
  }

  get servicesGroup(): FormGroup {
    return this.bookingForm.get('services') as FormGroup;
  }

  get paymentGroup(): FormGroup {
    return this.bookingForm.get('payment') as FormGroup;
  }

  get billingAddressGroup(): FormGroup | null {
    return this.paymentGroup.get('billingAddress') as FormGroup | null;
  }

  get boletoAddressGroup(): FormGroup | null {
    return this.paymentGroup.get('boletoAddress') as FormGroup | null;
  }

  get selectedPaymentMethod(): string {
    return this.paymentGroup.get('method')?.value || '';
  }

  // Update passenger details array based on passenger count
  updatePassengerDetailsArray(): void {
    const adults = this.passengersGroup.get('adults')?.value || 0;
    const children = this.passengersGroup.get('children')?.value || 0;
    const totalPassengers = adults + children;
    const currentLength = this.passengerDetailsArray.length;

    // Add new passenger forms
    if (totalPassengers > currentLength) {
      for (let i = currentLength; i < totalPassengers; i++) {
        const passengerType = i < adults ? 'adult' : 'child';
        this.passengerDetailsArray.push(this.createPassengerForm(passengerType));
      }
    }
    // Remove excess passenger forms
    else if (totalPassengers < currentLength) {
      for (let i = currentLength - 1; i >= totalPassengers; i--) {
        this.passengerDetailsArray.removeAt(i);
      }
    }
  }

  createPassengerForm(type: 'adult' | 'child'): FormGroup {
    return this.formBuilder.group({
      type: [type],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', Validators.required],
      passport: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6,9}$/)]],
      nationality: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  // Navigation methods
  nextStep(): void {
    if (this.isStepValid(this.currentStep)) {
      if (this.currentStep === 0) {
        this.updatePassengerDetailsArray();
      }
      this.currentStep = Math.min(this.currentStep + 1, this.steps.length - 1);
    } else {
      this.markStepAsTouched(this.currentStep);
    }
  }

  previousStep(): void {
    this.currentStep = Math.max(this.currentStep - 1, 0);
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 0:
        return this.flightDetailsGroup.valid;
      case 1:
        return this.passengerDetailsArray.valid && this.passengerDetailsArray.length > 0;
      case 2:
        return this.servicesGroup.valid;
      case 3:
        return this.paymentGroup.valid;
      default:
        return false;
    }
  }

  markStepAsTouched(step: number): void {
    switch (step) {
      case 0:
        this.flightDetailsGroup.markAllAsTouched();
        break;
      case 1:
        this.passengerDetailsArray.markAllAsTouched();
        break;
      case 2:
        this.servicesGroup.markAllAsTouched();
        break;
      case 3:
        this.paymentGroup.markAllAsTouched();
        break;
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      console.log('Form submitted:', this.bookingForm.value);
      alert('Booking submitted successfully!\n\n' + JSON.stringify(this.bookingForm.value, null, 2));
    } else {
      this.markStepAsTouched(this.currentStep);
      alert('Please fill in all required fields correctly.');
    }
  }

  // Helper methods for template
  getPassengerControl(index: number, field: string): AbstractControl | null {
    return this.passengerDetailsArray.at(index).get(field);
  }

  isFieldInvalid(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(control: AbstractControl | null): string {
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    if (control.errors['pattern']) return 'Invalid format';
    if (control.errors['min']) return `Minimum value is ${control.errors['min'].min}`;
    if (control.errors['max']) return `Maximum value is ${control.errors['max'].max}`;

    return 'Invalid field';
  }
}
