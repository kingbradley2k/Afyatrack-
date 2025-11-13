// auth.js
const API = "http://localhost:4000/api"; // adjust if backend runs on another port

// ==================== REGISTER USER ====================
async function registerUser(e) {
  e.preventDefault();

  // Collect data from form inputs
  const full_name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("reg-confirm-password").value;
  const role = document.getElementById("reg-role").value;

  // Validation
  if (!full_name || !email || !password || !confirmPassword || !role) {
    alert("⚠️ Please fill in all required fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("⚠️ Passwords do not match.");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      // Store token + user details locally
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("✅ Registration successful!");
      window.location.href = "/dashboard.html";
    } else {
      alert(`❌ ${data.error || "Registration failed."}`);
    }
  } catch (err) {
    console.error("Error registering user:", err);
    alert("❌ Server or network error. Please try again.");
  }
}

// ==================== LOGIN USER ====================
async function loginUser(e) {
  e.preventDefault();

  const identifier = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!identifier || !password) {
    alert("⚠️ Please fill in both email/phone and password.");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("✅ Login successful!");
      window.location.href = "/dashboard.html";
    } else {
      alert(`❌ ${data.error || "Login failed. Check your credentials."}`);
    }
  } catch (err) {
    console.error("Error logging in:", err);
    alert("❌ Server or network error. Please try again.");
  }
}

// ==================== EVENT LISTENERS ====================
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("#register");
  const loginForm = document.querySelector("#login");

  if (registerForm) registerForm.addEventListener("submit", registerUser);
  if (loginForm) loginForm.addEventListener("submit", loginUser);
});
