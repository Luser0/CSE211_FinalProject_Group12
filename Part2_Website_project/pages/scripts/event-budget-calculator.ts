class EventBudgetCalculator {
  private ticketInput: HTMLInputElement;
  private travelInput: HTMLInputElement;
  private stayInput: HTMLInputElement;
  private nightsInput: HTMLInputElement;
  private displayElement: HTMLElement;

  constructor() {
    this.ticketInput = document.querySelector("#ticketCost") as HTMLInputElement;
    this.travelInput = document.querySelector("#travelCost") as HTMLInputElement;
    this.stayInput = document.querySelector("#accommodationCost") as HTMLInputElement;
    this.nightsInput = document.querySelector("#nights") as HTMLInputElement;
    this.displayElement = document.querySelector("#totalDisplay") as HTMLElement;

    this.init();
  }

  private init(): void {
    const calcBtn = document.querySelector("#calculateBtn");
    calcBtn?.addEventListener("click", () => this.calculateTotal());
  }

  private calculateTotal(): void {
    const ticket = parseFloat(this.ticketInput.value) || 0;
    const travel = parseFloat(this.travelInput.value) || 0;
    const stay = parseFloat(this.stayInput.value) || 0;
    const nights = parseInt(this.nightsInput.value) || 0;

    const total = ticket + travel + stay * nights;
    this.updateUI(total);
  }

  private updateUI(total: number): void {
    if (this.displayElement) {
      this.displayElement.innerHTML = `
        ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
        <span class="text-xl text-gray-600 ml-2">EGP</span>
      `;

      this.displayElement.classList.add("animate-pulse", "text-[#50a2ff]");
      setTimeout(() => {
        this.displayElement.classList.remove("animate-pulse", "text-[#50a2ff]");
      }, 1000);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new EventBudgetCalculator();
});