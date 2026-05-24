import { loadingSpinner, stopLoadingSpinner, displayMessage } from "./utils.js";
// get email and password from form
let email = "";
let password = "";

const loginBtn = document.querySelector(".login-btn");

async function loginUser() {
  const url = "https://v2.api.noroff.dev/auth/login";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      // Store token
      localStorage.setItem("userToken", data.data.accessToken);
      displayMessage("Logged in!", "success");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 2000);
    } else {
      throw new Error(`Registration failed with status: ` + response.status);
    }
  } catch (error) {
    displayMessage(`Error: ` + error, "error");
  } finally {
    stopLoadingSpinner();
  }
}

loginBtn.addEventListener("click", () => {
  email = document.querySelector("#email").value.toLowerCase().trim();
  password = document.querySelector("#password").value;

  if (email === "" || password === "") {
    displayMessage("Input fields can't be empty!", "error");
    return;
  }
  loginUser();
});
