import { signal } from "@angular/core";
import { FlightDetails, Luggage, Passengers, Payment, PaymentMethod, Services } from "../models/flight";

export const defaultPassengers = signal<Passengers>({
  adults: 1,
  children: 0,
  infants: 0
});

export const defaultFlightDetails = signal<FlightDetails>({
  flightType: 'roundtrip',
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  passengers: defaultPassengers(),
  class: 'economy'
});

export const defaultLuggage = signal<Luggage>({
  checkedBags: 0,
  carryOn: 1
});

export const defaultServices = signal<Services>({
  luggage: defaultLuggage(),
  seatSelection: [],
  meals: [],
  insurance: false
});

export const defaultPaymentBase = signal<Payment>({
  method: '' as PaymentMethod
});
