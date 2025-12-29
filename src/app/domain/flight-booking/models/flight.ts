export type FlightType = 'roundtrip' | 'oneway';
export type FlightClass = 'economy' | 'premium' | 'business' | 'first';
export type PassengerType = 'adult' | 'child';
export type Gender = 'male' | 'female' | 'other' | '';
export type PaymentMethod = 'credit' | 'debit' | 'pix' | 'boleto' | '';
export type CardType = 'credit' | 'debit';

export const FLIGHT_TYPE = {
  ROUNDTRIP: 'roundtrip' as FlightType,
  ONEWAY: 'oneway' as FlightType,
} as const;
// ============================================================================
// FLIGHT DETAILS
// ============================================================================



export interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

export interface FlightDetails {
  flightType: FlightType;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: Passengers;
  class: FlightClass;
}

// ============================================================================
// PASSENGER DETAILS
// ============================================================================

export interface PassengerDetail {
  type: PassengerType;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passport: string;
  nationality: string;
  gender: Gender;
}

// ============================================================================
// SERVICES
// ============================================================================

export interface Luggage {
  checkedBags: number;
  carryOn: number;
}

export interface Services {
  luggage: Luggage;
  seatSelection: string[];
  meals: string[];
  insurance: boolean;
}

// ============================================================================
// PAYMENT
// ============================================================================

export interface BillingAddress {
  street: string;
  city: string;
  country: string;
  zipCode: string;
}

export interface BoletoAddress {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentBase {
  method: PaymentMethod;
}

export interface CardPayment extends PaymentBase {
  method: 'credit' | 'debit';
  cardType: CardType;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  billingAddress: BillingAddress;
}

export interface PixPayment extends PaymentBase {
  method: 'pix';
  cpf: string;
  pixName: string;
  pixEmail: string;
}

export interface BoletoPayment extends PaymentBase {
  method: 'boleto';
  boletoDocument: string;
  boletoName: string;
  boletoAddress: BoletoAddress;
}

export type Payment = PaymentBase | CardPayment | PixPayment | BoletoPayment;

// ============================================================================
// ROOT BOOKING MODEL
// ============================================================================

export interface FlightBooking {
  flightDetails: FlightDetails;
  passengerDetails: PassengerDetail[];
  services: Services;
  payment: Payment;
}
