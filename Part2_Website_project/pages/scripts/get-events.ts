// Types
interface Event {
  id: number;
  name: string;
  description: string;
  slug: string;
  date: string;
  categoryId: number;
}

interface ApiResponse {
  data: Event[];
}

// Configuration
const API_URL = `https://cse-211-final-project-group12.vercel.app/api/events`;

// State
let allEvents: Event[] = [];
let filteredEvents: Event[] = [];
let currentEvent: Event | null = null;

// Utility Functions
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// API Functions
async function fetchEvents(): Promise<void> {
  console.log("Fetching events from:", API_URL);

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    console.log("Fetched events:", result);

    allEvents = result.data || [];
    filteredEvents = [...allEvents];

    renderEvents();
    hideLoading();
  } catch (error) {
    console.error("Error fetching events:", error);
    showError(
      `Failed to load events: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

// UI State Functions
function hideLoading(): void {
  const loading = document.getElementById("loading");
  if (loading) loading.classList.add("hidden");
}

function showError(message: string): void {
  hideLoading();
  const errorElement = document.getElementById("error");
  const errorMessage = document.getElementById("errorMessage");

  if (errorElement && errorMessage) {
    errorMessage.textContent = message;
    errorElement.classList.remove("hidden");
  }
}

// Filter and Sort Functions
function filterAndSortEvents(): void {
  const searchInput =
    (
      document.getElementById("searchInput") as HTMLInputElement
    )?.value.toLowerCase() || "";
  const categoryFilter =
    (document.getElementById("categoryFilter") as HTMLSelectElement)?.value ||
    "";
  const sortBy =
    (document.getElementById("sortBy") as HTMLSelectElement)?.value || "date";

  // Filter
  filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchInput) ||
      event.description.toLowerCase().includes(searchInput);
    const matchesCategory =
      !categoryFilter || event.categoryId.toString() === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Sort
  filteredEvents.sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  renderEvents();
}

// Render Functions
function renderEvents(): void {
  const container = document.getElementById("eventsContainer");
  const emptyState = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");

  if (!container) return;

  // Update result count
  if (resultCount) {
    resultCount.textContent = filteredEvents.length.toString();
  }

  // Show empty state if no events
  if (filteredEvents.length === 0) {
    container.classList.add("hidden");
    emptyState?.classList.remove("hidden");
    return;
  }

  // Show events
  container.classList.remove("hidden");
  emptyState?.classList.add("hidden");

  container.innerHTML = "";

  filteredEvents.forEach((event) => {
    const eventCard = createEventCard(event);
    container.appendChild(eventCard);
  });
}

function createEventCard(event: Event): HTMLElement {
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1";

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  card.innerHTML = `
    <div class="bg-linear-to-r from-blue-500 to-blue-600 h-40 flex items-center justify-center text-white">
      <div class="text-center">
        <div class="text-4xl font-bold">${eventDate.getDate()}</div>
        <div class="text-lg">${eventDate.toLocaleDateString("en-US", { month: "short" })}</div>
        <div class="text-sm opacity-90">${eventDate.getFullYear()}</div>
      </div>
    </div>
    <div class="p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">${escapeHtml(event.name)}</h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">${escapeHtml(event.description)}</p>
      <div class="flex items-center justify-between">
        <div class="flex items-center text-gray-500 text-sm">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          ${eventDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
        </div>
        ${
          isPast
            ? '<span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Past Event</span>'
            : '<span class="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-semibold">Available</span>'
        }
      </div>
    </div>
  `;

  card.addEventListener("click", () => openEventModal(event));

  return card;
}

// Modal Functions
function openEventModal(event: Event): void {
  currentEvent = event;

  const modal = document.getElementById("eventModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalDate = document.getElementById("modalDate");
  const modalCategoryName = document.getElementById("modalCategoryName");

  if (
    modal &&
    modalTitle &&
    modalDescription &&
    modalDate &&
    modalCategoryName
  ) {
    modalTitle.textContent = event.name;
    modalDescription.textContent = event.description;
    modalDate.textContent = formatDate(event.date);
    modalCategoryName.textContent = `Category #${event.categoryId}`;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(): void {
  const modal = document.getElementById("eventModal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    currentEvent = null;
  }
}

function registerForEvent(): void {
  if (!currentEvent) return;
  window.location.href = `/events/register?id=${currentEvent.id}`;
}

/*
function shareEvent(): void {
  if (!currentEvent) return;

  const url = `${window.location.origin}/events/${currentEvent.slug}`;

  if (navigator.share) {
    navigator
      .share({
        title: currentEvent.name,
        text: currentEvent.description,
        url: url,
      })
      .catch(() => {
        // Fallback to copying to clipboard
        copyToClipboard(url);
      });
  } else {
    copyToClipboard(url);
  }
}

function copyToClipboard(text: string): void {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Event link copied to clipboard!");
    })
    .catch(() => {
      alert("Unable to copy link. Please copy manually: " + text);
    });
}
*/

// Event Listeners
function initializeEventListeners(): void {
  // Search and filters
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortBy = document.getElementById("sortBy");

  searchBtn?.addEventListener("click", filterAndSortEvents);
  searchInput?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") filterAndSortEvents();
  });
  categoryFilter?.addEventListener("change", filterAndSortEvents);
  sortBy?.addEventListener("change", filterAndSortEvents);

  // Modal controls
  const closeModalBtn = document.getElementById("closeModal");
  const registerBtn = document.getElementById("registerBtn");
  const modal = document.getElementById("eventModal");

  closeModalBtn?.addEventListener("click", closeModal);
  registerBtn?.addEventListener("click", registerForEvent);
  //   shareBtn?.addEventListener("click", shareEvent);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Close modal on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// Initialize
function init(): void {
  console.log("Initializing events page...");
  initializeEventListeners();
  fetchEvents();
}

// Start the application
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
