const form = document.getElementById("registerForm");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const address = document.getElementById("address");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const secretQuestion1 = document.getElementById("secretQuestion1");
const secretQuestion2 = document.getElementById("secretQuestion2");
const secretAnswer1 = document.getElementById("secretAnswer1");
const secretAnswer2 = document.getElementById("secretAnswer2");

const firstNameError = document.getElementById("firstNameError");
const lastNameError = document.getElementById("lastNameError");
const phoneError = document.getElementById("phoneError");
const emailError = document.getElementById("emailError");
const confirmError = document.getElementById("confirmError");

const countryCode = document.querySelector(".country-code");

/* NAME VALIDATION */
function validateName(input, errorEl) {
    if (input.value.trim() === "") {
        input.dataset.valid = "neutral";
        errorEl.textContent = "";
        return;
    }
    if (/^[A-Za-z ]+$/.test(input.value)) {
        input.dataset.valid = "true";
        errorEl.textContent = "";
    } else {
        input.dataset.valid = "false";
        errorEl.textContent = "Only alphabets and spaces allowed";
    }
}

[firstName, lastName].forEach(inp => {
    const err = inp === firstName ? firstNameError : lastNameError;
    inp.addEventListener("input", () => validateName(inp, err));
});

/* PHONE VALIDATION */
phone.addEventListener("input", () => {
    phone.value = phone.value.replace(/\D/g, "")
    if (phone.value.trim() === "") {
        phone.dataset.valid = "neutral";
        countryCode.dataset.valid = "neutral";
        phoneError.textContent = "";
        return;
    }

    if (/^[6-9]\d{9}$/.test(phone.value)) {
        phone.dataset.valid = "true";
        countryCode.dataset.valid = "true";
        phoneError.textContent = "";
    } else {
        phone.dataset.valid = "false";
        countryCode.dataset.valid = "false";
        phoneError.textContent = "Enter valid Indian mobile number";
    }
});

/* EMAIL */
email.addEventListener("input", () => {
    if (email.value.trim() === "") {
        email.dataset.valid = "neutral";
        emailError.textContent = "";
        return;
    }

    if (/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.value)) {
        email.dataset.valid = "true";
        emailError.textContent = "";
    } else {
        email.dataset.valid = "false";
        emailError.textContent = "Enter a valid email address";
    }
});

/* ADDRESS */
address.addEventListener("input", () => {
    address.dataset.valid = address.value.trim() ? "true" : "neutral";
});

/* CONFIRM PASSWORD */
confirmPassword.addEventListener("input", () => {
    if (!confirmPassword.value.trim()) {
        confirmPassword.dataset.valid = "neutral";
        confirmError.textContent = "";
        return;
    }
    if (confirmPassword.value === password.value) {
        confirmPassword.dataset.valid = "true";
        confirmError.textContent = "";
    } else {
        confirmPassword.dataset.valid = "false";
        confirmError.textContent = "Passwords do not match";
    }
});

/* ----------------------------------------------
   PASSWORD VALIDATION + TOOLTIP
---------------------------------------------- */
const passwordTooltip = document.getElementById("passwordTooltip");

password.addEventListener("focus", () => {
    passwordTooltip.classList.add("show");
});

password.addEventListener("input", () => {
    const v = password.value;

    if (v.trim() === "") {
        password.dataset.valid = "neutral";
        passwordTooltip.classList.add("show");

        // ✅ RESET ALL RULE STATES
        document.getElementById("rule-length").classList.remove("valid");
        document.getElementById("rule-alpha").classList.remove("valid");
        document.getElementById("rule-digit").classList.remove("valid");
        document.getElementById("rule-special").classList.remove("valid");

        return;
    }

    const rules = {
        length: v.length >= 8,
        alpha: /[A-Za-z]/.test(v),
        digit: /\d/.test(v),
        special: /[@$!%*#?&]/.test(v)
    };

    document.getElementById("rule-length").classList.toggle("valid", rules.length);
    document.getElementById("rule-alpha").classList.toggle("valid", rules.alpha);
    document.getElementById("rule-digit").classList.toggle("valid", rules.digit);
    document.getElementById("rule-special").classList.toggle("valid", rules.special);

    if (Object.values(rules).every(Boolean)) {
        password.dataset.valid = "true";
        passwordTooltip.classList.remove("show");
    } else {
        password.dataset.valid = "false";
        passwordTooltip.classList.add("show");
    }
});

/* Hide tooltip when clicking outside password field */
document.addEventListener("click", (e) => {
    const field = password.closest(".password-field");
    if (!field.contains(e.target)) {
        passwordTooltip.classList.remove("show");
    }
});

/* SECRET QUESTION SYNC */
function syncSecretQuestions(changed, other) {
    const value = changed.value;

    // Enable all options first
    [...other.options].forEach(opt => opt.disabled = false);

    // Disable selected option in the other dropdown
    if (value) {
        [...other.options].forEach(opt => {
            if (opt.value === value) {
                opt.disabled = true;
            }
        });
    }

    // Reset if duplicate was selected
    if (other.value === value) {
        other.value = "";
    }
}

secretQuestion1.addEventListener("change", () => {
    syncSecretQuestions(secretQuestion1, secretQuestion2);
});

secretQuestion2.addEventListener("change", () => {
    syncSecretQuestions(secretQuestion2, secretQuestion1);
});

/* SUBMIT */
form.addEventListener("submit", e => {
    e.preventDefault();

    const invalid =
        firstName.dataset.valid !== "true" ||
        phone.dataset.valid !== "true" ||
        email.dataset.valid !== "true" ||
        address.dataset.valid !== "true" ||
        confirmPassword.dataset.valid !== "true" ||
        (lastName.value.trim() && lastName.dataset.valid !== "true") ||
	!secretQuestion1.value ||
    	!secretAnswer1.value.trim() ||
    	!secretQuestion2.value ||
    	!secretAnswer2.value.trim();

    if (invalid) {
        alert("Please fill all mandatory fields correctly.");
        return;
    }
    
    alert("Registration successful!");
});