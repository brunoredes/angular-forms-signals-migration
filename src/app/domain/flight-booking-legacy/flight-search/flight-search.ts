import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BillingAddressForm, BoletoAddressForm, BookingForm, FlightDetailsForm, LuggageForm, PassengerDetailForm, PassengersForm, PaymentBaseForm, ServicesForm } from '../model/flight';
import { Subject, takeUntil } from 'rxjs';
import { FlightDetailsStep } from './flight-details-step/flight-details-step';
import { PassengerDetailsStep } from './passenger-details-step/passenger-details-step';
import { ServicesStep } from './services-step/services-step';
import { PaymentStep } from './payment-step/payment-step';

@Component({
  selector: 'app-flight-search',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FlightDetailsStep, PassengerDetailsStep, ServicesStep, PaymentStep],
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class FlightSearch implements OnInit, OnDestroy {
  // private readonly formBuilder = inject(NonNullableFormBuilder);
  // protected bookingForm!: FormGroup;

  // protected currentStep = 0;
  // protected steps = ['Flight Details', 'Passenger Information', 'Additional Services', 'Payment'];

  // constructor() {
  //   this.#initializeBookingForm();
  // }

  // ngOnInit(): void {

  // }

  // ngOnDestroy(): void {

  // }

  // #initializeBookingForm() {
  //   this.bookingForm = this.formBuilder.group({
  //     // Step 1: Flight Details
  //     flightDetails: this.formBuilder.group({
  //       flightType: ['roundtrip', Validators.required],
  //       origin: ['', [Validators.required, Validators.minLength(3)]],
  //       destination: ['', [Validators.required, Validators.minLength(3)]],
  //       departureDate: ['', Validators.required],
  //       returnDate: [''],
  //       passengers: this.formBuilder.group({
  //         adults: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
  //         children: [0, [Validators.required, Validators.min(0), Validators.max(9)]],
  //         infants: [0, [Validators.required, Validators.min(0), Validators.max(9)]]
  //       }),
  //       class: ['economy', Validators.required]
  //     }, { validators: this.#returnDateValidator }),

  //     // Step 2: Passenger Information
  //     passengerDetails: this.formBuilder.array([]),

  //     // Step 3: Additional Services
  //     services: this.formBuilder.group({
  //       luggage: this.formBuilder.group({
  //         checkedBags: [0, [Validators.min(0), Validators.max(5)]],
  //         carryOn: [1, [Validators.min(1), Validators.max(2)]]
  //       }),
  //       seatSelection: this.formBuilder.array([]),
  //       meals: this.formBuilder.array([]),
  //       insurance: [false]
  //     }),

  //     // Step 4: Payment - starts with method selection
  //     payment: this.formBuilder.group({
  //       method: ['', Validators.required]
  //     })
  //   });

  //   // Subscribe to passenger count changes
  //   this.passengersGroup.valueChanges.subscribe(() => {
  //     this.updatePassengerDetailsArray();
  //   });

  //   // Subscribe to payment method changes
  //   this.paymentGroup.get('method')?.valueChanges.subscribe((method) => {
  //     this.onPaymentMethodChange(method);
  //   });
  // }

  // #returnDateValidator(control: AbstractControl): ValidationErrors | null {
  //   const flightType = control.get('flightType')?.value;
  //   const returnDate = control.get('returnDate')?.value;
  //   const departureDate = control.get('departureDate')?.value;

  //   if (flightType === 'roundtrip') {
  //     if (!returnDate) {
  //       return { returnDateRequired: true };
  //     }
  //     if (departureDate && returnDate && new Date(returnDate) <= new Date(departureDate)) {
  //       return { returnDateInvalid: true };
  //     }
  //   }
  //   return null;
  // }

  // private setupCardPayment(paymentGroup: FormGroup, cardType: string): void {
  //   paymentGroup.addControl('cardType', this.formBuilder.control(cardType, Validators.required));
  //   paymentGroup.addControl('cardNumber', this.formBuilder.control('', [
  //     Validators.required,
  //     Validators.pattern(/^\d{16}$/)
  //   ]));
  //   paymentGroup.addControl('cardHolder', this.formBuilder.control('', [
  //     Validators.required,
  //     Validators.minLength(3)
  //   ]));
  //   paymentGroup.addControl('expiryDate', this.formBuilder.control('', [
  //     Validators.required,
  //     Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
  //   ]));
  //   paymentGroup.addControl('cvv', this.formBuilder.control('', [
  //     Validators.required,
  //     Validators.pattern(/^\d{3,4}$/)
  //   ]));
  //   paymentGroup.addControl('billingAddress', this.formBuilder.group({
  //     street: ['', Validators.required],
  //     city: ['', Validators.required],
  //     country: ['', Validators.required],
  //     zipCode: ['', [Validators.required, Validators.minLength(5)]]
  //   }));
  // }

  // private setupPixPayment(paymentGroup: FormGroup): void {
  //   paymentGroup.addControl('cpf', this.formBuilder.control('cpf', Validators.required));
  //   paymentGroup.addControl('pixEmail', this.formBuilder.control('', [Validators.email]));
  //   paymentGroup.addControl('pixName', this.formBuilder.control('', [
  //     Validators.required,
  //     Validators.minLength(3)
  //   ]));
  // }

  // private setupBoletoPayment(paymentGroup: FormGroup): void {
  //   paymentGroup.addControl('boletoDocument', this.formBuilder.control('', [
  //     Validators.required,
  //     Validators.pattern(/^\d{11}$|^\d{14}$/) // CPF or CNPJ
  //   ]));
  //   paymentGroup.addControl('boletoName', this.formBuilder.control('', [
  //     Validators.required,
  //     Validators.minLength(3)
  //   ]));
  //   paymentGroup.addControl('boletoAddress', this.formBuilder.group({
  //     street: ['', Validators.required],
  //     number: ['', Validators.required],
  //     complement: [''],
  //     neighborhood: ['', Validators.required],
  //     city: ['', Validators.required],
  //     state: ['', Validators.required],
  //     zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]]
  //   }));
  // }

  // // Custom validator for return date
  // returnDateValidator(control: AbstractControl): ValidationErrors | null {
  //   const flightType = control.get('flightType')?.value;
  //   const returnDate = control.get('returnDate')?.value;
  //   const departureDate = control.get('departureDate')?.value;

  //   if (flightType === 'roundtrip') {
  //     if (!returnDate) {
  //       return { returnDateRequired: true };
  //     }
  //     if (departureDate && returnDate && new Date(returnDate) <= new Date(departureDate)) {
  //       return { returnDateInvalid: true };
  //     }
  //   }
  //   return null;
  // }

  // // Getters for easy access
  // get flightDetailsGroup(): FormGroup {
  //   return this.bookingForm.get('flightDetails') as FormGroup;
  // }

  // get passengersGroup(): FormGroup {
  //   return this.flightDetailsGroup.get('passengers') as FormGroup;
  // }

  // get passengerDetailsArray(): FormArray {
  //   return this.bookingForm.get('passengerDetails') as FormArray;
  // }

  // get servicesGroup(): FormGroup {
  //   return this.bookingForm.get('services') as FormGroup;
  // }

  // get paymentGroup(): FormGroup {
  //   return this.bookingForm.get('payment') as FormGroup;
  // }

  // get billingAddressGroup(): FormGroup | null {
  //   return this.paymentGroup.get('billingAddress') as FormGroup | null;
  // }

  // get boletoAddressGroup(): FormGroup | null {
  //   return this.paymentGroup.get('boletoAddress') as FormGroup | null;
  // }

  // get selectedPaymentMethod(): string {
  //   return this.paymentGroup.get('method')?.value || '';
  // }

  // // Update passenger details array based on passenger count
  // updatePassengerDetailsArray(): void {
  //   const adults = this.passengersGroup.get('adults')?.value || 0;
  //   const children = this.passengersGroup.get('children')?.value || 0;
  //   const totalPassengers = adults + children;
  //   const currentLength = this.passengerDetailsArray.length;

  //   // Add new passenger forms
  //   if (totalPassengers > currentLength) {
  //     for (let i = currentLength; i < totalPassengers; i++) {
  //       const passengerType = i < adults ? 'adult' : 'child';
  //       this.passengerDetailsArray.push(this.createPassengerForm(passengerType));
  //     }
  //   }
  //   // Remove excess passenger forms
  //   else if (totalPassengers < currentLength) {
  //     for (let i = currentLength - 1; i >= totalPassengers; i--) {
  //       this.passengerDetailsArray.removeAt(i);
  //     }
  //   }
  // }

  // createPassengerForm(type: 'adult' | 'child'): FormGroup {
  //   return this.formBuilder.group({
  //     type: [type],
  //     firstName: ['', [Validators.required, Validators.minLength(2)]],
  //     lastName: ['', [Validators.required, Validators.minLength(2)]],
  //     dateOfBirth: ['', Validators.required],
  //     passport: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6,9}$/)]],
  //     nationality: ['', Validators.required],
  //     gender: ['', Validators.required]
  //   });
  // }

  // // Navigation methods
  // nextStep(): void {
  //   if (this.isStepValid(this.currentStep)) {
  //     if (this.currentStep === 0) {
  //       this.updatePassengerDetailsArray();
  //     }
  //     this.currentStep = Math.min(this.currentStep + 1, this.steps.length - 1);
  //   } else {
  //     this.markStepAsTouched(this.currentStep);
  //   }
  // }

  // previousStep(): void {
  //   this.currentStep = Math.max(this.currentStep - 1, 0);
  // }

  // isStepValid(step: number): boolean {
  //   switch (step) {
  //     case 0:
  //       return this.flightDetailsGroup.valid;
  //     case 1:
  //       return this.passengerDetailsArray.valid && this.passengerDetailsArray.length > 0;
  //     case 2:
  //       return this.servicesGroup.valid;
  //     case 3:
  //       return this.paymentGroup.valid;
  //     default:
  //       return false;
  //   }
  // }

  // markStepAsTouched(step: number): void {
  //   switch (step) {
  //     case 0:
  //       this.flightDetailsGroup.markAllAsTouched();
  //       break;
  //     case 1:
  //       this.passengerDetailsArray.markAllAsTouched();
  //       break;
  //     case 2:
  //       this.servicesGroup.markAllAsTouched();
  //       break;
  //     case 3:
  //       this.paymentGroup.markAllAsTouched();
  //       break;
  //   }
  // }

  // onSubmit(): void {
  //   if (this.bookingForm.valid) {
  //     console.log('Form submitted:', this.bookingForm.value);
  //     alert('Booking submitted successfully!\n\n' + JSON.stringify(this.bookingForm.value, null, 2));
  //   } else {
  //     this.markStepAsTouched(this.currentStep);
  //     alert('Please fill in all required fields correctly.');
  //   }
  // }

  // // Helper methods for template
  // getPassengerControl(index: number, field: string): AbstractControl | null {
  //   return this.passengerDetailsArray.at(index).get(field);
  // }

  // isFieldInvalid(control: AbstractControl | null): boolean {
  //   return !!(control && control.invalid && (control.dirty || control.touched));
  // }

  // getFieldError(control: AbstractControl | null): string {
  //   if (!control || !control.errors) return '';

  //   if (control.errors['required']) return 'This field is required';
  //   if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength}`;
  //   if (control.errors['pattern']) return 'Invalid format';
  //   if (control.errors['min']) return `Minimum value is ${control.errors['min'].min}`;
  //   if (control.errors['max']) return `Maximum value is ${control.errors['max'].max}`;

  //   return 'Invalid field';
  // }
  private readonly fb = inject(NonNullableFormBuilder);
  bookingForm!: FormGroup<BookingForm>;
  currentStep = 0;
  private destroy$ = new Subject<void>();

  steps = [
    'Flight Details',
    'Passengers',
    'Services',
    'Payment'
  ];

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.bookingForm = this.fb.group<BookingForm>({
      flightDetails: this.createFlightDetailsGroup(),
      passengerDetails: this.fb.array<FormGroup<PassengerDetailForm>>([]),
      services: this.createServicesGroup(),
      payment: this.createPaymentGroup()
    });
  }

  private createFlightDetailsGroup(): FormGroup<FlightDetailsForm> {
    return this.fb.group<FlightDetailsForm>({
      flightType: this.fb.control<'roundtrip' | 'oneway'>('roundtrip', {
        validators: Validators.required
      }),
      origin: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      destination: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      departureDate: this.fb.control('', {
        validators: Validators.required
      }),
      returnDate: this.fb.control(''),
      passengers: this.fb.group<PassengersForm>({
        adults: this.fb.control(1, {

          validators: [Validators.required, Validators.min(1), Validators.max(9)]
        }),
        children: this.fb.control(0, {

          validators: [Validators.required, Validators.min(0), Validators.max(9)]
        }),
        infants: this.fb.control(0, {

          validators: [Validators.required, Validators.min(0), Validators.max(9)]
        })
      }),
      class: this.fb.control<'economy' | 'premium' | 'business' | 'first'>('economy', {

        validators: Validators.required
      })
    }, { validators: this.returnDateValidator.bind(this) });
  }

  private createServicesGroup(): FormGroup<ServicesForm> {
    return this.fb.group<ServicesForm>({
      luggage: this.fb.group<LuggageForm>({
        checkedBags: this.fb.control(0, {

          validators: [Validators.min(0), Validators.max(5)]
        }),
        carryOn: this.fb.control(1, {

          validators: [Validators.min(1), Validators.max(2)]
        })
      }),
      seatSelection: this.fb.array<FormControl<string>>([]),
      meals: this.fb.array<FormControl<string>>([]),
      insurance: this.fb.control(false)
    });
  }

  private createPaymentGroup(): FormGroup<PaymentBaseForm> {
    return this.fb.group<PaymentBaseForm>({
      method: this.fb.control<'credit' | 'debit' | 'pix' | 'boleto' | ''>('', {

        validators: Validators.required
      })
    });
  }

  private setupSubscriptions(): void {
    // Subscribe to passenger count changes
    this.flightDetailsGroup.controls.passengers.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updatePassengerDetailsArray();
      });
  }

  private returnDateValidator(control: AbstractControl): ValidationErrors | null {
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

  private updatePassengerDetailsArray(): void {
    const adults = this.flightDetailsGroup.controls.passengers.controls.adults.value;
    const children = this.flightDetailsGroup.controls.passengers.controls.children.value;
    const totalPassengers = adults + children;
    const currentLength = this.passengerDetailsArray.length;

    if (totalPassengers > currentLength) {
      for (let i = currentLength; i < totalPassengers; i++) {
        const passengerType: 'adult' | 'child' = i < adults ? 'adult' : 'child';
        this.passengerDetailsArray.push(this.createPassengerForm(passengerType));
      }
    } else if (totalPassengers < currentLength) {
      for (let i = currentLength - 1; i >= totalPassengers; i--) {
        this.passengerDetailsArray.removeAt(i);
      }
    }
  }

  private createPassengerForm(type: 'adult' | 'child'): FormGroup<PassengerDetailForm> {
    return this.fb.group<PassengerDetailForm>({
      type: this.fb.control(type),
      firstName: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      lastName: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      dateOfBirth: this.fb.control('', {
        validators: Validators.required
      }),
      passport: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(/^[A-Z0-9]{6,9}$/)]
      }),
      nationality: this.fb.control('', {
        validators: Validators.required
      }),
      gender: this.fb.control('', {
        validators: Validators.required
      })
    });
  }

  // Getters
  get flightDetailsGroup(): FormGroup<FlightDetailsForm> {
    return this.bookingForm.controls.flightDetails;
  }

  get passengerDetailsArray(): FormArray<FormGroup<PassengerDetailForm>> {
    return this.bookingForm.controls.passengerDetails;
  }

  get servicesGroup(): FormGroup<ServicesForm> {
    return this.bookingForm.controls.services;
  }

  get paymentGroup(): FormGroup<PaymentBaseForm> {
    return this.bookingForm.controls.payment;
  }

  // Navigation
  nextStep(): void {
    if (this.isCurrentStepValid()) {
      if (this.currentStep === 0) {
        this.updatePassengerDetailsArray();
      }
      this.currentStep = Math.min(this.currentStep + 1, this.steps.length - 1);
    } else {
      this.markCurrentStepAsTouched();
    }
  }

  previousStep(): void {
    this.currentStep = Math.max(this.currentStep - 1, 0);
  }

  private isCurrentStepValid(): boolean {
    switch (this.currentStep) {
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

  private markCurrentStepAsTouched(): void {
    switch (this.currentStep) {
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
      const formValue = this.bookingForm.getRawValue();
      console.log('Form submitted:', formValue);
      alert('Booking submitted successfully!\n\n' + JSON.stringify(formValue, null, 2));
    } else {
      this.markCurrentStepAsTouched();
      alert('Please fill in all required fields correctly.');
    }
  }

  // Event handlers from child components
  onFlightDetailsNext(): void {
    this.nextStep();
  }

  onPassengerDetailsNext(): void {
    this.nextStep();
  }

  onPassengerDetailsPrevious(): void {
    this.previousStep();
  }

  onServicesNext(): void {
    this.nextStep();
  }

  onServicesPrevious(): void {
    this.previousStep();
  }

  onPaymentMethodChange(method: string): void {
    // Recreate payment FormGroup based on selected method
    this.bookingForm.setControl('payment', this.createPaymentGroupForMethod(method));
  }

  onPaymentPrevious(): void {
    this.previousStep();
  }

  private createPaymentGroupForMethod(method: string): FormGroup {
    const baseGroup = this.fb.group<PaymentBaseForm>({
      method: this.fb.control<'credit' | 'debit' | 'pix' | 'boleto' | ''>(
        method as any,
        { validators: Validators.required }
      )
    });

    const paymentGroup = baseGroup as FormGroup;

    switch (method) {
      case 'credit':
      case 'debit':
        this.addCardPaymentControls(paymentGroup, method as 'credit' | 'debit');
        break;
      case 'pix':
        this.addPixPaymentControls(paymentGroup);
        break;
      case 'boleto':
        this.addBoletoPaymentControls(paymentGroup);
        break;
    }

    return paymentGroup;
  }

  private addCardPaymentControls(paymentGroup: FormGroup, cardType: 'credit' | 'debit'): void {
    paymentGroup.addControl('cardType', this.fb.control(cardType, {

      validators: Validators.required
    }));
    paymentGroup.addControl('cardNumber', this.fb.control('', {

      validators: [Validators.required, Validators.pattern(/^\d{16}$/)]
    }));
    paymentGroup.addControl('cardHolder', this.fb.control('', {

      validators: [Validators.required, Validators.minLength(3)]
    }));
    paymentGroup.addControl('expiryDate', this.fb.control('', {

      validators: [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]
    }));
    paymentGroup.addControl('cvv', this.fb.control('', {

      validators: [Validators.required, Validators.pattern(/^\d{3,4}$/)]
    }));
    paymentGroup.addControl('billingAddress', this.fb.group<BillingAddressForm>({
      street: this.fb.control('', { validators: Validators.required }),
      city: this.fb.control('', { validators: Validators.required }),
      country: this.fb.control('', { validators: Validators.required }),
      zipCode: this.fb.control('', {

        validators: [Validators.required, Validators.minLength(5)]
      })
    }));
  }

  private addPixPaymentControls(paymentGroup: FormGroup): void {
    paymentGroup.addControl('pixKeyType', this.fb.control<'cpf' | 'cnpj' | 'email' | 'phone' | 'random'>('cpf', {

      validators: Validators.required
    }));
    paymentGroup.addControl('pixKey', this.fb.control('', {
      validators: [Validators.required, Validators.minLength(11)]
    }));
    paymentGroup.addControl('pixEmail', this.fb.control('', {

      validators: [Validators.email]
    }));
    paymentGroup.addControl('pixName', this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)]
    }));
  }

  private addBoletoPaymentControls(paymentGroup: FormGroup): void {
    paymentGroup.addControl('boletoDocument', this.fb.control('', {
      validators: [
        Validators.required,
        Validators.pattern(/^\d{11}$|^\d{14}$/)
      ]
    }));
    paymentGroup.addControl('boletoName', this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)]
    }));
    paymentGroup.addControl('boletoAddress', this.fb.group<BoletoAddressForm>({
      street: this.fb.control('', { validators: Validators.required }),
      number: this.fb.control('', { validators: Validators.required }),
      complement: this.fb.control(''),
      neighborhood: this.fb.control('', { validators: Validators.required }),
      city: this.fb.control('', { validators: Validators.required }),
      state: this.fb.control('', { validators: Validators.required }),
      zipCode: this.fb.control('', {

        validators: [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]
      })
    }));
  }
}
