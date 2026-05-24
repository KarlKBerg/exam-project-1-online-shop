import { loadingSpinner, stopLoadingSpinner, displayMessage } from "./utils.js";
let name = "";
let email = "";
let password = "";
let rePassword = "";
async function registerUser() {
  const url = "https://v2.api.noroff.dev/auth/register";

  const newUser = {
    name: name,
    email: email,
    password: password,
  };

  const postData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  };
  loadingSpinner();
  try {
    console.log(newUser);
    const response = await fetch(url, postData);

    if (!response.ok) {
      throw new Error(`Registration failed with status: ` + response.status);
    }

    const result = await response.json();

    displayMessage("Registration successful!", "success");
    setTimeout(() => {
      window.location.href = "../account/login.html";
    }, 2000);
  } catch (error) {
    displayMessage(`Error: ` + error, "error");
  } finally {
    stopLoadingSpinner();
  }
}

function registrationCheck() {
  const emailCheckIcon = document.querySelector("#email-check i");
  const pswCheckMatchIcon = document.querySelector("#psw-check-match i");
  const pswCheckCharIcon = document.querySelector("#psw-check-char i");
  // Email
  if (email.includes("@stud.noroff.no")) {
    emailCheckIcon.classList.add("check-success");
  }
  // Password
  if (password.length >= 8) {
    pswCheckCharIcon.classList.add("check-success");
  }
  if (password === rePassword) {
    pswCheckMatchIcon.classList.add("check-success");
  }
}

const registerBtn = document.querySelector(".register-btn");

registerBtn.addEventListener("click", () => {
  // Check all forms
  name = document.querySelector("#name").value.toLowerCase().trim();
  email = document.querySelector("#email").value.toLowerCase().trim();
  password = document.querySelector("#password").value;
  rePassword = document.querySelector("#re-password").value;
  // Name
  if (name === "") {
    displayMessage("Name can't be empty", "error");
  }
  // Email
  else if (email === "") {
    displayMessage("Email can't be empry", "error");
  } else if (!email.includes("@stud.noroff.no")) {
    displayMessage("Email must contain @stud.noroff.no", "error");
  }
  // Password
  else if (password.length < 8) {
    displayMessage("Password must contain more than 8 characters", "error");
  } else if (password !== rePassword) {
    displayMessage("Passwords don't match", "error");
  } else {
    // Register user
    registerUser();
  }
});

const container = document.querySelector(".field-check");
container.addEventListener("input", () => {
  name = document.querySelector("#name").value.toLowerCase().trim();
  email = document.querySelector("#email").value.toLowerCase().trim();
  password = document.querySelector("#password").value;
  rePassword = document.querySelector("#re-password").value;
  registrationCheck();
});
