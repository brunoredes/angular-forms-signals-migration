# Angular Forms Signals Migration

A demonstration application showcasing the migration from traditional Angular Reactive Forms to the new **Angular Signal-based Forms API**. This project features a comprehensive flight booking system with two parallel implementations:

- **Modern Implementation** (`/flights/search`) - Uses Angular Signal Forms with reactive state management
- **Legacy Implementation** (`/legacy/flights/search`) - Uses traditional Reactive Forms for comparison

## About This Project

This application demonstrates best practices for form handling in Angular using the new Signal-based Forms API introduced in Angular 18+. It features:

- **Multi-step Flight Booking Form** with complex validation logic
- **Dynamic form fields** based on payment method selection (Credit Card, PIX, Boleto)
- **Array validation** for passenger details with dynamic passenger management
- **Conditional validation** for flight types (one-way vs round-trip)
- **Async validation** with debouncing for ZIP code lookup via ViaCep API
- **Type-safe forms** with full TypeScript support
- **Signal-based state management** for reactive UI updates

### Key Features

- **Flight Details Step**: Origin, destination, dates, passengers, and flight class selection
- **Passenger Details Step**: Dynamic passenger information forms based on traveler count
- **Services Step**: Luggage, seat selection, meals, and insurance options
- **Payment Step**: Multiple payment methods (Credit Card, Debit Card, PIX, Boleto) with method-specific validation

## Application Routes

### Modern Signal Forms Implementation

- **`/flights/search`** - Multi-step flight booking form using Angular Signal Forms API
  - Component: `SearchFlight`
  - Location: [src/app/domain/flight-booking/search-flight/](src/app/domain/flight-booking/search-flight/)
  - Features: Signal-based validation, debounced API calls, reactive state management

### Legacy Reactive Forms Implementation

- **`/legacy/flights/search`** - Traditional implementation using Reactive Forms
  - Component: `FlightSearch`
  - Location: [src/app/domain/flight-booking-legacy/flight-search/](src/app/domain/flight-booking-legacy/flight-search/)
  - Features: FormBuilder, FormGroup, FormArray with traditional validators

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
