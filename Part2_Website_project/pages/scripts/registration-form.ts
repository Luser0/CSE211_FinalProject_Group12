/*
  ID & Name:      Group 12 - CSE211 Web Programming
  Course:         CSE211 Web Programming
  Assignment:     Course Project
  Date:           January 5, 2026
  Purpose:        Handle event registration form with validation
*/

// ========== INTERFACES/TYPES ==========
interface Event {
    id: number;
    name: string;
    description: string;
    slug: string;
    date: string;
    categoryId: number;
}

interface RegistrationData {
    eventId: number;
    name: string;
    email: string;
    phonenumber: string;
    specialRequirements?: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

// ========== ES6 CLASS: FORM VALIDATOR ==========
class FormValidator {
    private form: HTMLFormElement;
    private errors: Map<string, string>;

    constructor(formId: string) {
        const form = document.getElementById(formId) as HTMLFormElement;
        if (!form) {
            throw new Error(`Form with id "${formId}" not found`);
        }
        this.form = form;
        this.errors = new Map();
    }

    // Validate single field
    validateField(fieldName: string, value: string, rules: ValidationRules): boolean {
        const errors: string[] = [];

        if (rules.required && !value.trim()) {
            errors.push(rules.requiredMessage || "This field is required");
        }

        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`Minimum ${rules.minLength} characters required`);
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`Maximum ${rules.maxLength} characters allowed`);
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(rules.patternMessage || "Invalid format");
        }

        if (rules.email && !this.isValidEmail(value)) {
            errors.push("Please enter a valid email address");
        }

        if (rules.phone && !this.isValidPhone(value)) {
            errors.push("Please enter a valid phone number (10-15 digits)");
        }

        if (errors.length > 0) {
            this.errors.set(fieldName, errors[0]);
            this.showError(fieldName, errors[0]);
            return false;
        }

        this.errors.delete(fieldName);
        this.hideError(fieldName);
        return true;
    }

    // Email validation
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation
    private isValidPhone(phone: string): boolean {
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
    }

    // Show error message
    private showError(fieldName: string, message: string): void {
        const field = this.form.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
        const errorElement = document.getElementById(`${fieldName}-error`);

        if (field) {
            field.classList.add("error");
            field.setAttribute("aria-invalid", "true");
        }

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add("visible");
        }
    }

    // Hide error message
    private hideError(fieldName: string): void {
        const field = this.form.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
        const errorElement = document.getElementById(`${fieldName}-error`);

        if (field) {
            field.classList.remove("error");
            field.setAttribute("aria-invalid", "false");
        }

        if (errorElement) {
            errorElement.classList.remove("visible");
        }
    }

    // Validate entire form
    validateForm(): boolean {
        this.errors.clear();
        let isValid = true;

        // Get all form fields
        const fields = this.form.querySelectorAll("input, select, textarea");

        fields.forEach((field) => {
            const element = field as HTMLInputElement;
            const fieldName = element.name;
            const value = element.value;

            if (!fieldName) return;

            // Define validation rules for each field
            const rules = this.getValidationRules(fieldName, element);

            if (rules && !this.validateField(fieldName, value, rules)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Get validation rules for a field
    private getValidationRules(fieldName: string, element: HTMLInputElement): ValidationRules | null {
        const rules: ValidationRules = {
            required: element.required,
            requiredMessage: `${fieldName} is required`,
        };

        switch (fieldName) {
            case "name":
                return {
                    ...rules,
                    minLength: 2,
                    maxLength: 100,
                    requiredMessage: "Please enter your full name",
                };

            case "email":
                return {
                    ...rules,
                    email: true,
                    requiredMessage: "Please enter your email address",
                };

            case "phonenumber":
                return {
                    ...rules,
                    phone: true,
                    requiredMessage: "Please enter your phone number",
                };

            case "eventId":
                return {
                    ...rules,
                    requiredMessage: "Please select an event",
                };

            case "terms":
                if (element.type === "checkbox") {
                    return {
                        required: true,
                        requiredMessage: "You must agree to the terms and conditions",
                    };
                }
                return null;

            default:
                return element.required ? rules : null;
        }
    }

    // Get form data
    getFormData(): RegistrationData {
        const formData = new FormData(this.form);
        return {
            eventId: parseInt(formData.get("eventId") as string),
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phonenumber: formData.get("phonenumber") as string,
            specialRequirements: formData.get("specialRequirements") as string,
        };
    }

    // Reset form
    reset(): void {
        this.form.reset();
        this.errors.clear();

        // Clear all error messages
        const errorElements = this.form.querySelectorAll(".error-message.visible");
        errorElements.forEach((el) => el.classList.remove("visible"));

        // Remove error class from fields
        const errorFields = this.form.querySelectorAll(".error");
        errorFields.forEach((el) => el.classList.remove("error"));
    }
}

// Validation rules interface
interface ValidationRules {
    required?: boolean;
    requiredMessage?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    patternMessage?: string;
    email?: boolean;
    phone?: boolean;
}

// ========== ES6 CLASS: EVENT MANAGER ==========
class EventManager {
    private events: Event[] = [];
    private API_URL = "http://localhost:3000/api";

    // Fetch events from API
    async fetchEvents(): Promise<Event[]> {
        try {
            const response = await fetch(`${this.API_URL}/events`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            this.events = result.data || [];
            return this.events;
        } catch (error) {
            console.error("Error fetching events:", error);
            throw error;
        }
    }

    // Populate event dropdown
    populateEventDropdown(selectId: string): void {
        const select = document.getElementById(selectId) as HTMLSelectElement;

        if (!select) {
            console.error(`Select element with id "${selectId}" not found`);
            return;
        }

        // Clear existing options (except the first placeholder)
        while (select.options.length > 1) {
            select.remove(1);
        }

        // Add events as options
        this.events.forEach((event) => {
            const option = document.createElement("option");
            option.value = event.id.toString();
            option.textContent = `${event.name} - ${this.formatDate(event.date)}`;
            select.appendChild(option);
        });
    }

    // Format date
    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    // Submit registration
    async submitRegistration(data: RegistrationData): Promise<ApiResponse> {
        try {
            const response = await fetch(`${this.API_URL}/registration`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: ApiResponse = await response.json();
            return result;
        } catch (error) {
            console.error("Error submitting registration:", error);
            throw error;
        }
    }
}

// ========== MAIN APPLICATION ==========
class RegistrationApp {
    private validator: FormValidator;
    private eventManager: EventManager;

    constructor() {
        this.validator = new FormValidator("registrationForm");
        this.eventManager = new EventManager();
        this.init();
    }

    async init(): Promise<void> {
        // Load events
        try {
            await this.eventManager.fetchEvents();
            this.eventManager.populateEventDropdown("eventId");
        } catch (error) {
            this.showFormError("Failed to load events. Please refresh the page.");
        }

        // Setup event listeners
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const form = document.getElementById("registrationForm") as HTMLFormElement;

        if (!form) return;

        // Form submission
        form.addEventListener("submit", (e) => this.handleSubmit(e));

        // Reset button
        form.addEventListener("reset", () => {
            this.validator.reset();
            this.hideMessages();
        });

        // Real-time validation on blur
        const fields = form.querySelectorAll("input, select, textarea");
        fields.forEach((field) => {
            field.addEventListener("blur", () => {
                const element = field as HTMLInputElement;
                if (element.name && element.value) {
                    // Trigger validation
                    form.dispatchEvent(new Event("validate-field"));
                }
            });
        });

        // Checkbox validation
        const termsCheckbox = document.getElementById("terms") as HTMLInputElement;
        if (termsCheckbox) {
            termsCheckbox.addEventListener("change", () => {
                if (termsCheckbox.checked) {
                    const errorElement = document.getElementById("terms-error");
                    if (errorElement) {
                        errorElement.classList.remove("visible");
                    }
                }
            });
        }
    }

    private async handleSubmit(event: SubmitEvent): Promise<void> {
        event.preventDefault();

        // Hide previous messages
        this.hideMessages();

        // Validate form
        if (!this.validator.validateForm()) {
            this.showFormError("Please correct the errors in the form.");
            return;
        }

        // Check terms checkbox
        const termsCheckbox = document.getElementById("terms") as HTMLInputElement;
        if (!termsCheckbox.checked) {
            const errorElement = document.getElementById("terms-error");
            if (errorElement) {
                errorElement.classList.add("visible");
            }
            this.showFormError("You must agree to the terms and conditions.");
            return;
        }

        // Get form data
        const data = this.validator.getFormData();

        // Show loading state
        const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Registering...";

        try {
            // Submit registration
            const result = await this.eventManager.submitRegistration(data);

            if (result.success) {
                this.showSuccess();
                this.validator.reset();

                // Redirect to thank you page after 2 seconds
                setTimeout(() => {
                    window.location.href = "/pages/thank-you.html";
                }, 2000);
            } else {
                this.showFormError(result.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            this.showFormError("An error occurred. Please try again later.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    private showSuccess(): void {
        const successMessage = document.getElementById("successMessage");
        if (successMessage) {
            successMessage.classList.remove("hidden");
            successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    private showFormError(message: string): void {
        const formError = document.getElementById("formError");
        const formErrorMessage = document.getElementById("formErrorMessage");

        if (formError && formErrorMessage) {
            formErrorMessage.textContent = message;
            formError.classList.remove("hidden");
            formError.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    private hideMessages(): void {
        const successMessage = document.getElementById("successMessage");
        const formError = document.getElementById("formError");

        if (successMessage) {
            successMessage.classList.add("hidden");
        }

        if (formError) {
            formError.classList.add("hidden");
        }
    }
}

// ========== INITIALIZE APPLICATION ==========
// Wait for DOM to be fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        new RegistrationApp();
    });
} else {
    new RegistrationApp();
}
