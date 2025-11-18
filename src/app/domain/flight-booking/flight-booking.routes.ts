import { Routes } from "@angular/router";
import { SearchFlight } from "./search-flight/search-flight";

export const FLIGHT_BOOKING_ROUTES: Routes = [
  { path: 'search', component: SearchFlight }
];
