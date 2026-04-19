const resetMethod = document.getElementById("resetMethod");
const detailsSection = document.getElementById("detailsSection");
const questionSection = document.getElementById("questionSection");
const passwordSection = document.getElementById("passwordSection");
const verifyBtn = document.getElementById("verifyBtn");
const confirmError = document.getElementById("confirmError");

/* Matching Details Fields */
const fullName = document.getElementById("fullName");
const phone = document.getElementById("phone");
const email = document.getElementById("email");

/* Error fields */
const nameError = document.getElementById("nameError");
const phoneError = document.getElementById("phoneError");
const emailError = document.getElementById("emailError");

/* Password fields */
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const passwordTooltip = document.getElementById("passwordTooltip");

/* Mock user (replace with backend later) */
const MOCK_USER = {
  name: "user",
  phone: "9999999999",
  email: "user@user.com",
  secretAnswer: "user"
};

/* =====================
   RESET METHOD TOGGLE
===================== */
resetMethod.addEventListener("change", () => {
  detailsSection.classList.add("hidden");
  questionSection.classList.add("hidden");
  passwordSection.classList.add("hidden");
  clearValidation();

  if (resetMethod.value === "details") {
    detailsSection.classList.remove("hidden");
  }

  if (resetMethod.value === "question") {
    questionSection.classList.remove("hidden");
  }
});

/* =====================
   VALIDATION FUNCTIONS
===================== */
function validateName() {
  const value = fullName.value.trim();
  const regex = /^[A-Za-z ]{3,}$/;

  if (!value) {
    setError(fullName, nameError, "Full name is required");
    return false;
  }
  if (!regex.test(value)) {
    setError(fullName, nameError, "Only alphabets, minimum 3 characters");
    return false;
  }
  setSuccess(fullName, nameError);
  return true;
}

function validatePhone() {
  const value = phone.value.trim();
  const regex = /^[0-9]{10}$/;

  if (!value) {
    setError(phone, phoneError, "Phone number is required");
    return false;
  }
  if (!regex.test(value)) {
    setError(phone, phoneError, "Enter valid 10-digit phone number");
    return false;
  }
  setSuccess(phone, phoneError);
  return true;
}

function validateEmail() {
  const value = email.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    setError(email, emailError, "Email is required");
    return false;
  }
  if (!regex.test(value)) {
    setError(email, emailError, "Enter a valid email address");
    return false;
  }
  setSuccess(email, emailError);
  return true;
}

/* =====================
   UI HELPERS
===================== */
function setError(input, errorEl, message) {
  input.classList.add("input-error");
  input.classList.remove("input-success");
  errorEl.textContent = message;
}

function setSuccess(input, errorEl) {
  input.classList.remove("input-error");
  input.classList.add("input-success");
  errorEl.textContent = "";
}

function clearValidation() {
  [fullName, phone, email].forEach(input => {
    input.classList.remove("input-error", "input-success");
  });
  [nameError, phoneError, emailError].forEach(err => {
    err.textContent = "";
  });
}

/* =====================
   LIVE VALIDATION
===================== */
fullName.addEventListener("input", validateName);
phone.addEventListener("input", validatePhone);
email.addEventListener("input", validateEmail);

/* =====================
   VERIFY BUTTON LOGIC
===================== */
verifyBtn.addEventListener("click", () => {
  let verified = false;

  if (resetMethod.value === "details") {
    const valid =
      validateName() &&
      validatePhone() &&
      validateEmail();

    if (!valid) return;

    verified =
      fullName.value === MOCK_USER.name &&
      phone.value === MOCK_USER.phone &&
      email.value === MOCK_USER.email;
  }

  if (resetMethod.value === "question") {
    verified =
      document.getElementById("secretAnswer")
        .value.trim()
        .toLowerCase() === MOCK_USER.secretAnswer;
  }

  if (verified) {
    passwordSection.classList.remove("hidden");
  } else {
    alert("Details do not match our records");
  }
});

/* =====================
   PASSWORD TOOLTIP (REGISTER-STYLE)
===================== */
newPassword.addEventListener("focus", () => {
  passwordTooltip.classList.add("show");
});

newPassword.addEventListener("input", () => {
  const v = newPassword.value;

  if (v.trim() === "") {
    passwordTooltip.classList.add("show");

    resetRules();
    return;
  }

  const rules = {
    length: v.length >= 8,
    alpha: /[A-Za-z]/.test(v),
    digit: /\d/.test(v),
    special: /[@$!%*#?&]/.test(v)
  };

  toggleRule("r-length", rules.length);
  toggleRule("r-alpha", rules.alpha);
  toggleRule("r-digit", rules.digit);
  toggleRule("r-special", rules.special);

  if (Object.values(rules).every(Boolean)) {
    passwordTooltip.classList.remove("show");
  } else {
    passwordTooltip.classList.add("show");
  }
});

function toggleRule(id, valid) {
  document.getElementById(id).classList.toggle("valid", valid);
}

function resetRules() {
  ["r-length", "r-alpha", "r-digit", "r-special"].forEach(id => {
    document.getElementById(id).classList.remove("valid");
  });
}

function isPasswordStrong(pwd) {
  return (
    pwd.length >= 8 &&
    /[A-Za-z]/.test(pwd) &&
    /\d/.test(pwd) &&
    /[@$!%*#?&]/.test(pwd)
  );
}

/* Hide tooltip when clicking outside */
document.addEventListener("click", e => {
  const field = newPassword.closest(".password-field");
  if (field && !field.contains(e.target)) {
    passwordTooltip.classList.remove("show");
  }
});

/* =====================
   FINAL SUBMIT
===================== */
document.getElementById("resetForm").addEventListener("submit", e => {
  e.preventDefault();

  const pwd = newPassword.value;
  const cpwd = confirmPassword.value;

  if (!isPasswordStrong(pwd)) {
    confirmError.textContent = "Password does not meet requirements";
    passwordTooltip.classList.add("show");
    return;
  }

  if (pwd !== cpwd) {
    confirmError.textContent = "Passwords do not match";
    return;
  }

  window.location.href = "login.html";
});