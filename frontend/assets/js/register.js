/**
 * @fileoverview Registration Module
 * Handles new user account creation and password visibility toggles.
 */

const togglePassBtn = document.getElementById("viewPassword");
const toggleConfirmPassBtn = document.getElementById("viewConfirmPassword");

if (togglePassBtn) {
  togglePassBtn.addEventListener("click", () => toggleVisibility("password", togglePassBtn));
}

if (toggleConfirmPassBtn) {
  toggleConfirmPassBtn.addEventListener("click", () => toggleVisibility("confirm-password", toggleConfirmPassBtn));
}

/**
 * Utility function to toggle password field visibility.
 * @param {string} inputId 
 * @param {HTMLElement} buttonElement 
 */
function toggleVisibility(inputId, buttonElement) {
  const inputField = document.getElementById(inputId);
  const isHidden = inputField.getAttribute("type") === "password";

  inputField.setAttribute("type", isHidden ? "text" : "password");
  buttonElement.classList.replace(
    isHidden ? "fa-eye" : "fa-eye-slash",
    isHidden ? "fa-eye-slash" : "fa-eye"
  );
}

/**
 * Validates registration form inputs and saves new user data.
 */
function register() {
  const fullName = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const errorContainer = document.getElementById("msg-error");

  errorContainer.style.display = "none";

  if (!fullName) {
    showErrorMessage("Por favor, preencha o Nome Completo.");
    return;
  }

  if (!username) {
    showErrorMessage("Por favor, preencha o Usuário.");
    return;
  }

  if (!password) {
    showErrorMessage("Por favor, crie uma Senha.");
    return;
  }

  if (password !== confirmPassword) {
    showErrorMessage("As senhas não conferem.");
    return;
  }

  const userList = JSON.parse(sessionStorage.getItem("userList") || "[]");
  const isUsernameTaken = userList.some((user) => user.username === username);

  if (isUsernameTaken) {
    showErrorMessage("Esse nome de usuário já está em uso!");
    return;
  }

  userList.push({ name: fullName, username, password });
  sessionStorage.setItem("userList", JSON.stringify(userList));

  window.location.href = "login.html";
}

/**
 * Displays error messages to the UI.
 * @param {string} message 
 */
function showErrorMessage(message) {
  const errorContainer = document.getElementById("msg-error");
  errorContainer.innerHTML = message;
  errorContainer.style.display = "block";
}