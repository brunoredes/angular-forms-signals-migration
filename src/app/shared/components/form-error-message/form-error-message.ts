import { ChangeDetectionStrategy, Component, input } from '@angular/core';



/**
 * Component to display form error messages with accessibility features.
 * It uses ARIA attributes to ensure that error messages are announced by screen readers.
 * @example
 * <app-form-error-message>
 *   This field is required.
 * </app-form-error-message>
 * 
 * Inputs:
 * - uniqueId: A unique identifier for the error message element. This is used for accessibility purposes.
 */
@Component({
  selector: 'app-form-error-message',
  imports: [],
  templateUrl: './form-error-message.html',
  styleUrls: ['./form-error-message.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'error',
    'role': 'status',
    'aria-live': 'assertive',
    'aria-atomic': 'true',
    '[attr.id]': 'uniqueId()'
  }
})
export class FormErrorMessage {
  uniqueId = input<string>(crypto.randomUUID());
}
