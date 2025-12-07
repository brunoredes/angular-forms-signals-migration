import { Component, inject } from '@angular/core';
import { ProgressStep } from '../../../shared/components/progress-step/progress-step';
import { Viacep } from '../../../shared/services/viacep';

@Component({
  selector: 'app-search-flight',
  imports: [ProgressStep],
  templateUrl: './search-flight.html',
  styleUrl: './search-flight.scss',
})
export class SearchFlight {
  private readonly viaCepService = inject(Viacep);

  currentStep = 0;

  steps = [
    'Flight Details',
    'Passengers',
    'Services',
    'Payment'
  ];
}
