document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("registrationForm") as HTMLFormElement;
  const eventNameDisplay = document.getElementById("selectedEventName");
  const statusMessage = document.getElementById("statusMessage");
  
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  if (eventId) {
    try {
      const response = await fetch(`http://localhost:3000/api/events`);
      const result = await response.json();
      
      const currentEvent = result.data.find((e: any) => e.id === parseInt(eventId));
      
      if (currentEvent && eventNameDisplay) {
        eventNameDisplay.textContent = currentEvent.name;
      }
    } catch (err) {
      console.error("Could not fetch event details for display.");
    }
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (statusMessage) statusMessage.classList.add("hidden");

    const formData = new FormData(form);
    const payload = {
      eventId: eventId ? parseInt(eventId) : null,
      name: formData.get("name"),
      email: formData.get("email"),
      phonenumber: formData.get("phonenumber")
    };

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">◌</span> Processing...`;

    try {
      const response = await fetch("http://localhost:3000/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        window.location.href = "/pages/thank-you.html";
      } else if (response.status === 409) {
        showStatus("You are already registered for this session.", "warning");
        submitBtn.disabled = false;
        submitBtn.textContent = "Register Now";
      } else {
        throw new Error("Registration failed");
      }
    } catch (err) {
      showStatus("Something went wrong. Please try again.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Register Now";
    }
  });

  function showStatus(text: string, type: "warning" | "error") {
    if (!statusMessage) return;
    statusMessage.textContent = text;
    statusMessage.classList.remove("hidden", "bg-amber-500/10", "text-amber-400", "bg-red-500/10", "text-red-400");
    if (type === "warning") {
      statusMessage.classList.add("bg-amber-500/10", "text-amber-400", "border-amber-500/20");
    } else {
      statusMessage.classList.add("bg-red-500/10", "text-red-400", "border-red-500/20");
    }
  }
});