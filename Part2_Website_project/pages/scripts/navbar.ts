// Mobile menu toggle functionality
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuButton = document.querySelector("#mobile-menu-button");
  const mobileMenu = document.querySelector("#mobile-menu");
  const menuOpenIcon = document.querySelector("#menu-open-icon");
  const menuCloseIcon = document.querySelector("#menu-close-icon");

  if (mobileMenuButton && mobileMenu && menuOpenIcon && menuCloseIcon) {
    mobileMenuButton.addEventListener("click", () => {
      const isExpanded =
        mobileMenuButton.getAttribute("aria-expanded") === "true";

      // Toggle menu visibility
      mobileMenu.classList.toggle("hidden");

      // Toggle icons
      menuOpenIcon.classList.toggle("hidden");
      menuCloseIcon.classList.toggle("hidden");

      // Update aria-expanded attribute
      mobileMenuButton.setAttribute("aria-expanded", String(!isExpanded));
    });
  }
});

const navbar = document.querySelector("#navbar");
if (navbar) {
  navbar.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="shrink-0">
            <a href="/" class="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Event-X
            </a>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex md:items-center md:space-x-6">
            <a href="/" class="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="/pages/about.html" class="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">About</a>
            <a href="/pages/events.html" class="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Events</a>
            <a href="/pages/budget-calculator.html" class="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Budget Calculator</a>
            <a href="/pages/registration.html" class="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Registration</a>
            <a href="/pages/contact.html" class="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Contact</a>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button id="mobile-menu-button" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors" aria-controls="mobile-menu" aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <!-- Hamburger icon -->
              <svg id="menu-open-icon" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <!-- Close icon -->
              <svg id="menu-close-icon" class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div id="mobile-menu" class="hidden md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
          <a href="/" class="block hover:bg-gray-700 hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-base font-medium">Home</a>
          <a href="/pages/about.html" class="block hover:bg-gray-700 hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-base font-medium">About</a>
          <a href="/pages/events.html" class="block hover:bg-gray-700 hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-base font-medium">Events</a>
          <a href="/pages/budget-calculator.html" class="block hover:bg-gray-700 hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-base font-medium">Budget Calculator</a>
          <a href="/pages/registration.html" class="block hover:bg-gray-700 hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-base font-medium">Registration</a>
          <a href="/pages/contact.html" class="block hover:bg-gray-700 hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-base font-medium">Contact</a>
        </div>
      </div>
      `;
}
