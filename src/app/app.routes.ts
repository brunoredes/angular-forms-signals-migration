import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'flights', loadChildren: () => import('./domain/flight-booking/flight-booking.routes').then(m => m.FLIGHT_BOOKING_ROUTES) },
  { path: 'legacy/flights', loadChildren: () => import('./domain/flight-booking-legacy/flight-booking-legacy.routes').then(m => m.FLIGHT_BOOKING_LEGACY_ROUTES) },
];
