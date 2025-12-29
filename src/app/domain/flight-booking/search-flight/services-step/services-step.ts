import { Component, input, output } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { Services } from '../../models/flight';

@Component({
  selector: 'app-services-step',
  imports: [Field],
  templateUrl: './services-step.html',
  styleUrls: ['./services-step.scss', '../../../flight-booking-legacy/shared/flight-booking-shared.styles.scss'],
})
export class ServicesStep {
  services = input.required<FieldTree<Services>>();
  next = output();
  previous = output();

  onNext(): void {
    this.next.emit();
  }

  onPrevious() {
    this.previous.emit();
  }
}
