import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-progress-step',
  imports: [],
  templateUrl: './progress-step.html',
  styleUrl: './progress-step.scss',
  encapsulation: ViewEncapsulation.ExperimentalIsolatedShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressStep {
  steps = input.required<string[]>();
  currentStep = input.required<number>();

  // Computed signals for step states
  stepStates = computed(() => {
    const current = this.currentStep();
    return this.steps().map((step, index) => ({
      label: step,
      index,
      isActive: index === current,
      isCompleted: index < current,
      isPending: index > current,
      ariaLabel: `Step ${index + 1} of ${this.steps().length}: ${step}`,
      ariaCurrent: index === current ? 'step' : null
    }));
  });
}
