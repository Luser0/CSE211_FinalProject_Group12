import type { EventsGetType } from "api/events";

const API_URL = `https://cse-211-final-project-group12.vercel.app/api/events`;
let allEvents: EventsGetType["data"] = [];
let currentEvent: EventsGetType["data"][number] | null = null;

function formatDate(dateString: string | Date): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function fetchEvents(): Promise<void> {
  const loading = document.getElementById("loading");
  const errorEl = document.getElementById("error");
  const tableContainer = document.getElementById("tableContainer");

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const result: EventsGetType = await response.json();

    allEvents = (result.data || []).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    renderTable();
    loading?.classList.add("hidden");
    tableContainer?.classList.remove("hidden");
  } catch (err) {
    loading?.classList.add("hidden");
    errorEl?.classList.remove("hidden");
    const msg = document.getElementById("errorMessage");
    if (msg) msg.textContent = "Unable to load the Event-X schedule.";
  }
}

function renderTable(): void {
  const tbody = document.getElementById("eventsBody");
  const count = document.getElementById("resultCount");
  if (!tbody) return;

  if (count) count.textContent = allEvents.length.toString();
  tbody.innerHTML = "";

  allEvents.forEach((event) => {
    const row = document.createElement("tr");
    row.className =
      "group border-b border-gray-800/50 hover:bg-white/[0.02] transition-all cursor-pointer";

    row.innerHTML = `
      <td class="px-6 py-6">
        <span class="block text-sm font-bold text-white group-hover:text-[#50a2ff] transition-colors">
          ${escapeHtml(event.name)}
        </span>
      </td>
      <td class="px-6 py-6">
        <span class="text-xs font-mono font-medium text-gray-500 uppercase tracking-widest">
          ${formatDate(event.date)}
        </span>
      </td>
      <td class="px-6 py-6 hidden lg:table-cell">
        <p class="text-sm text-gray-400 line-clamp-1 max-w-sm">
          ${escapeHtml(event.description)}
        </p>
      </td>
      <td class="px-6 py-6 text-right">
        <button class="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white border border-gray-700 group-hover:border-[#50a2ff] px-4 py-2 rounded-md transition-all">
          Details
        </button>
      </td>
    `;

    row.onclick = () => openModal(event);
    tbody.appendChild(row);
  });
}

function openModal(event: EventsGetType["data"][number]): void {
  currentEvent = event;
  const modal = document.getElementById("eventModal");
  if (modal) {
    document.getElementById("modalTitle")!.textContent = event.name;
    document.getElementById("modalDescription")!.textContent =
      event.description;
    document.getElementById("modalDate")!.textContent = formatDate(event.date);

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(): void {
  const modal = document.getElementById("eventModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("closeModal")?.addEventListener("click", closeModal);
  document.getElementById("registerBtn")?.addEventListener("click", () => {
    if (currentEvent)
      window.location.href = `/pages/registration.html?event=${currentEvent.slug}`;
  });

  const modal = document.getElementById("eventModal");
  modal?.addEventListener("click", (e) => e.target === modal && closeModal());

  fetchEvents();
});
