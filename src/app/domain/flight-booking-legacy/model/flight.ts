import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface FlightDetailsForm {
  flightType: FormControl<'roundtrip' | 'oneway'>;
  origin: FormControl<string>;
  destination: FormControl<string>;
  departureDate: FormControl<string>;
  returnDate: FormControl<string>;
  passengers: FormGroup<PassengersForm>;
  class: FormControl<'economy' | 'premium' | 'business' | 'first'>;
}

export interface PassengersForm {
  adults: FormControl<number>;
  children: FormControl<number>;
  infants: FormControl<number>;
}

// Passenger Details Types
export interface PassengerDetailForm {
  type: FormControl<'adult' | 'child'>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  dateOfBirth: FormControl<string>;
  passport: FormControl<string>;
  nationality: FormControl<string>;
  gender: FormControl<string>;
}

// Services Types
export interface ServicesForm {
  luggage: FormGroup<LuggageForm>;
  seatSelection: FormArray<FormControl<string>>;
  meals: FormArray<FormControl<string>>;
  insurance: FormControl<boolean>;
}

export interface LuggageForm {
  checkedBags: FormControl<number>;
  carryOn: FormControl<number>;
}

// Payment Types
export interface PaymentBaseForm {
  method: FormControl<'credit' | 'debit' | 'pix' | 'boleto' | ''>;
}

export interface BillingAddressForm {
  street: FormControl<string>;
  city: FormControl<string>;
  country: FormControl<string>;
  zipCode: FormControl<string>;
}

export interface BoletoAddressForm {
  street: FormControl<string>;
  number: FormControl<string>;
  complement: FormControl<string>;
  neighborhood: FormControl<string>;
  city: FormControl<string>;
  state: FormControl<string>;
  zipCode: FormControl<string>;
}

// Root Form Type
export interface BookingForm {
  flightDetails: FormGroup<FlightDetailsForm>;
  passengerDetails: FormArray<FormGroup<PassengerDetailForm>>;
  services: FormGroup<ServicesForm>;
  payment: FormGroup<PaymentBaseForm>;
}
