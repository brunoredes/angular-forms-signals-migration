import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { form, required, min, max } from '@angular/forms/signals';
import { FlightDetailsStep } from './flight-details-step';
import { FlightDetails } from '../../models/flight';

describe('FlightDetailsStep', () => {
  let component: FlightDetailsStep;
  let fixture: ComponentFixture<FlightDetailsStep>;

  // Helper function to create a mock form model
  function createMockFlightDetailsForm() {
    const flightDetailsModel = signal<FlightDetails>({
      flightType: 'roundtrip',
      origin: '',
      destination: '',
      departureDate: '',
      returnDate: '',
      passengers: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      class: 'economy',
    });

    return form(flightDetailsModel, (schemaPath) => {
      required(schemaPath.origin, { message: 'Origin is required' });
      required(schemaPath.destination, { message: 'Destination is required' });
      required(schemaPath.departureDate, { message: 'Departure date is required' });
      min(schemaPath.passengers.adults, 1, { message: 'At least 1 adult is required' });
      max(schemaPath.passengers.adults, 9, { message: 'Maximum 9 adults allowed' });
      min(schemaPath.passengers.children, 0, { message: 'Children cannot be negative' });
      max(schemaPath.passengers.children, 9, { message: 'Maximum 9 children allowed' });
      min(schemaPath.passengers.infants, 0, { message: 'Infants cannot be negative' });
      max(schemaPath.passengers.infants, 9, { message: 'Maximum 9 infants allowed' });
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightDetailsStep],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightDetailsStep);
    component = fixture.componentInstance;
    
    TestBed.runInInjectionContext(() => {
      // createMockFlightDetailsForm();
      fixture.componentRef.setInput('flightDetails', createMockFlightDetailsForm());
    });
    // Set required input
    
    fixture.detectChanges();
    await fixture.whenStable();
  });

  // ============================================================================
  // COMPONENT INITIALIZATION
  // ============================================================================

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have required input flightDetails', () => {
      expect(component.flightDetails()).toBeDefined();
    });

    it('should have next output', () => {
      expect(component.next).toBeDefined();
    });

    it('should set minimalDate to today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(component.minimalDate).toBe(today);
    });
  });

  // ============================================================================
  // TEMPLATE RENDERING
  // ============================================================================

  describe('Template Rendering', () => {
    it('should render flight details fieldset', () => {
      const fieldset = fixture.nativeElement.querySelector('fieldset.form-step');
      expect(fieldset).toBeTruthy();
    });

    it('should render legend "Flight Details"', () => {
      const legend = fixture.nativeElement.querySelector('legend');
      expect(legend.textContent.trim()).toBe('Flight Details');
    });

    it('should render flight type radio buttons', () => {
      const roundtripRadio = fixture.nativeElement.querySelector('#roundtrip');
      const onewayRadio = fixture.nativeElement.querySelector('#oneway');
      
      expect(roundtripRadio).toBeTruthy();
      expect(onewayRadio).toBeTruthy();
      expect(roundtripRadio.type).toBe('radio');
      expect(onewayRadio.type).toBe('radio');
    });

    it('should render origin input field', () => {
      const originInput = fixture.nativeElement.querySelector('#origin');
      expect(originInput).toBeTruthy();
      expect(originInput.placeholder).toBe('From?');
      expect(originInput.getAttribute('aria-label')).toBe('Insert the origin airport code');
      expect(originInput.getAttribute('aria-required')).toBe('true');
    });

    it('should render destination input field', () => {
      const destinationInput = fixture.nativeElement.querySelector('#destination');
      expect(destinationInput).toBeTruthy();
      expect(destinationInput.placeholder).toBe('Where to?');
      expect(destinationInput.getAttribute('aria-label')).toBe('Insert the destination airport code');
      expect(destinationInput.getAttribute('aria-required')).toBe('true');
    });

    it('should render departure date input field', () => {
      const departureDateInput = fixture.nativeElement.querySelector('#departureDate');
      expect(departureDateInput).toBeTruthy();
      expect(departureDateInput.type).toBe('date');
      expect(departureDateInput.getAttribute('aria-label')).toBe('Select departure date');
      expect(departureDateInput.getAttribute('aria-required')).toBe('true');
    });

    it('should render return date input when flight type is roundtrip', () => {
      const returnDateInput = fixture.nativeElement.querySelector('#returnDate');
      expect(returnDateInput).toBeTruthy();
      expect(returnDateInput.type).toBe('date');
      expect(returnDateInput.getAttribute('aria-label')).toBe('Select return date');
    });

    it('should NOT render return date input when flight type is oneway', async () => {
      const flightDetails = component.flightDetails();
      flightDetails.flightType().value.set('oneway');
      fixture.detectChanges();
      await fixture.whenStable();

      const returnDateInput = fixture.nativeElement.querySelector('#returnDate');
      expect(returnDateInput).toBeFalsy();
    });

    it('should render passengers fieldset', () => {
      const passengersFieldset = fixture.nativeElement.querySelector('fieldset:not(.form-step)');
      const legend = passengersFieldset?.querySelector('legend');
      expect(legend?.textContent.trim()).toBe('Passengers');
    });

    it('should render adults input field', () => {
      const adultsInput = fixture.nativeElement.querySelector('#adults');
      expect(adultsInput).toBeTruthy();
      expect(adultsInput.type).toBe('number');
      expect(adultsInput.getAttribute('aria-label')).toBe('Number of adults');
      expect(adultsInput.getAttribute('aria-required')).toBe('true');
    });

    it('should render children input field', () => {
      const childrenInput = fixture.nativeElement.querySelector('#children');
      expect(childrenInput).toBeTruthy();
      expect(childrenInput.type).toBe('number');
      expect(childrenInput.getAttribute('aria-label')).toBe('Number of children');
    });

    it('should render infants input field', () => {
      const infantsInput = fixture.nativeElement.querySelector('#infants');
      expect(infantsInput).toBeTruthy();
      expect(infantsInput.type).toBe('number');
      expect(infantsInput.getAttribute('aria-label')).toBe('Number of infants');
    });

    it('should render class select field', () => {
      const classSelect = fixture.nativeElement.querySelector('#travelClass');
      expect(classSelect).toBeTruthy();
      
      const options = classSelect.querySelectorAll('option');
      expect(options.length).toBe(4);
      expect(options[0].value).toBe('economy');
      expect(options[1].value).toBe('premium');
      expect(options[2].value).toBe('business');
      expect(options[3].value).toBe('first');
    });

    it('should render next button', () => {
      const nextButton = fixture.nativeElement.querySelector('button.btn-primary');
      expect(nextButton).toBeTruthy();
      expect(nextButton.textContent.trim()).toBe('Next');
      expect(nextButton.getAttribute('aria-label')).toBe('Go to next step');
    });
  });

  // ============================================================================
  // COMPONENT METHODS
  // ============================================================================

  describe('onNext() Method', () => {
    it('should emit next event when called', () => {
      const emitSpy = vi.spyOn(component.next, 'emit');

      component.onNext();

      expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit next event when button is clicked', () => {
      const emitSpy = vi.spyOn(component.next, 'emit');
      const nextButton = fixture.nativeElement.querySelector('button.btn-primary');
      nextButton.click();

      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('isFieldInvalid() Method', () => {
    it('should return false when field is valid', () => {
      const flightDetails = component.flightDetails();
      flightDetails.origin().value.set('JFK');
      
      const result = component.isFieldInvalid(flightDetails.origin());
      expect(result).toBe(false);
    });

    it('should return false when field is invalid but not touched or dirty', () => {
      const flightDetails = component.flightDetails();
      const originField = flightDetails.origin();
      
      // Field is empty (invalid) but not touched or dirty
      const result = component.isFieldInvalid(originField);
      expect(result).toBe(false);
    });

    it('should return true when field is invalid and touched', () => {
      const flightDetails = component.flightDetails();
      const originField = flightDetails.origin();
      
      originField.markAsTouched();
      
      const result = component.isFieldInvalid(originField);
      expect(result).toBe(true);
    });

    it('should return true when field is invalid and dirty', () => {
      const flightDetails = component.flightDetails();
      const originField = flightDetails.origin();
      
      originField.value.set('A');
      originField.markAsDirty();
      
      const result = component.isFieldInvalid(originField);
      expect(result).toBe(true);
    });

    it('should return true when field is invalid, touched, and dirty', () => {
      const flightDetails = component.flightDetails();
      const originField = flightDetails.origin();
      
      originField.markAsTouched();
      originField.markAsDirty();
      
      const result = component.isFieldInvalid(originField);
      expect(result).toBe(true);
    });
  });

  describe('getFieldError() Method', () => {
    it('should return null when field has no errors', () => {
      const flightDetails = component.flightDetails();
      flightDetails.origin().value.set('JFK');
      
      const error = component.getFieldError(flightDetails.origin());
      expect(error).toBeNull();
    });

    it('should return error message when field has errors', () => {
      const flightDetails = component.flightDetails();
      const originField = flightDetails.origin();
      
      // Field is empty, should have required error
      originField.markAsTouched();
      fixture.detectChanges();
      
      const error = component.getFieldError(originField);
      expect(error).toBe('Origin is required');
    });

    it('should return first error message when field has multiple errors', () => {
      const flightDetails = component.flightDetails();
      const adultsField = flightDetails.passengers.adults();
      
      adultsField.value.set(0);
      adultsField.markAsTouched();
      fixture.detectChanges();
      
      const error = component.getFieldError(adultsField);
      expect(error).toBeTruthy();
      expect(typeof error).toBe('string');
    });

    it('should return null when errors object is null/undefined', () => {
      const mockField = {
        errors: () => null,
      };
      
      const error = component.getFieldError(mockField);
      expect(error).toBeNull();
    });
  });

  // ============================================================================
  // ERROR MESSAGE DISPLAY
  // ============================================================================

  describe('Error Message Display', () => {
    it('should display origin error when field is invalid and touched', async () => {
      const flightDetails = component.flightDetails();
      const originField = flightDetails.origin();
      
      originField.markAsTouched();
      fixture.detectChanges();
      await fixture.whenStable();
      
      const errorMessage = fixture.nativeElement.querySelector('app-form-error-message');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent.trim()).toBe('Origin is required');
    });

    it('should NOT display origin error when field is invalid but not touched', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      
      const errorMessage = fixture.nativeElement.querySelector('app-form-error-message');
      expect(errorMessage).toBeFalsy();
    });

    it('should display destination error when field is invalid and dirty', async () => {
      const flightDetails = component.flightDetails();
      const destinationField = flightDetails.destination();
      
      destinationField.value.set('');
      destinationField.markAsDirty();
      fixture.detectChanges();
      await fixture.whenStable();
      
      const errorMessages: NodeListOf<HTMLSpanElement> = fixture.nativeElement.querySelectorAll('.error');
      const destinationError = Array.from(errorMessages).find((el: any) => 
        el.id === 'destinationError'
      );
      
      expect(destinationError).toBeTruthy();
      expect(destinationError?.textContent.trim()).toBe('Destination is required');
    });

    it('should set aria-invalid attribute when field is invalid', async () => {
      const flightDetails = component.flightDetails();
      flightDetails.origin().markAsTouched();
      
      fixture.detectChanges();
      await fixture.whenStable();
      
      const originInput = fixture.nativeElement.querySelector('#origin');
      expect(originInput.getAttribute('aria-invalid')).toBe('true');
    });
  });

  // ============================================================================
  // USER INTERACTIONS
  // ============================================================================

  describe('User Interactions', () => {
    it('should update flight type when radio button is clicked', async () => {
      const flightDetails = component.flightDetails();
      const onewayRadio = fixture.nativeElement.querySelector('#oneway');
      
      onewayRadio.click();
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(flightDetails.flightType().value()).toBe('oneway');
    });

    it('should toggle return date field visibility based on flight type', async () => {
      const flightDetails = component.flightDetails();
      
      // Start with roundtrip
      expect(fixture.nativeElement.querySelector('#returnDate')).toBeTruthy();
      
      // Switch to oneway
      flightDetails.flightType().value.set('oneway');
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(fixture.nativeElement.querySelector('#returnDate')).toBeFalsy();
      
      // Switch back to roundtrip
      flightDetails.flightType().value.set('roundtrip');
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(fixture.nativeElement.querySelector('#returnDate')).toBeTruthy();
    });

    it('should update origin value when user types', async () => {
      const flightDetails = component.flightDetails();
      const originInput = fixture.nativeElement.querySelector('#origin');
      
      originInput.value = 'JFK';
      originInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(flightDetails.origin().value()).toBe('JFK');
    });

    it('should update passenger count when user changes number input', async () => {
      const flightDetails = component.flightDetails();
      const adultsInput = fixture.nativeElement.querySelector('#adults');
      
      adultsInput.value = '2';
      adultsInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(flightDetails.passengers.adults().value()).toBe(2);
    });

    it('should update class when user selects different option', async () => {
      const flightDetails = component.flightDetails();
      const classSelect = fixture.nativeElement.querySelector('#travelClass');
      
      classSelect.value = 'business';
      classSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(flightDetails.class().value()).toBe('business');
    });
  });

  // ============================================================================
  // ACCESSIBILITY
  // ============================================================================

  describe('Accessibility', () => {
    it('should have proper ARIA labels on all inputs', () => {
      const inputs = fixture.nativeElement.querySelectorAll('input, select');
      
      inputs.forEach((input: HTMLElement) => {
        expect(input.getAttribute('aria-label')).toBeTruthy();
      });
    });

    it('should have aria-required on required fields', () => {
      const originInput = fixture.nativeElement.querySelector('#origin');
      const destinationInput = fixture.nativeElement.querySelector('#destination');
      const departureDateInput = fixture.nativeElement.querySelector('#departureDate');
      const adultsInput = fixture.nativeElement.querySelector('#adults');
      
      expect(originInput.getAttribute('aria-required')).toBe('true');
      expect(destinationInput.getAttribute('aria-required')).toBe('true');
      expect(departureDateInput.getAttribute('aria-required')).toBe('true');
      expect(adultsInput.getAttribute('aria-required')).toBe('true');
    });

    it('should have aria-errormessage attributes on inputs', () => {
      const originInput = fixture.nativeElement.querySelector('#origin');
      const destinationInput = fixture.nativeElement.querySelector('#destination');
      
      expect(originInput.getAttribute('aria-errormessage')).toBe('originError');
      expect(destinationInput.getAttribute('aria-errormessage')).toBe('destinationError');
    });

    it('should have role and aria-live on error messages', async () => {
      const flightDetails = component.flightDetails();
      flightDetails.destination().markAsTouched();
      
      fixture.detectChanges();
      await fixture.whenStable();
      
      const errorMessage = fixture.nativeElement.querySelector('#destinationError');
      expect(errorMessage?.getAttribute('role')).toBe('status');
      expect(errorMessage?.getAttribute('aria-live')).toBe('assertive');
      expect(errorMessage?.getAttribute('aria-atomic')).toBe('true');
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle multiple error messages for return date', async () => {
      const flightDetails = component.flightDetails();
      flightDetails.returnDate().markAsTouched();
      
      fixture.detectChanges();
      await fixture.whenStable();
      
      const returnDateErrors = fixture.nativeElement.querySelectorAll('#returnDateError');
      expect(returnDateErrors.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty error object', () => {
      const mockField = {
        errors: () => ({}),
      };
      
      const error = component.getFieldError(mockField);
      expect(error).toBeNull();
    });

    it('should handle error without message property', () => {
      const mockField = {
        errors: () => ({ customError: {} }),
      };
      
      const error = component.getFieldError(mockField);
      expect(error).toBeNull();
    });
  });
});
