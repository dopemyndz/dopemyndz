// ============================================================
// DOPEMYNDZ CUSTOMER PORTAL
// IMPORTANT: Change this number to your WhatsApp number.
// Nigeria example: 2348012345678 (do not include + or spaces).
// ============================================================
const WHATSAPP_NUMBER = "2349034130151";

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const authModal = document.getElementById("authModal");

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const getUsers = () => JSON.parse(localStorage.getItem("dopemyndz_users") || "[]");
const saveUsers = users => localStorage.setItem("dopemyndz_users", JSON.stringify(users));
const getCurrentUser = () => JSON.parse(localStorage.getItem("dopemyndz_current_user") || "null");
const setCurrentUser = user => user
  ? localStorage.setItem("dopemyndz_current_user", JSON.stringify(user))
  : localStorage.removeItem("dopemyndz_current_user");

function openWhatsApp(service = "") {
  if (WHATSAPP_NUMBER.includes("X")) {
    alert("Please add your WhatsApp number in script.js first. Replace 2349034130151 with your real WhatsApp number.");
    return;
  }
  const user = getCurrentUser();
  const name = user?.name || "Customer";
  const email = user?.email || "";
  const text = `Hello Dopemyndz, my name is ${name}.${email ? ` My email is ${email}.` : ""}${service ? ` I am interested in ${service}.` : ""} I would like to discuss a project.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}

function showAuthModal(tab = "signup") {
  authModal.classList.add("open");
  authModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  switchModalTab(tab);
}

function closeAuthModal() {
  authModal.classList.remove("open");
  authModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function switchModalTab(tab) {
  document.querySelectorAll(".modal-tab").forEach(b => b.classList.toggle("active", b.dataset.modalTab === tab));
  document.getElementById("modalSignupForm").classList.toggle("hidden", tab !== "signup");
  document.getElementById("modalLoginForm").classList.toggle("hidden", tab !== "login");
}

function showPageAuthTab(tab) {
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.getElementById("signupForm").classList.toggle("hidden", tab !== "signup");
  document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
}

document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeAuthModal));
document.querySelectorAll("[data-modal-tab]").forEach(el => el.addEventListener("click", () => switchModalTab(el.dataset.modalTab)));
document.querySelectorAll("[data-tab]").forEach(el => el.addEventListener("click", () => showPageAuthTab(el.dataset.tab)));

document.getElementById("openAuth")?.addEventListener("click", () => showAuthModal("signup"));
document.getElementById("heroAccount")?.addEventListener("click", () => {
  document.getElementById("account").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("ctaAccount")?.addEventListener("click", () => showAuthModal("signup"));
document.getElementById("ctaWhatsApp")?.addEventListener("click", () => {
  const user = getCurrentUser();
  user ? openWhatsApp() : showAuthModal("signup");
});
document.getElementById("floatingWhatsApp")?.addEventListener("click", () => {
  const user = getCurrentUser();
  user ? openWhatsApp() : showAuthModal("signup");
});

document.querySelectorAll(".service-link").forEach(btn => {
  btn.addEventListener("click", () => {
    const user = getCurrentUser();
    if (!user) {
      showAuthModal("signup");
      return;
    }
    openWhatsApp(btn.dataset.service);
  });
});

function setMessage(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function createAccount(name, email, password, messageId, onSuccess) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some(u => u.email === normalizedEmail)) {
    setMessage(messageId, "An account with this email already exists. Please log in.");
    return;
  }
  const user = { name: name.trim(), email: normalizedEmail, password };
  users.push(user);
  saveUsers(users);
  setCurrentUser({ name: user.name, email: user.email });
  setMessage(messageId, "Account created successfully.");
  if (onSuccess) onSuccess(user);
}

function login(email, password, messageId, onSuccess) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getUsers().find(u => u.email === normalizedEmail && u.password === password);
  if (!user) {
    setMessage(messageId, "Incorrect email or password.");
    return;
  }
  const safeUser = { name: user.name, email: user.email };
  setCurrentUser(safeUser);
  setMessage(messageId, "Login successful.");
  if (onSuccess) onSuccess(safeUser);
}

document.getElementById("signupForm")?.addEventListener("submit", e => {
  e.preventDefault();
  createAccount(
    document.getElementById("signupName").value,
    document.getElementById("signupEmail").value,
    document.getElementById("signupPassword").value,
    "signupMessage",
    () => updateCustomerUI()
  );
});

document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  login(
    document.getElementById("loginEmail").value,
    document.getElementById("loginPassword").value,
    "loginMessage",
    () => updateCustomerUI()
  );
});

document.getElementById("modalSignupForm")?.addEventListener("submit", e => {
  e.preventDefault();
  createAccount(
    document.getElementById("modalSignupName").value,
    document.getElementById("modalSignupEmail").value,
    document.getElementById("modalSignupPassword").value,
    "modalSignupMessage",
    () => {
      closeAuthModal();
      updateCustomerUI();
    }
  );
});

document.getElementById("modalLoginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  login(
    document.getElementById("modalLoginEmail").value,
    document.getElementById("modalLoginPassword").value,
    "modalLoginMessage",
    () => {
      closeAuthModal();
      updateCustomerUI();
    }
  );
});

function updateCustomerUI() {
  const user = getCurrentUser();
  const loggedOut = document.getElementById("loggedOutView");
  const loggedIn = document.getElementById("loggedInView");
  const nameEl = document.getElementById("customerName");

  if (user) {
    loggedOut.classList.add("hidden");
    loggedIn.classList.remove("hidden");
    nameEl.textContent = user.name;
  } else {
    loggedOut.classList.remove("hidden");
    loggedIn.classList.add("hidden");
  }
}

document.getElementById("whatsappButton")?.addEventListener("click", () => openWhatsApp());
document.getElementById("logoutButton")?.addEventListener("click", () => {
  setCurrentUser(null);
  updateCustomerUI();
  showPageAuthTab("login");
});

document.getElementById("year").textContent = new Date().getFullYear();
updateCustomerUI();
