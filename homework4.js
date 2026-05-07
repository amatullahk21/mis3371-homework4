/*
Program name: homework4.js
Author: Amatullah Kanchwala
Date created: 05/07/2026
Version: 4.0
Description: JavaScript functions for Homework 4 including validation, Fetch API, cookies, local storage, iframe support, review, slider display, validate button, and submit control.
*/

function displayDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("date").textContent = today.toLocaleDateString('en-US', options);
}

function showError(id, message) {
    document.getElementById(id).textContent = message;
}

function clearError(id) {
    document.getElementById(id).textContent = "";
}

function clearAllErrors() {
    const errorBoxes = document.querySelectorAll(".error");
    errorBoxes.forEach(box => box.textContent = "");
}

function hideSubmitButton() {
    document.getElementById("submitBtn").style.display = "none";
}

function updateSlider(value) {
    document.getElementById("salaryValue").textContent =
        "$" + Number(value).toLocaleString();
}

function clearReview() {
    document.getElementById("reviewOutput").innerHTML = "";
    document.getElementById("salaryValue").textContent = "$50,000";
}

/* =========================
   HOMEWORK 4 FUNCTIONS
========================= */

function setCookie(name, value, hours) {
    let expires = "";

    if (hours) {
        const date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();

        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }

    return "";
}

function loadWelcomeMessage() {
    const savedName = getCookie("firstName");

    if (savedName !== "") {
        document.getElementById("welcomeMessage").textContent =
            "Welcome back, " + savedName;

        document.getElementById("newUserLabel").style.display = "block";
        document.getElementById("newUserLabel").innerHTML =
            '<input type="checkbox" id="newUserCheck"> Not ' + savedName + '? Click here to start as a new user.';

        document.getElementById("newUserCheck").addEventListener("change", function () {
            if (this.checked) {
                clearStoredUser();
                document.getElementById("form").reset();
                clearReview();
                hideSubmitButton();
                clearAllErrors();
            }
        });
    } else {
        document.getElementById("welcomeMessage").textContent =
            "Welcome New User";
        document.getElementById("newUserLabel").style.display = "none";
    }
}

function clearStoredUser() {
    localStorage.clear();

    document.cookie =
        "firstName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    document.getElementById("welcomeMessage").textContent =
        "Welcome New User";

    document.getElementById("newUserLabel").style.display = "none";
}

function saveFormData() {
    const rememberMe = document.getElementById("rememberMe");

    if (!rememberMe.checked) {
        clearStoredUser();
        return;
    }

    localStorage.setItem("fname", document.getElementById("fname").value);
    localStorage.setItem("mi", document.getElementById("mi").value);
    localStorage.setItem("lname", document.getElementById("lname").value);
    localStorage.setItem("email", document.getElementById("email").value);
    localStorage.setItem("phone", document.getElementById("phone").value);
    localStorage.setItem("address1", document.getElementById("address1").value);
    localStorage.setItem("address2", document.getElementById("address2").value);
    localStorage.setItem("city", document.getElementById("city").value);
    localStorage.setItem("state", document.getElementById("state").value);
    localStorage.setItem("zip", document.getElementById("zip").value);
    localStorage.setItem("symptoms", document.getElementById("symptoms").value);
    localStorage.setItem("userid", document.getElementById("userid").value);
    localStorage.setItem("salary", document.getElementById("salary").value);

    const firstName = document.getElementById("fname").value.trim();

    if (firstName !== "") {
        setCookie("firstName", firstName, 48);
    }
}

function saveFieldToLocalStorage(fieldId) {
    const rememberMe = document.getElementById("rememberMe");

    if (!rememberMe.checked) {
        return;
    }

    const field = document.getElementById(fieldId);

    if (field) {
        localStorage.setItem(fieldId, field.value);
    }
}

function loadSavedFormData() {
    const savedName = getCookie("firstName");

    if (savedName === "") {
        return;
    }

    const fields = [
        "fname",
        "mi",
        "lname",
        "email",
        "phone",
        "address1",
        "address2",
        "city",
        "zip",
        "symptoms",
        "userid",
        "salary"
    ];

    fields.forEach(field => {
        const savedValue = localStorage.getItem(field);

        if (savedValue !== null) {
            document.getElementById(field).value = savedValue;
        }
    });

    const savedSalary = localStorage.getItem("salary");
    if (savedSalary !== null) {
        updateSlider(savedSalary);
    }
}

async function loadStates() {
    try {
        const response = await fetch("states.html");

        if (!response.ok) {
            throw new Error("State file could not be loaded.");
        }

        const data = await response.text();
        document.getElementById("state").innerHTML = data;

        const savedState = localStorage.getItem("state");
        if (savedState !== null) {
            document.getElementById("state").value = savedState;
        }
    } catch (error) {
        console.log("Error loading states:", error);
        document.getElementById("state").innerHTML = `
            <option value="">Select</option>
            <option value="TX">TX</option>
        `;
    }
}

/* =========================
   VALIDATION FUNCTIONS
========================= */

function validateFirstName() {
    const value = document.getElementById("fname").value.trim();
    const pattern = /^[A-Za-z'-]{1,30}$/;

    if (value === "") {
        showError("fnameError", "First name is required.");
        return false;
    }
    if (!pattern.test(value)) {
        showError("fnameError", "Use 1 to 30 letters, apostrophes, or dashes only.");
        return false;
    }

    clearError("fnameError");
    saveFieldToLocalStorage("fname");
    return true;
}

function validateMiddleInitial() {
    const value = document.getElementById("mi").value.trim();
    const pattern = /^[A-Za-z]{1}$/;

    if (value === "") {
        clearError("miError");
        saveFieldToLocalStorage("mi");
        return true;
    }
    if (!pattern.test(value)) {
        showError("miError", "Middle initial must be one letter only.");
        return false;
    }

    clearError("miError");
    saveFieldToLocalStorage("mi");
    return true;
}

function validateLastName() {
    const value = document.getElementById("lname").value.trim();
    const pattern = /^[A-Za-z'-]{1,30}$/;

    if (value === "") {
        showError("lnameError", "Last name is required.");
        return false;
    }
    if (!pattern.test(value)) {
        showError("lnameError", "Use 1 to 30 letters, apostrophes, or dashes only.");
        return false;
    }

    clearError("lnameError");
    saveFieldToLocalStorage("lname");
    return true;
}

function validateDOB() {
    const value = document.getElementById("dob").value.trim();
    const pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

    if (value === "") {
        showError("dobError", "Date of birth is required.");
        return false;
    }

    if (!pattern.test(value)) {
        showError("dobError", "Use MM/DD/YYYY format.");
        return false;
    }

    const parts = value.split("/");
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const enteredDate = new Date(year, month, day);
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120);

    if (
        enteredDate.getFullYear() !== year ||
        enteredDate.getMonth() !== month ||
        enteredDate.getDate() !== day
    ) {
        showError("dobError", "Enter a real calendar date.");
        return false;
    }

    if (enteredDate > today) {
        showError("dobError", "Date of birth cannot be in the future.");
        return false;
    }

    if (enteredDate < minDate) {
        showError("dobError", "Date of birth cannot be more than 120 years ago.");
        return false;
    }

    clearError("dobError");
    return true;
}

function formatSSN() {
    let value = document.getElementById("ssn").value.replace(/\D/g, "");
    if (value.length > 9) value = value.slice(0, 9);

    let formatted = value;
    if (value.length > 5) {
        formatted = value.slice(0, 3) + "-" + value.slice(3, 5) + "-" + value.slice(5);
    } else if (value.length > 3) {
        formatted = value.slice(0, 3) + "-" + value.slice(3);
    }

    document.getElementById("ssn").value = formatted;
}

function validateSSN() {
    const value = document.getElementById("ssn").value;
    const digits = value.replace(/\D/g, "");

    if (digits.length !== 9) {
        showError("ssnError", "ID number must contain exactly 9 digits.");
        return false;
    }

    clearError("ssnError");
    return true;
}

function formatPhone() {
    let value = document.getElementById("phone").value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);

    let formatted = value;
    if (value.length > 6) {
        formatted = value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6);
    } else if (value.length > 3) {
        formatted = value.slice(0, 3) + "-" + value.slice(3);
    }

    document.getElementById("phone").value = formatted;
}

function validatePhone() {
    const value = document.getElementById("phone").value.trim();

    if (value === "") {
        clearError("phoneError");
        saveFieldToLocalStorage("phone");
        return true;
    }

    const pattern = /^\d{3}-\d{3}-\d{4}$/;
    if (!pattern.test(value)) {
        showError("phoneError", "Phone must be in the format 123-456-7890.");
        return false;
    }

    clearError("phoneError");
    saveFieldToLocalStorage("phone");
    return true;
}

function validateEmail() {
    const emailInput = document.getElementById("email");
    emailInput.value = emailInput.value.toLowerCase().trim();
    const value = emailInput.value;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === "") {
        showError("emailError", "Email is required.");
        return false;
    }
    if (!pattern.test(value)) {
        showError("emailError", "Enter a valid email address.");
        return false;
    }

    clearError("emailError");
    saveFieldToLocalStorage("email");
    return true;
}

function validateAddress1() {
    const value = document.getElementById("address1").value.trim();

    if (value.length < 2 || value.length > 30) {
        showError("address1Error", "Address Line 1 must be 2 to 30 characters.");
        return false;
    }

    clearError("address1Error");
    saveFieldToLocalStorage("address1");
    return true;
}

function validateAddress2() {
    const value = document.getElementById("address2").value.trim();

    if (value === "") {
        clearError("address2Error");
        saveFieldToLocalStorage("address2");
        return true;
    }
    if (value.length < 2 || value.length > 30) {
        showError("address2Error", "Address Line 2 must be 2 to 30 characters if entered.");
        return false;
    }

    clearError("address2Error");
    saveFieldToLocalStorage("address2");
    return true;
}

function validateCity() {
    const value = document.getElementById("city").value.trim();

    if (value.length < 2 || value.length > 30) {
        showError("cityError", "City must be 2 to 30 characters.");
        return false;
    }

    clearError("cityError");
    saveFieldToLocalStorage("city");
    return true;
}

function validateState() {
    const value = document.getElementById("state").value;

    if (value === "") {
        showError("stateError", "Please select a state.");
        return false;
    }

    clearError("stateError");
    saveFieldToLocalStorage("state");
    return true;
}

function validateZip() {
    const value = document.getElementById("zip").value.trim();
    const pattern = /^\d{5}$/;

    if (!pattern.test(value)) {
        showError("zipError", "Zip code must be exactly 5 digits.");
        return false;
    }

    clearError("zipError");
    saveFieldToLocalStorage("zip");
    return true;
}

function validateSymptoms() {
    const value = document.getElementById("symptoms").value;

    if (value.includes('"')) {
        showError("symptomsError", "Do not use double quotes.");
        return false;
    }

    clearError("symptomsError");
    saveFieldToLocalStorage("symptoms");
    return true;
}

function validateHistory() {
    const checked = document.querySelectorAll('input[name="history"]:checked');

    if (checked.length === 0) {
        showError("historyError", "Please select at least one medical history item.");
        return false;
    }

    clearError("historyError");
    return true;
}

function validateGender() {
    const selected = document.querySelector('input[name="gender"]:checked');

    if (!selected) {
        showError("genderError", "Please select a gender.");
        return false;
    }

    clearError("genderError");
    return true;
}

function validateVaccinated() {
    const selected = document.querySelector('input[name="vaccinated"]:checked');

    if (!selected) {
        showError("vaccinatedError", "Please select Yes or No.");
        return false;
    }

    clearError("vaccinatedError");
    return true;
}

function validateInsurance() {
    const selected = document.querySelector('input[name="insurance"]:checked');

    if (!selected) {
        showError("insuranceError", "Please select an insurance option.");
        return false;
    }

    clearError("insuranceError");
    return true;
}

function validateUserId() {
    const value = document.getElementById("userid").value.trim();
    const pattern = /^[A-Za-z][A-Za-z0-9_-]{4,19}$/;

    if (value === "") {
        showError("useridError", "User ID is required.");
        return false;
    }
    if (!pattern.test(value)) {
        showError("useridError", "User ID must be 5 to 20 characters, start with a letter, and contain only letters, numbers, underscores, or dashes.");
        return false;
    }

    clearError("useridError");
    saveFieldToLocalStorage("userid");
    return true;
}

function validatePassword() {
    const password = document.getElementById("password").value;
    const userId = document.getElementById("userid").value.trim();
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (password === "") {
        showError("passwordError", "Password is required.");
        return false;
    }
    if (!pattern.test(password)) {
        showError("passwordError", "Password must be at least 8 characters and include 1 uppercase, 1 lowercase, and 1 number.");
        return false;
    }
    if (password === userId) {
        showError("passwordError", "Password cannot equal your user ID.");
        return false;
    }

    clearError("passwordError");
    return true;
}

function validateConfirmPassword() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (confirmPassword === "") {
        showError("confirmPasswordError", "Please re-enter your password.");
        return false;
    }
    if (password !== confirmPassword) {
        showError("confirmPasswordError", "Passwords do not match.");
        return false;
    }

    clearError("confirmPasswordError");
    return true;
}

function validateForm() {
    let valid = true;

    if (!validateFirstName()) valid = false;
    if (!validateMiddleInitial()) valid = false;
    if (!validateLastName()) valid = false;
    if (!validateDOB()) valid = false;
    if (!validateSSN()) valid = false;
    if (!validateEmail()) valid = false;
    if (!validatePhone()) valid = false;
    if (!validateAddress1()) valid = false;
    if (!validateAddress2()) valid = false;
    if (!validateCity()) valid = false;
    if (!validateState()) valid = false;
    if (!validateZip()) valid = false;
    if (!validateSymptoms()) valid = false;
    if (!validateHistory()) valid = false;
    if (!validateGender()) valid = false;
    if (!validateVaccinated()) valid = false;
    if (!validateInsurance()) valid = false;
    if (!validateUserId()) valid = false;
    if (!validatePassword()) valid = false;
    if (!validateConfirmPassword()) valid = false;

    if (valid) {
        saveFormData();
        loadWelcomeMessage();
        document.getElementById("submitBtn").style.display = "inline-block";
    } else {
        hideSubmitButton();
    }

    return valid;
}

function reviewForm() {
    validateForm();

    const firstName = document.getElementById("fname").value.trim();
    const middleInitial = document.getElementById("mi").value.trim();
    const lastName = document.getElementById("lname").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const idNumber = document.getElementById("ssn").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address1 = document.getElementById("address1").value.trim();
    const address2 = document.getElementById("address2").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value.trim();
    const salary = document.getElementById("salary").value;
    const symptoms = document.getElementById("symptoms").value.trim();
    const userId = document.getElementById("userid").value.trim();

    const checkedHistory = Array.from(document.querySelectorAll('input[name="history"]:checked'))
        .map(item => item.value);

    const gender = document.querySelector('input[name="gender"]:checked')?.value || "";
    const vaccinated = document.querySelector('input[name="vaccinated"]:checked')?.value || "";
    const insurance = document.querySelector('input[name="insurance"]:checked')?.value || "";

    const reviewHtml = `
        <strong>PLEASE REVIEW THIS INFORMATION</strong><br><br>

        <strong>Name:</strong> ${firstName} ${middleInitial} ${lastName}<br>
        <strong>Date of Birth:</strong> ${dob}<br>
        <strong>ID Number:</strong> ${idNumber}<br><br>

        <strong>Email Address:</strong> ${email}<br>
        <strong>Phone Number:</strong> ${phone || "Not entered"}<br><br>

        <strong>Address:</strong><br>
        ${address1}<br>
        ${address2 ? address2 + "<br>" : ""}
        ${city}, ${state} ${zip}<br><br>

        <strong>Medical History:</strong> ${checkedHistory.length ? checkedHistory.join(", ") : "None selected"}<br>
        <strong>Gender:</strong> ${gender || "Not selected"}<br>
        <strong>Vaccinated:</strong> ${vaccinated || "Not selected"}<br>
        <strong>Insurance:</strong> ${insurance || "Not selected"}<br>
        <strong>Desired Salary:</strong> $${Number(salary).toLocaleString()}<br><br>

        <strong>Current Symptoms:</strong><br>
        ${symptoms ? symptoms : "No symptoms entered."}<br><br>

        <strong>User ID:</strong> ${userId}
    `;

    document.getElementById("reviewOutput").innerHTML = reviewHtml;
    document.getElementById("review-section").scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", function () {
    displayDate();
    loadStates();
    loadSavedFormData();
    loadWelcomeMessage();

    document.getElementById("salary").addEventListener("input", function () {
        updateSlider(this.value);
        saveFieldToLocalStorage("salary");
    });

    document.getElementById("fname").addEventListener("input", validateFirstName);
    document.getElementById("mi").addEventListener("input", validateMiddleInitial);
    document.getElementById("lname").addEventListener("input", validateLastName);
    document.getElementById("dob").addEventListener("blur", validateDOB);

    document.getElementById("ssn").addEventListener("input", function () {
        formatSSN();
        validateSSN();
    });

    document.getElementById("email").addEventListener("input", validateEmail);

    document.getElementById("phone").addEventListener("input", function () {
        formatPhone();
        validatePhone();
    });

    document.getElementById("address1").addEventListener("input", validateAddress1);
    document.getElementById("address2").addEventListener("input", validateAddress2);
    document.getElementById("city").addEventListener("input", validateCity);
    document.getElementById("state").addEventListener("change", validateState);
    document.getElementById("zip").addEventListener("input", validateZip);
    document.getElementById("symptoms").addEventListener("input", validateSymptoms);
    document.getElementById("userid").addEventListener("input", validateUserId);
    document.getElementById("password").addEventListener("input", validatePassword);
    document.getElementById("confirmPassword").addEventListener("input", validateConfirmPassword);

    document.querySelectorAll('input[name="history"]').forEach(item => {
        item.addEventListener("change", validateHistory);
    });

    document.querySelectorAll('input[name="gender"]').forEach(item => {
        item.addEventListener("change", validateGender);
    });

    document.querySelectorAll('input[name="vaccinated"]').forEach(item => {
        item.addEventListener("change", validateVaccinated);
    });

    document.querySelectorAll('input[name="insurance"]').forEach(item => {
        item.addEventListener("change", validateInsurance);
    });

    document.getElementById("rememberMe").addEventListener("change", function () {
        if (!this.checked) {
            clearStoredUser();
        } else {
            saveFormData();
            loadWelcomeMessage();
        }
    });

    document.getElementById("validateBtn").addEventListener("click", validateForm);

    document.getElementById("form").addEventListener("submit", function (event) {
        if (!validateForm()) {
            event.preventDefault();
            alert("Please fix the errors before submitting.");
        }
    });
});
