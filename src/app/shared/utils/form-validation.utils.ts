import { FieldState, FieldTree } from '@angular/forms/signals';

/**
 * Utility functions for Signal Forms validation
 * Eliminates code duplication across form components
 * Follows Object Calisthenics - no primitive wrapping, proper encapsulation
 */

/**
 * Checks if a field should display as invalid
 * A field is invalid if it has errors AND has been interacted with
 * Accepts FieldTree which resolves to FieldState for primitives
 */
export function isFieldInvalid(field: FieldTree<unknown, string> | FieldState<unknown, string>): boolean {
  // FieldTree for primitives is a callable that returns FieldState
  const fieldState = typeof field === 'function' ? (field as () => FieldState<unknown, string>)() : field;
  return fieldState.invalid() && (fieldState.dirty() || fieldState.touched());
}

/**
 * Extracts the first error message from a field's errors object
 * Returns null if no errors exist
 * Accepts FieldTree which resolves to FieldState for primitives
 */
export function getFieldError(field: FieldTree<unknown, string> | FieldState<unknown, string>): string | null {
  // FieldTree for primitives is a callable that returns FieldState
  const fieldState = typeof field === 'function' ? (field as () => FieldState<unknown, string>)() : field;
  const errors = fieldState.errors();
  if (!errors) return null;

  const firstKey = Object.keys(errors)[0];
  const error = errors[firstKey as keyof typeof errors];
  
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  
  return null;
}
