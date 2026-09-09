/**
 * @fileoverview Login Module
 * Handles password visibility toggling and user authentication.
 */

// Toggle password visibility
const togglePasswordBtn = document.querySelector(".fa-eye");

if (togglePasswordBtn) {
  togglePasswordBtn.addEventListener("click", () => {
    const passwordInput = document.getElementById("password");
    const isPasswordHidden = passwordInput.getAttribute("type") === "password";

    passwordInput.setAttribute("type", isPasswordHidden ? "text" : "password");
    togglePasswordBtn.classList.replace(
      isPasswordHidden ? "fa-eye" : "fa-eye-slash",
      isPasswordHidden ? "fa-eye-slash" : "fa-eye"
    );
  });
}

/**
 * Validates credentials and authenticates user against session store.
 */
function login() {
  const usernameInput = document.getElementById("username").value.trim();
  const passwordInput = document.getElementById("password").value;
  const errorContainer = document.getElementById("msg-error");

  errorContainer.style.display = "none";

  if (!usernameInput || !passwordInput) {
    showErrorMessage("Por favor, preencha usuário e senha.");
    return;
  }

  const registeredUsers = JSON.parse(sessionStorage.getItem("userList") || "[]");
  const authenticatedUser = registeredUsers.find(
    (user) => user.username === usernameInput && user.password === passwordInput
  );

  if (authenticatedUser) {
    sessionStorage.setItem("currentUser", authenticatedUser.username);
    window.location.href = "../index.html";
  } else {
    showErrorMessage("Usuário ou senha incorretos.");
  }
}

/**
 * Displays validation error messages to the UI.
 * @param {string} message 
 */
function showErrorMessage(message) {
  const errorContainer = document.getElementById("msg-error");
  errorContainer.innerHTML = message;
  errorContainer.style.display = "block";
}