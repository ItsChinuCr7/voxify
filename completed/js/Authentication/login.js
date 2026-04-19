const loginForm = document.getElementById("loginForm");
const loginID = document.getElementById("loginID");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

const loginError = document.getElementById("loginError");
const passwordError = document.getElementById("passwordError");

/* Demo credentials */
const DEMO_EMAIL = "user@user.com";
const DEMO_PASSWORD = "user";
const ADMIN_EMAIL="admin@admin.com";
const ADMIN_PASSWORD="admin";
const NETWORK_EMAIL="network@network.com";
const NETWORK_PASSWORD="network";
const SUPPORT_EMAIL="support@support.com";
const SUPPORT_PASSWORD="support";

/* Email Validator */
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* Enable / Disable Button */
function updateButtonState() {
    loginBtn.disabled = !(
        isValidEmail(loginID.value.trim()) &&
        loginPassword.value.trim() !== ""
    );
}

/* Live Email Validation */
loginID.addEventListener("input", () => {
    const value = loginID.value.trim();
    loginError.textContent = "";

    if (value === "") {
        loginID.classList.remove("valid", "invalid");
        updateButtonState();
        return;
    }

    if (isValidEmail(value)) {
        loginID.classList.add("valid");
        loginID.classList.remove("invalid");
    } else {
        loginID.classList.add("invalid");
        loginID.classList.remove("valid");
        loginError.textContent = "Enter a valid email address";
    }

    updateButtonState();
});

/* Password Input */
loginPassword.addEventListener("input", () => {
    passwordError.textContent = "";
    updateButtonState();
});

/* Form Submit */
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = loginID.value.trim();
    const password = loginPassword.value.trim();

    /* Format check */
    if (!isValidEmail(email)) {
        loginError.textContent = "Enter a valid email address";
        return;
    }

    if (password === "") {
        passwordError.textContent = "Enter your password";
        return;
    }

    /* Demo credential check */
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    	window.location.href = "../User/user-dashboard.html";
    } else if(email === ADMIN_EMAIL && password === ADMIN_PASSWORD){
		window.location.href = "../Admin DashBoard/admin-dashboard.html";
	} else if(email === NETWORK_EMAIL && password === NETWORK_PASSWORD){
		window.location.href = "../Network Operator Center/noc-dashboard.html";
	} else if(email === SUPPORT_EMAIL && password === SUPPORT_PASSWORD){
		window.location.href = "../Senior Support Agent/support-dashboard.html";
	} else {
        passwordError.textContent = "Invalid email or password";
    }
});