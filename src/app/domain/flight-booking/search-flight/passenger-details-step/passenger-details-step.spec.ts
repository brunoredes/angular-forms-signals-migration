import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { form, required, pattern } from '@angular/forms/signals';
import { PassengerDetailsStep } from './passenger-details-step';
import { PassengerDetail } from '../../models/flight';

describe('PassengerDetailsStep', () => {
  let component: PassengerDetailsStep;
  let fixture: ComponentFixture<PassengerDetailsStep>;

  // Helper function to create a mock passenger details array
  function createMockPassengerDetailsForm(passengerCount: number = 2) {
    const passengers: PassengerDetail[] = Array.from({ length: passengerCount }, (_, index) => ({
      type: index === 0 ? 'adult' : 'child',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      passport: '',
      nationality: '',
      gender: '',
    }));

    const passengerDetailsModel = signal<PassengerDetail[]>(passengers);

    return form(passengerDetailsModel, (schemaPath) => {
      // Apply validation to each passenger in the array
      for (let i = 0; i < passengerCount; i++) {
        required(schemaPath[i].firstName, { message: 'First name is required' });
        required(schemaPath[i].lastName, { message: 'Last name is required' });
        required(schemaPath[i].dateOfBirth, { message: 'Date of birth is required' });
        required(schemaPath[i].passport, { message: 'Passport number is required' });
        pattern(schemaPath[i].passport, /^[A-Z0-9]{6,9}$/i, {
          message: 'Passport must be 6-9 alphanumeric characters'
        });
        required(schemaPath[i].nationality, { message: 'Nationality is required' });
        required(schemaPath[i].gender, { message: 'Gender is required' });
      }
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerDetailsStep],
    }).compileComponents();

    fixture = TestBed.createComponent(PassengerDetailsStep);
    component = fixture.componentInstance;

    // Set required input with 2 passengers
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('passengerDetailsArray', createMockPassengerDetailsForm(2));
    });

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

    it('should have required input passengerDetailsArray', () => {
      expect(component.passengerDetailsArray()).toBeDefined();
    });

    it('should have next output', () => {
      expect(component.next).toBeDefined();
    });

    it('should have previous output', () => {
      expect(component.previous).toBeDefined();
    });

    it('should have ChangeDetectionStrategy.OnPush', () => {
      const metadata = (component.constructor as any).ɵcmp;
      expect(metadata.changeDetection).toBe(0); // OnPush = 0
    });
  });

  // ============================================================================
  // TEMPLATE RENDERING
  // ============================================================================

  describe('Template Rendering', () => {
    it('should render passenger information fieldset', () => {
      const fieldset = fixture.nativeElement.querySelector('fieldset.form-step');
      expect(fieldset).toBeTruthy();
    });

    it('should render legend "Passenger Information"', () => {
      const legend = fixture.nativeElement.querySelector('fieldset.form-step > legend');
      expect(legend.textContent.trim()).toBe('Passenger Information');
    });

    it('should render correct number of passenger cards', () => {
      const passengerCards = fixture.nativeElement.querySelectorAll('fieldset.passenger-card');
      expect(passengerCards.length).toBe(2);
    });

    it('should render passenger type in legend', () => {
      const legends = fixture.nativeElement.querySelectorAll('fieldset.passenger-card > legend');
      expect(legends[0].textContent.trim()).toBe('Passenger 1 (adult)');
      expect(legends[1].textContent.trim()).toBe('Passenger 2 (child)');
    });

    it('should render first name input for each passenger', () => {
      const firstNameInputs = fixture.nativeElement.querySelectorAll('[id^="firstName-"]');
      expect(firstNameInputs.length).toBe(2);
      expect(firstNameInputs[0].id).toBe('firstName-0');
      expect(firstNameInputs[1].id).toBe('firstName-1');
    });

    it('should render last name input for each passenger', () => {
      const lastNameInputs = fixture.nativeElement.querySelectorAll('[id^="lastName-"]');
      expect(lastNameInputs.length).toBe(2);
      expect(lastNameInputs[0].id).toBe('lastName-0');
      expect(lastNameInputs[1].id).toBe('lastName-1');
    });

    it('should render date of birth input for each passenger', () => {
      const dobInputs = fixture.nativeElement.querySelectorAll('[id^="dateOfBirth-"]');
      expect(dobInputs.length).toBe(2);
      expect(dobInputs[0].type).toBe('date');
      expect(dobInputs[1].type).toBe('date');
    });

    it('should render gender select for each passenger', () => {
      const genderSelects = fixture.nativeElement.querySelectorAll('[id^="gender-"]');
      expect(genderSelects.length).toBe(2);

      const options = genderSelects[0].querySelectorAll('option');
      expect(options.length).toBe(4);
      expect(options[0].value).toBe('');
      expect(options[1].value).toBe('male');
      expect(options[2].value).toBe('female');
      expect(options[3].value).toBe('other');
    });

    it('should render passport input for each passenger', () => {
      const passportInputs = fixture.nativeElement.querySelectorAll('[id^="passport-"]');
      expect(passportInputs.length).toBe(2);
      expect(passportInputs[0].placeholder).toBe('AB123456');
    });

    it('should render nationality input for each passenger', () => {
      const nationalityInputs = fixture.nativeElement.querySelectorAll('[id^="nationality-"]');
      expect(nationalityInputs.length).toBe(2);
    });

    it('should render navigation buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBe(2);

      const previousButton = fixture.nativeElement.querySelector('button.btn-secondary');
      const nextButton = fixture.nativeElement.querySelector('button.btn-primary');

      expect(previousButton).toBeTruthy();
      expect(previousButton.textContent.trim()).toBe('Previous');
      expect(previousButton.getAttribute('aria-label')).toBe('Go to previous step');

      expect(nextButton).toBeTruthy();
      expect(nextButton.textContent.trim()).toBe('Next');
      expect(nextButton.getAttribute('aria-label')).toBe('Go to next step');
    });

    it('should render correct labels for all fields', () => {
      const labels = fixture.nativeElement.querySelectorAll('label');
      const labelTexts = Array.from(labels).map((label: any) => label.textContent.trim());

      expect(labelTexts).toContain('First Name *');
      expect(labelTexts).toContain('Last Name *');
      expect(labelTexts).toContain('Date of Birth *');
      expect(labelTexts).toContain('Gender *');
      expect(labelTexts).toContain('Passport Number *');
      expect(labelTexts).toContain('Nationality *');
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

  describe('onPrevious() Method', () => {
    it('should emit previous event when called', () => {
      const emitSpy = vi.spyOn(component.previous, 'emit');

      component.onPrevious();

      expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit previous event when button is clicked', () => {
      const emitSpy = vi.spyOn(component.previous, 'emit');

      const previousButton = fixture.nativeElement.querySelector('button.btn-secondary');
      previousButton.click();

      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPassengerControl() Method', () => {
    it('should return correct field control for first passenger firstName', () => {
      const control = component.getPassengerControl(0, 'firstName');
      expect(control).toBeDefined();
    });

    it('should return correct field control for second passenger lastName', () => {
      const control = component.getPassengerControl(1, 'lastName');
      expect(control).toBeDefined();
    });

    it('should return correct field control for passport field', () => {
      const control = component.getPassengerControl(0, 'passport');
      expect(control).toBeDefined();
    });

    it('should return correct field control for gender field', () => {
      const control = component.getPassengerControl(0, 'gender');
      expect(control).toBeDefined();
    });

    it('should return different controls for different passengers', () => {
      const control1 = component.getPassengerControl(0, 'firstName');
      const control2 = component.getPassengerControl(1, 'firstName');
      expect(control1).not.toBe(control2);
    });
  });

  describe('isFieldInvalid() Method', () => {
    it('should return false when field is valid', () => {
      const passengers = component.passengerDetailsArray();
      passengers[0].firstName().value.set('John');

      const result = component.isFieldInvalid(passengers[0].firstName());
      expect(result).toBe(false);
    });

    it('should return false when field is invalid but not touched or dirty', () => {
      const passengers = component.passengerDetailsArray();
      const firstNameField = passengers[0].firstName();

      // Field is empty (invalid) but not touched or dirty
      const result = component.isFieldInvalid(firstNameField);
      expect(result).toBe(false);
    });

    it('should return true when field is invalid and touched', () => {
      const passengers = component.passengerDetailsArray();
      const firstNameField = passengers[0].firstName();

      firstNameField.markAsTouched();

      const result = component.isFieldInvalid(firstNameField);
      expect(result).toBe(true);
    });

    it('should return true when field is invalid and dirty', () => {
      const passengers = component.passengerDetailsArray();
      const firstNameField = passengers[0].firstName();

      firstNameField.value.set('A');
      firstNameField.markAsDirty();

      const result = component.isFieldInvalid(firstNameField);
      expect(result).toBe(true);
    });

    it('should return true when field is invalid, touched, and dirty', () => {
      const passengers = component.passengerDetailsArray();
      const firstNameField = passengers[0].firstName();

      firstNameField.markAsTouched();
      firstNameField.markAsDirty();

      const result = component.isFieldInvalid(firstNameField);
      expect(result).toBe(true);
    });
  });

  describe('getFieldError() Method', () => {
    it('should return null when field has no errors', () => {
      const passengers = component.passengerDetailsArray();
      passengers[0].firstName().value.set('John');

      const error = component.getFieldError(passengers[0].firstName());
      expect(error).toBeNull();
    });

    it('should return error message when field has errors', () => {
      const passengers = component.passengerDetailsArray();
      const firstNameField = passengers[0].firstName();

      // Field is empty, should have required error
      firstNameField.markAsTouched();
      fixture.detectChanges();

      const error = component.getFieldError(firstNameField);
      expect(error).toBe('First name is required');
    });

    it('should return first error message when field has multiple errors', () => {
      const passengers = component.passengerDetailsArray();
      const passportField = passengers[0].passport();

      // Set invalid passport (too short)
      passportField.value.set('ABC');
      passportField.markAsTouched();
      fixture.detectChanges();

      const error = component.getFieldError(passportField);
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

    it('should return null when errors object is empty', () => {
      const mockField = {
        errors: () => ({}),
      };

      const error = component.getFieldError(mockField);
      expect(error).toBeNull();
    });
  });

  // ============================================================================
  // ERROR MESSAGE DISPLAY
  // ============================================================================

  describe('Error Message Display', () => {
    it('should display first name error when field is invalid and touched', async () => {
      const passengers = component.passengerDetailsArray();
      passengers[0].firstName().markAsTouched();

      fixture.detectChanges();
      await fixture.whenStable();

      const errorMessages = fixture.nativeElement.querySelectorAll('app-form-error-message');
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    it('should NOT display errors when fields are invalid but not touched', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const errorMessages = fixture.nativeElement.querySelectorAll('app-form-error-message');
      expect(errorMessages.length).toBe(0);
    });

    it('should display multiple errors for multiple invalid fields', async () => {
      const passengers = component.passengerDetailsArray();
      passengers[0].firstName().markAsTouched();
      passengers[0].lastName().markAsTouched();

      fixture.detectChanges();
      await fixture.whenStable();

      const errorMessages = fixture.nativeElement.querySelectorAll('app-form-error-message');
      expect(errorMessages.length).toBeGreaterThanOrEqual(2);
    });

    it('should display errors for second passenger independently', async () => {
      const passengers = component.passengerDetailsArray();
      passengers[1].firstName().markAsTouched();

      fixture.detectChanges();
      await fixture.whenStable();

      const errorMessages = fixture.nativeElement.querySelectorAll('app-form-error-message');
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // USER INTERACTIONS
  // ============================================================================

  describe('User Interactions', () => {
    it('should update first name when user types', async () => {
      const passengers = component.passengerDetailsArray();
      const firstNameInput = fixture.nativeElement.querySelector('#firstName-0');

      firstNameInput.value = 'John';
      firstNameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(passengers[0].firstName().value()).toBe('John');
    });

    it('should update last name for second passenger', async () => {
      const passengers = component.passengerDetailsArray();
      const lastNameInput = fixture.nativeElement.querySelector('#lastName-1');

      lastNameInput.value = 'Smith';
      lastNameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(passengers[1].lastName().value()).toBe('Smith');
    });

    it('should update date of birth when user selects date', async () => {
      const passengers = component.passengerDetailsArray();
      const dobInput = fixture.nativeElement.querySelector('#dateOfBirth-0');

      dobInput.value = '1990-01-01';
      dobInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(passengers[0].dateOfBirth().value()).toBe('1990-01-01');
    });

    it('should update gender when user selects option', async () => {
      const passengers = component.passengerDetailsArray();
      const genderSelect = fixture.nativeElement.querySelector('#gender-0');

      genderSelect.value = 'male';
      genderSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(passengers[0].gender().value()).toBe('male');
    });

    it('should update passport number when user types', async () => {
      const passengers = component.passengerDetailsArray();
      const passportInput = fixture.nativeElement.querySelector('#passport-0');

      passportInput.value = 'AB123456';
      passportInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(passengers[0].passport().value()).toBe('AB123456');
    });

    it('should update nationality when user types', async () => {
      const passengers = component.passengerDetailsArray();
      const nationalityInput = fixture.nativeElement.querySelector('#nationality-0');

      nationalityInput.value = 'American';
      nationalityInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(passengers[0].nationality().value()).toBe('American');
    });

    it('should handle input for multiple passengers independently', async () => {
      const passengers = component.passengerDetailsArray();

      const firstName0 = fixture.nativeElement.querySelector('#firstName-0');
      const firstName1 = fixture.nativeElement.querySelector('#firstName-1');

      firstName0.value = 'John';
      firstName0.dispatchEvent(new Event('input'));

      firstName1.value = 'Jane';
      firstName1.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      await fixture.whenStable();

      expect(passengers[0].firstName().value()).toBe('John');
      expect(passengers[1].firstName().value()).toBe('Jane');
    });
  });

  // ============================================================================
  // DYNAMIC PASSENGER COUNT
  // ============================================================================

  describe('Dynamic Passenger Count', () => {
    it('should render single passenger when array has one element', async () => {
      fixture.componentRef.setInput('passengerDetailsArray', createMockPassengerDetailsForm(1));
      fixture.detectChanges();
      await fixture.whenStable();

      const passengerCards = fixture.nativeElement.querySelectorAll('fieldset.passenger-card');
      expect(passengerCards.length).toBe(1);
    });

    it('should render three passengers when array has three elements', async () => {
      fixture.componentRef.setInput('passengerDetailsArray', createMockPassengerDetailsForm(3));
      fixture.detectChanges();
      await fixture.whenStable();

      const passengerCards = fixture.nativeElement.querySelectorAll('fieldset.passenger-card');
      expect(passengerCards.length).toBe(3);
    });

    it('should render correct passenger numbers in legends', async () => {
      fixture.componentRef.setInput('passengerDetailsArray', createMockPassengerDetailsForm(3));
      fixture.detectChanges();
      await fixture.whenStable();

      const legends = fixture.nativeElement.querySelectorAll('fieldset.passenger-card > legend');
      expect(legends[0].textContent).toContain('Passenger 1');
      expect(legends[1].textContent).toContain('Passenger 2');
      expect(legends[2].textContent).toContain('Passenger 3');
    });
  });

  // ============================================================================
  // VALIDATION
  // ============================================================================

  describe('Validation', () => {
    it('should validate passport format', async () => {
      const passengers = component.passengerDetailsArray();
      const passportField = passengers[0].passport();

      // Invalid format (too short)
      passportField.value.set('ABC');
      passportField.markAsTouched();
      fixture.detectChanges();

      expect(passportField.invalid()).toBe(true);

      // Valid format
      passportField.value.set('AB123456');
      fixture.detectChanges();

      expect(passportField.invalid()).toBe(false);
    });

    it('should require all mandatory fields', async () => {
      const passengers = component.passengerDetailsArray();

      passengers[0].firstName().markAsTouched();
      passengers[0].lastName().markAsTouched();
      passengers[0].dateOfBirth().markAsTouched();
      passengers[0].passport().markAsTouched();
      passengers[0].nationality().markAsTouched();
      passengers[0].gender().markAsTouched();

      fixture.detectChanges();

      expect(passengers[0].firstName().invalid()).toBe(true);
      expect(passengers[0].lastName().invalid()).toBe(true);
      expect(passengers[0].dateOfBirth().invalid()).toBe(true);
      expect(passengers[0].passport().invalid()).toBe(true);
      expect(passengers[0].nationality().invalid()).toBe(true);
      expect(passengers[0].gender().invalid()).toBe(true);
    });

    it('should validate each passenger independently', async () => {
      const passengers = component.passengerDetailsArray();

      // Fill first passenger
      passengers[0].firstName().value.set('John');
      passengers[0].lastName().value.set('Doe');
      passengers[0].dateOfBirth().value.set('1990-01-01');
      passengers[0].passport().value.set('AB123456');
      passengers[0].nationality().value.set('American');
      passengers[0].gender().value.set('male');

      // Leave second passenger empty
      passengers[1].firstName().markAsTouched();

      fixture.detectChanges();

      expect(passengers[0].firstName().invalid()).toBe(false);
      expect(passengers[1].firstName().invalid()).toBe(true);
    });
  });

  // ============================================================================
  // ACCESSIBILITY
  // ============================================================================

  describe('Accessibility', () => {
    it('should have unique IDs for each passenger input', () => {
      const firstNameInputs = fixture.nativeElement.querySelectorAll('[id^="firstName-"]');
      const ids = Array.from(firstNameInputs).map((input: any) => input.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should associate labels with correct inputs', () => {
      const label = fixture.nativeElement.querySelector('label[for="firstName-0"]');
      const input = fixture.nativeElement.querySelector('#firstName-0');

      expect(label).toBeTruthy();
      expect(input).toBeTruthy();
    });

    it('should have aria-label on navigation buttons', () => {
      const previousButton = fixture.nativeElement.querySelector('button.btn-secondary');
      const nextButton = fixture.nativeElement.querySelector('button.btn-primary');

      expect(previousButton.getAttribute('aria-label')).toBeTruthy();
      expect(nextButton.getAttribute('aria-label')).toBeTruthy();
    });

    it('should indicate required fields with asterisks', () => {
      const labels = fixture.nativeElement.querySelectorAll('label');
      const requiredLabels = Array.from(labels).filter((label: any) =>
        label.textContent.includes('*')
      );

      expect(requiredLabels.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle empty passenger array', async () => {
      fixture.componentRef.setInput('passengerDetailsArray', createMockPassengerDetailsForm(0));
      fixture.detectChanges();
      await fixture.whenStable();

      const passengerCards = fixture.nativeElement.querySelectorAll('fieldset.passenger-card');
      expect(passengerCards.length).toBe(0);
    });

    it('should handle error without message property', () => {
      const mockField = {
        errors: () => ({ customError: {} }),
      };

      const error = component.getFieldError(mockField);
      expect(error).toBeNull();
    });

    it('should display all validation errors for a field', async () => {
      const passengers = component.passengerDetailsArray();
      const passportField = passengers[0].passport();

      // Empty passport (required + pattern errors)
      passportField.markAsTouched();
      fixture.detectChanges();
      await fixture.whenStable();

      const errors = passportField.errors();
      expect(errors).toBeTruthy();
    });
  });
});
