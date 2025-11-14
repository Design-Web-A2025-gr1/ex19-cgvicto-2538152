// --- Sélection des éléments ---
const form = document.getElementById('form-password');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');
const errorMessage = document.querySelector('.line-confirm-password .message-erreur');
const validationLength = document.querySelector('.validation-longueur');
const validationCase = document.querySelector('.validation-majuscule');
const validationSpecial = document.querySelector('.validation-caractere');
const passwordMeterUnits = document.querySelectorAll('.password-meter-unit');

// --- Regex ---
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

// --- VALIDATION FUNCTIONS ---

function isLengthValid(password) {
    return password.length >= 8;
}

function hasValidCase(password) {
    return /[A-Z]/.test(password) && /[a-z]/.test(password);
}

function hasSpecialCharacter(password) {
    return specialCharRegex.test(password);
}

function isPasswordStrongEnough(password) {
    return zxcvbn(password).score >= 3;
}

function doPasswordsMatch() {
    return passwordInput.value === confirmInput.value;
}

// --- UI FUNCTIONS ---

function updateValidationIcon(element, isValid) {
    var icon = element.querySelector('i');
    var color = element.style.color;

    if (isValid) {
        icon.className = 'fas fa-check';
        color = 'green';
    } else {
        icon.className = 'fas fa-ban';
        color = 'red';
    }

    element.style.color = color;
}

function updateAllValidationIcons() {
    updateValidationIcon(validationLength, isLengthValid(passwordInput.value));
    updateValidationIcon(validationCase, hasValidCase(passwordInput.value));
    updateValidationIcon(validationSpecial, hasSpecialCharacter(passwordInput.value));
}

function updatePasswordMeter() {
    const score = zxcvbn(passwordInput.value).score;
    passwordMeterUnits.forEach((unit, index) => {
        if (index <= score) {
            if (score < 2) {
                unit.style.backgroundColor = 'red';
            } else if (score === 2) {
                unit.style.backgroundColor = 'yellow';
            } else {
                unit.style.backgroundColor = 'green';
            }
        } else {
            unit.style.backgroundColor = '#e0e0e0';
        }
    });
}

function updatePasswordMatchUI() {
    errorMessage.classList.toggle('hidden', doPasswordsMatch());
}

// --- EVENT HANDLERS ---

function handlePasswordInput() {
    updateAllValidationIcons();
    updatePasswordMeter();
    updatePasswordMatchUI();
}

function handleConfirmInput() {
    updatePasswordMatchUI();
}

function handleFormSubmit(e) {
    e.preventDefault(); // prevent submission first

    const password = passwordInput.value;

    // Check all rules
    if (!isLengthValid(password)) {
        alert('Votre mot de passe doit contenir au moins 8 caractères.');
        return;
    }
    if (!hasValidCase(password)) {
        alert('Votre mot de passe doit contenir des majuscules et des minuscules.');
        return;
    }
    if (!hasSpecialCharacter(password)) {
        alert('Votre mot de passe doit contenir au moins un caractère spécial.');
        return;
    }
    if (!isPasswordStrongEnough(password)) {
        alert('Votre mot de passe doit avoir une force minimale de 3.');
        return;
    }
    if (!doPasswordsMatch()) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

    // All checks passed, submit the form
    form.submit();
}

// --- ATTACH EVENTS ---
passwordInput.addEventListener('input', handlePasswordInput);
confirmInput.addEventListener('input', handleConfirmInput);
form.addEventListener('submit', handleFormSubmit);
