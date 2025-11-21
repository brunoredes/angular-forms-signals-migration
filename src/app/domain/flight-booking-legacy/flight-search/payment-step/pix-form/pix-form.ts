import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pix-form',
  imports: [ReactiveFormsModule],
  templateUrl: './pix-form.html',
  styleUrl: './pix-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixForm {
  formGroup = input.required<FormGroup>();

  isFieldInvalid(control: any): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(control: any): string {
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    if (control.errors['email']) return 'Invalid email format';

    return 'Invalid field';
  }
}
