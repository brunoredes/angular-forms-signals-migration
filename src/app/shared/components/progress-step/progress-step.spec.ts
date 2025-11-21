import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, inputBinding, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressStep } from './progress-step';

describe('ProgressStep Component', () => {
  let component: ProgressStep;
  let fixture: ComponentFixture<ProgressStep>;
  let debugElement: DebugElement;
  const defaultSteps = signal(['Step 1', 'Step 2', 'Step 3', 'Step 4']);
  const defaultCurrentStep = signal(0);


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressStep]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressStep, { bindings: [inputBinding('steps', defaultSteps), inputBinding('currentStep', defaultCurrentStep)] });
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  describe('Given component initialization', () => {
    describe('When component is created with required inputs', () => {
      it('Then should create component instance', () => {
        // Arrange
        fixture.detectChanges();
        // Assert
        expect(component).toBeTruthy();
      });
    });
  });

  describe('Given stepStates computed signal', () => {
    describe('When current step is first step', () => {
      it('Then first step should be marked as active', () => {
        // Arrange
        fixture.detectChanges();

        // Act
        const states = component.stepStates();

        // Assert
        expect(states[0].isActive).toBe(true);
      });

      it('Then first step should not be marked as completed', () => {
        // Arrange
        fixture.detectChanges();

        // Act
        const states = component.stepStates();

        // Assert
        expect(states[0].isCompleted).toBe(false);
      });

      it('Then subsequent steps should be marked as pending', () => {
        // Arrange
        fixture.detectChanges();

        // Act
        const states = component.stepStates();

        // Assert
        expect(states[1].isPending).toBe(true);
      });
    });

    describe('When current step is middle step', () => {
      it('Then previous steps should be marked as completed', () => {
        // Arrange

        defaultCurrentStep.set(2);
        fixture.detectChanges();

        // Act
        const states = component.stepStates();

        // Assert
        expect(states[0].isCompleted).toBe(true);
      });

      it('Then current step should be marked as active', () => {
        // Arrange
        defaultCurrentStep.set(2);
        fixture.detectChanges();

        // Act
        const states = component.stepStates();

        // Assert
        expect(states[2].isActive).toBe(true);
      });

      it('Then next steps should be marked as pending', () => {
        // Arrange
        defaultCurrentStep.set(2);
        fixture.detectChanges();

        // Act
        const states = component.stepStates();

        // Assert
        expect(states[3].isPending).toBe(true);
      });
    });

    describe('When current step is last step', () => {
      it('Then all previous steps should be marked as completed', () => {
        // Arrange
        defaultCurrentStep.set(3);
        fixture.detectChanges();

        // Act
        const states = component.stepStates();

        // Assert
        expect(states[0].isCompleted).toBe(true);
      });

      it('Then last step should be marked as active', () => {
        // Arrange1
        defaultCurrentStep.set(3);
        fixture.detectChanges();

        // Act
        const states = component.stepStates();

        // Assert
        expect(states[3].isActive).toBe(true);
      });

      it('Then last step should not be marked as completed', () => {
        // Arrange1
        defaultCurrentStep.set(3);
        fixture.detectChanges();

        // Act
        const states = component.stepStates();

        // Assert
        expect(states[3].isCompleted).toBe(false);
      });
    });
  });

  describe('Given DOM rendering', () => {
    describe('When component renders with 4 steps', () => {
      it('Then should render exactly 4 step items', () => {
        // Arrange
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const stepItems = debugElement.queryAll(By.css('.step'));

        // Assert
        expect(stepItems.length).toBe(4);
      });

      it('Then should render ordered list with role attribute', () => {
        // Arrange1
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const list = debugElement.query(By.css('ol.progress-steps'));

        // Assert
        expect(list.nativeElement.getAttribute('role')).toBe('list');
      });
    });

    describe('When current step is first step', () => {
      it('Then first step should have active CSS class', () => {
        // Arrange
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const firstStep = debugElement.query(By.css('.step'));

        // Assert
        expect(firstStep.nativeElement.classList.contains('active')).toBe(true);
      });

      it('Then first step should display step number', () => {
        // Arrange
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const indicator = debugElement.query(By.css('.step .step-indicator span'));

        // Assert
        expect(indicator.nativeElement.textContent.trim()).toBe('1');
      });

      it('Then second step should have pending CSS class', () => {
        // Arrange
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const steps = debugElement.queryAll(By.css('.step'));

        // Assert
        expect(steps[1].nativeElement.classList.contains('pending')).toBe(true);
      });
    });

    describe('When current step is second step', () => {
      it('Then first step should have completed CSS class', () => {
        // Arrange
        defaultCurrentStep.set(1);

        // Act
        fixture.detectChanges();
        const steps = debugElement.queryAll(By.css('.step'));

        // Assert
        expect(steps[0].nativeElement.classList.contains('completed')).toBe(true);
      });

      it('Then first step should display checkmark', () => {
        // Arrange
        defaultCurrentStep.set(1);

        // Act
        fixture.detectChanges();
        const checkmark = debugElement.query(By.css('.step .checkmark'));

        // Assert
        expect(checkmark.nativeElement.textContent.trim()).toBe('✓');
      });

      it('Then second step should have active CSS class', () => {
        // Arrange
        defaultCurrentStep.set(1);

        // Act
        fixture.detectChanges();
        const steps = debugElement.queryAll(By.css('.step'));

        // Assert
        expect(steps[1].nativeElement.classList.contains('active')).toBe(true);
      });
    });

    describe('When rendering step titles', () => {
      it('Then each step should display correct label', () => {
        // Arrange
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const titles = debugElement.queryAll(By.css('.step-title'));

        // Assert
        expect(titles[0].nativeElement.textContent.trim()).toBe('Step 1');
      });
    });

    describe('When rendering step lines', () => {
      it('Then should not render line after last step', () => {
        // Arrange
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const lastStep = debugElement.queryAll(By.css('.step'))[3];
        const line = lastStep.query(By.css('.step-line'));

        // Assert
        expect(line).toBeNull();
      });

      it('Then completed step line should have completed-line CSS class', () => {
        // Arrange
        defaultCurrentStep.set(2);

        // Act
        fixture.detectChanges();
        const firstStep = debugElement.query(By.css('.step'));
        const line = firstStep.query(By.css('.step-line'));

        // Assert
        expect(line.nativeElement.classList.contains('completed-line')).toBe(true);
      });
    });
  });

  describe('Given accessibility requirements', () => {
    describe('When rendering step items', () => {
      it('Then each step should have listitem role', () => {
        // Arrange
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const stepItems = debugElement.queryAll(By.css('.step'));

        // Assert
        expect(stepItems[0].nativeElement.getAttribute('role')).toBe('listitem');
      });

      it('Then each step should have descriptive aria-label', () => {
        // Arrange
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const stepItems = debugElement.queryAll(By.css('.step'));

        // Assert
        expect(stepItems[0].nativeElement.getAttribute('aria-label')).toBe('Step 1 of 4: Step 1');
      });
    });

    describe('When active step is rendered', () => {
      it('Then active step should have aria-current attribute set to step', () => {
        // Arrange
        defaultCurrentStep.set(1);

        // Act
        fixture.detectChanges();
        const steps = debugElement.queryAll(By.css('.step'));

        // Assert
        expect(steps[1].nativeElement.getAttribute('aria-current')).toBe('step');
      });
    });

    describe('When non-active step is rendered', () => {
      it('Then non-active step should not have aria-current attribute', () => {
        // Arrange
        defaultCurrentStep.set(1);

        // Act
        fixture.detectChanges();
        const steps = debugElement.queryAll(By.css('.step'));

        // Assert
        expect(steps[0].nativeElement.hasAttribute('aria-current')).toBe(false);
      });
    });

    describe('When checkmark is rendered', () => {
      it('Then checkmark should have aria-hidden attribute', () => {
        // Arrange
        defaultCurrentStep.set(1);

        // Act
        fixture.detectChanges();
        const checkmark = debugElement.query(By.css('.checkmark'));

        // Assert
        expect(checkmark.nativeElement.getAttribute('aria-hidden')).toBe('true');
      });
    });

    describe('When step number is rendered', () => {
      it('Then step number should have aria-hidden attribute', () => {
        // Arrange
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const indicator = debugElement.query(By.css('.step-indicator span'));

        // Assert
        expect(indicator.nativeElement.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  describe('Given edge cases', () => {
    describe('When only one step exists', () => {
      it('Then should render single step correctly', () => {
        // Arrange
        defaultSteps.set(['Single Step']);
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const stepItems = debugElement.queryAll(By.css('.step'));

        // Assert
        expect(stepItems.length).toBe(1);
      });

      it('Then single step should not have connector line', () => {
        // Arrange
        defaultSteps.set(['Single Step']);
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const line = debugElement.query(By.css('.step-line'));

        // Assert
        expect(line).toBeNull();
      });
    });

    describe('When steps array is empty', () => {
      it('Then should not render any step items', () => {
        // Arrange
        defaultSteps.set([]);
        defaultCurrentStep.set(0);

        // Act
        fixture.detectChanges();
        const stepItems = debugElement.queryAll(By.css('.step'));

        // Assert
        expect(stepItems.length).toBe(0);
      });
    });
  });
});
