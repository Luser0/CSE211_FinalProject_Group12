class EventBudgetCalculator {
  // Requirements: Avoid global variables except for class instances
  private ticketInput: HTMLInputElement;
  private travelInput: HTMLInputElement;
  private stayInput: HTMLInputElement;
  private nightsInput: HTMLInputElement;
  private displayElement: HTMLElement;

  constructor() {
    this.ticketInput = document.querySelector(
      "#ticketCost",
    ) as HTMLInputElement;
    this.travelInput = document.querySelector(
      "#travelCost",
    ) as HTMLInputElement;
    this.stayInput = document.querySelector(
      "#accommodationCost",
    ) as HTMLInputElement;
    this.nightsInput = document.querySelector("#nights") as HTMLInputElement;
    this.displayElement = document.querySelector(
      "#totalDisplay",
    ) as HTMLElement;

    this.init();
  }

  private init(): void {
    const calcBtn = document.querySelector("#calculateBtn");
    // Listen for events (clicks/form submissions)
    calcBtn?.addEventListener("click", () => this.calculateTotal());
  }

  private calculateTotal(): void {
    const ticket = parseFloat(this.ticketInput.value) || 0;
    const travel = parseFloat(this.travelInput.value) || 0;
    const stay = parseFloat(this.stayInput.value) || 0;
    const nights = parseInt(this.nightsInput.value) || 0;

    // Requirement: Display calculated budget results
    const total = ticket + travel + stay * nights;
    this.updateUI(total);
  }

  private updateUI(total: number): void {
    if (this.displayElement) {
      // Requirement: Dynamic update using raw JavaScript
      this.displayElement.textContent = `$${total.toFixed(2)}`;
    }
  }
}

// Instantiate the class
document.addEventListener("DOMContentLoaded", () => {
  new EventBudgetCalculator();
});
