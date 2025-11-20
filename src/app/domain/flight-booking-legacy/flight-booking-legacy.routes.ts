import { Routes } from "@angular/router";
import { FlightSearch } from "./flight-search/flight-search";

export const FLIGHT_BOOKING_LEGACY_ROUTES: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: FlightSearch }
];
