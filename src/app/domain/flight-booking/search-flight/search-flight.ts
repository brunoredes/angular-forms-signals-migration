import { Component, computed, inject, signal } from '@angular/core';
import { applyEach, form, max, maxLength, min, minLength, pattern, required, schema, validate } from '@angular/forms/signals';
import { ProgressStep } from '../../../shared/components/progress-step/progress-step';
import { Viacep } from '../../../shared/services/viacep';
import { BoletoPayment, CardPayment, FLIGHT_TYPE, FlightBooking, PassengerDetail, Payment, PixPayment } from '../models/flight';
import { defaultFlightDetails, defaultPaymentBase, defaultServices } from '../store/flight.store';
import { FlightDetailsStep } from './flight-details-step/flight-details-step';
import { PassengerDetailsStep } from './passenger-details-step/passenger-details-step';
import { ServicesStep } from './services-step/services-step';

@Component({
  selector: 'app-search-flight',
  imports: [ProgressStep, FlightDetailsStep, PassengerDetailsStep, ServicesStep],
  templateUrl: './search-flight.html',
  styleUrl: './search-flight.scss',
})
export class SearchFlight {
  private readonly viaCepService = inject(Viacep);

  protected readonly currentStep = signal(0);

  protected readonly steps = [
    'Flight Details',
    'Passengers',
    'Services',
    'Payment'
  ];

  protected readonly bookingModel = signal<FlightBooking>({
    flightDetails: defaultFlightDetails(),
    passengerDetails: [],
    services: defaultServices(),
    payment: defaultPaymentBase()
  });

  private minimalDepartureDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  protected readonly bookingForm = form(this.bookingModel, (schemaPath) => {

    // ========================================================================
    // FLIGHT DETAILS VALIDATION
    // ========================================================================

    const flightDetails = schemaPath.flightDetails;

    // Flight Type
    required(flightDetails.flightType, {
      message: 'Flight type is required'
    });

    // Origin
    required(flightDetails.origin, {
      message: 'Origin is required'
    });

    minLength(flightDetails.origin, 3, {
      message: 'Origin must be at least 3 characters'
    });

    maxLength(flightDetails.origin, 3, {
      message: 'Origin must be at most 3 characters'
    });

    // Destination
    required(flightDetails.destination, {
      message: 'Destination is required'
    });

    minLength(flightDetails.destination, 3, {
      message: 'Destination must be at least 3 characters'
    });

    maxLength(flightDetails.destination, 3, {
      message: 'Destination must be at most 3 characters'
    });

    // Departure Date
    required(flightDetails.departureDate, {
      message: 'Departure date is required'
    });

    min(flightDetails.departureDate, () => this.minimalDepartureDate() as any, {
      message: 'Departure date cannot be in the past',
    });

    // Return Date - conditional validation based on flight type
    validate(flightDetails.returnDate, ({ value, valueOf }) => {
      const flightType = valueOf(flightDetails.flightType);
      const returnDate = value();
      const departureDate = valueOf(flightDetails.departureDate);

      if (flightType === FLIGHT_TYPE.ROUNDTRIP) {
        if (!returnDate) {
          return {
            kind: 'returnDateRequired',
            message: 'Return date is required for round trip flights'
          };
        }

        if (departureDate && returnDate) {
          const departure = new Date(departureDate);
          const returnD = new Date(returnDate);
          if (returnD < departure) {
            return {
              kind: 'returnDateInvalid',
              message: 'Return date must be after departure date'
            };
          }
        }
      }

      return null;
    });

    // Passengers validation
    const passengers = flightDetails.passengers;

    required(passengers.adults, {
      message: 'At least one adult is required'
    });
    min(passengers.adults, 1, {
      message: 'At least one adult passenger is required'
    });
    max(passengers.adults, 9, {
      message: 'Maximum 9 adult passengers allowed'
    });

    min(passengers.children, 0, {
      message: 'Children count cannot be negative'
    });
    max(passengers.children, 9, {
      message: 'Maximum 9 children passengers allowed'
    });

    min(passengers.infants, 0, {
      message: 'Infants count cannot be negative'
    });
    max(passengers.infants, 9, {
      message: 'Maximum 9 infant passengers allowed'
    });

    // Class
    required(flightDetails.class, {
      message: 'Flight class is required'
    });

    // ========================================================================
    // PASSENGER DETAILS VALIDATION (Array)
    // ========================================================================

    // Define passenger schema to apply to each passenger
    const passengerSchema = schema<PassengerDetail>((passengerPath) => {
      // First Name
      required(passengerPath.firstName, {
        message: 'First name is required'
      });
      minLength(passengerPath.firstName, 2, {
        message: 'First name must be at least 2 characters'
      });

      // Last Name
      required(passengerPath.lastName, {
        message: 'Last name is required'
      });
      minLength(passengerPath.lastName, 2, {
        message: 'Last name must be at least 2 characters'
      });

      // Date of Birth
      required(passengerPath.dateOfBirth, {
        message: 'Date of birth is required'
      });

      // Passport
      required(passengerPath.passport, {
        message: 'Passport number is required'
      });
      pattern(passengerPath.passport, /^[A-Z0-9]{6,9}$/, {
        message: 'Passport must be 6-9 alphanumeric characters'
      });

      // Nationality
      required(passengerPath.nationality, {
        message: 'Nationality is required'
      });

      // Gender
      required(passengerPath.gender, {
        message: 'Gender is required'
      });
    });

    // Apply schema to each passenger in the array
    applyEach(schemaPath.passengerDetails, passengerSchema);

    // ========================================================================
    // SERVICES VALIDATION
    // ========================================================================

    const services = schemaPath.services;

    // Luggage
    min(services.luggage.checkedBags, 0, {
      message: 'Checked bags cannot be negative'
    });
    max(services.luggage.checkedBags, 5, {
      message: 'Maximum 5 checked bags allowed'
    });

    min(services.luggage.carryOn, 1, {
      message: 'At least one carry-on bag is required'
    });
    max(services.luggage.carryOn, 2, {
      message: 'Maximum 2 carry-on bags allowed'
    });

    // ========================================================================
    // PAYMENT VALIDATION
    // ========================================================================

    const payment = schemaPath.payment;

    // Payment Method
    required(payment.method, {
      message: 'Payment method is required'
    });

    // Dynamic validation based on payment method
    // Note: In Signal Forms, we handle dynamic fields differently
    // The payment object structure changes based on method selection
    // This will be handled in the template with conditional rendering
  });

  protected readonly totalPassengers = computed(() => {
    const passengers = this.bookingModel().flightDetails.passengers;
    return passengers.adults + passengers.children;
  });

  protected readonly isRoundTrip = computed(() => {
    return this.bookingModel().flightDetails.flightType === FLIGHT_TYPE.ROUNDTRIP;
  });

  protected readonly currentStepValid = computed(() => {
    switch (this.currentStep()) {
      case 0: // Flight Details
        return this.bookingForm.flightDetails().valid();
      case 1: // Passengers
        return this.bookingForm.passengerDetails().valid();
      case 2: // Services
        return this.bookingForm.services().valid();
      case 3: // Payment
        return this.bookingForm.payment().valid();
      default:
        return false;
    }
  });

  protected nextStep(): void {
    if (!this.currentStepValid()) {
      // Mark all fields in current step as touched to show errors
      this.markCurrentStepAsTouched();
      return;
    }

    // Special logic for Flight Details step
    if (this.currentStep() === 0) {
      this.updatePassengerDetailsArray();
    }

    this.currentStep.update(step => Math.min(step + 1, this.steps.length - 1));
  }

  protected previousStep(): void {
    this.currentStep.update(step => Math.max(step - 1, 0));
  }

  private markCurrentStepAsTouched(): void {
    switch (this.currentStep()) {
      case 0:
        this.bookingForm.flightDetails().markAsTouched();
        this.bookingForm.flightDetails().invalid();
        break;
      case 1:
        this.bookingForm.passengerDetails().markAsTouched();
        break;
      case 2:
        this.bookingForm.services().markAsTouched();
        break;
      case 3:
        this.bookingForm.payment().markAsTouched();
        break;
    }
  }

  // ============================================================================
  // PASSENGER MANAGEMENT
  // ============================================================================

  private updatePassengerDetailsArray(): void {
    const totalPassengers = this.totalPassengers();
    const currentPassengers = this.bookingModel().passengerDetails;

    if (totalPassengers === currentPassengers.length) {
      return; // No change needed
    }

    const adults = this.bookingModel().flightDetails.passengers.adults;
    const children = this.bookingModel().flightDetails.passengers.children;

    // Create new array with correct number of passengers
    const newPassengers: PassengerDetail[] = [];

    for (let i = 0; i < totalPassengers; i++) {
      // Try to preserve existing data
      const existingPassenger = currentPassengers[i];

      if (existingPassenger) {
        newPassengers.push(existingPassenger);
      } else {
        // Create new passenger
        const passengerType = i < adults ? 'adult' : 'child';
        newPassengers.push({
          type: passengerType,
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          passport: '',
          nationality: '',
          gender: ''
        });
      }
    }

    // Update model with new passengers array
    this.bookingModel.update(current => ({
      ...current,
      passengerDetails: newPassengers
    }));
  }

  // ============================================================================
  // PAYMENT METHOD HANDLING
  // ============================================================================

  protected onPaymentMethodChange(method: string): void {
    // Reset payment object based on selected method
    let newPayment: Payment;

    switch (method) {
      case 'credit':
      case 'debit':
        newPayment = {
          method: method as 'credit' | 'debit',
          cardType: method as 'credit' | 'debit',
          cardNumber: '',
          cardHolder: '',
          expiryDate: '',
          cvv: '',
          billingAddress: {
            street: '',
            city: '',
            country: '',
            zipCode: ''
          }
        } as CardPayment;
        break;

      case 'pix':
        newPayment = {
          method: 'pix',
          cpf: '',
          pixName: '',
          pixEmail: ''
        } as PixPayment;
        break;

      case 'boleto':
        newPayment = {
          method: 'boleto',
          boletoDocument: '',
          boletoName: '',
          boletoAddress: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: ''
          }
        } as BoletoPayment;
        break;

      default:
        newPayment = { method: '' };
    }

    this.bookingModel.update(current => ({
      ...current,
      payment: newPayment
    }));
  }

  // ============================================================================
  // BOLETO ZIP CODE SEARCH
  // ============================================================================

  protected async onBoletoZipCodeSearch(zipCode: string): Promise<void> {
    try {
      const address = this.viaCepService.getAddressResource(zipCode);

      if (address.value() && this.bookingModel().payment.method === 'boleto') {
        const currentPayment = this.bookingModel().payment as BoletoPayment;

        this.bookingModel.update(current => ({
          ...current,
          payment: {
            ...currentPayment,
            boletoAddress: {
              ...currentPayment.boletoAddress,
              street: address.value()?.logradouro || '',
              neighborhood: address.value()?.bairro || '',
              city: address.value()?.localidade || '',
              state: address.value()?.uf || ''
            }
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  }

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================

  protected async onSubmit() {
    if (!this.bookingForm().valid()) {
      this.markCurrentStepAsTouched();
      return;
    }

    // Get final booking data
    const bookingData = this.bookingModel();

    console.log('Submitting booking:', bookingData);

    // TODO: Implement actual submission logic
    // await this.bookingService.createBooking(bookingData);
    return null;
  }

  // ============================================================================
  // FORM RESET
  // ============================================================================

  protected resetForm(): void {
    this.bookingModel.set({
      flightDetails: {
        flightType: 'roundtrip',
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        passengers: {
          adults: 1,
          children: 0,
          infants: 0
        },
        class: 'economy'
      },
      passengerDetails: [],
      services: {
        luggage: {
          checkedBags: 0,
          carryOn: 1
        },
        seatSelection: [],
        meals: [],
        insurance: false
      },
      payment: {
        method: ''
      }
    });

    this.currentStep.set(0);
  }
}
