
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BillingAddressForm, BoletoAddressForm, BoletoPaymentControls, BookingForm, FlightDetailsForm, LuggageForm, PassengerDetailForm, PassengersForm, PaymentBaseForm, ServicesForm } from '../model/flight';
import { Subject, takeUntil } from 'rxjs';
import { FlightDetailsStep } from './flight-details-step/flight-details-step';
import { PassengerDetailsStep } from './passenger-details-step/passenger-details-step';
import { ServicesStep } from './services-step/services-step';
import { PaymentStep } from './payment-step/payment-step';
import { ProgressStep } from "../../../shared/components/progress-step/progress-step";
import { Viacep } from '../../../shared/services/viacep';

@Component({
  selector: 'app-flight-search',
  imports: [FormsModule, ReactiveFormsModule, FlightDetailsStep, PassengerDetailsStep, ServicesStep, PaymentStep, ProgressStep],
  templateUrl: './flight-search.html',
  styleUrls: ['./flight-search.scss', '../shared/flight-booking-shared.styles.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FlightSearch implements OnInit, OnDestroy {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly viaCepService = inject(Viacep);

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
    this.bookingForm.setControl('payment', this.createPaymentGroupForMethod(method));
  }

  onPaymentPrevious(): void {
    this.previousStep();
  }

  onBoletoZipCodeSearch(zipCode: string) {
    this.viaCepService.getAddress(zipCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (address) => {
          if (address) {
            const boletoAddressGroup = (this.paymentGroup as any).get('boletoAddress') as BoletoPaymentControls['boletoAddress'];
            if (boletoAddressGroup) {
              boletoAddressGroup.patchValue({
                street: address.logradouro || '',
                neighborhood: address.bairro || '',
                city: address.localidade || '',
                state: address.uf || ''
              });
            }
          }
        }
      });
  }

  private createPaymentGroupForMethod(method: string): FormGroup {
    const baseGroup = this.fb.group<PaymentBaseForm>({
      method: this.fb.control<'credit' | 'debit' | 'pix' | 'boleto'>(
        method as 'credit' | 'debit' | 'pix' | 'boleto',
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
    paymentGroup.addControl('cpf', this.fb.control<string>('', {
      validators: Validators.required
    }));

    paymentGroup.addControl('pixEmail', this.fb.control('', {
      validators: [Validators.email, Validators.required]
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
