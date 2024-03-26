document.addEventListener("DOMContentLoaded", () => {
  // Reference to buttons
  const homeBtn = document.getElementById("home-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const plusBtn = document.getElementById("plus-btn");
  const userBtn = document.getElementById("user-btn");
  // Variables for Event listener for Plus button  
  const menu = document.getElementById("menu");
  const menuBg = document.getElementById("menuBackground");
  const closeBtn = document.getElementById("closeMenu");

  // Event listener for Home button
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      console.log("Redirecting to Home Page...");
      // Code to redirect to Home Page
      window.location.href = "../overview.html";
    });
  } else { console.log("Home button not found"); }

  // Event listener for Settings button
  settingsBtn.addEventListener("click", () => {
    console.log("Opening Settings...");
    // Code to open Settings
    // Example: openSettingsFunction();
  });

  // Open menu event
  plusBtn.addEventListener("click", () => {
    menu.classList.remove("hidden");
    menuBg.classList.remove("hidden");
  });

  // Close menu event
  closeBtn.addEventListener("click", () => {
    menu.classList.add("hidden");
    menuBg.classList.add("hidden");
  });

  // Close menu on outside click
  menuBg.addEventListener("click", () => {
    menu.classList.add("hidden");
    menuBg.classList.add("hidden");
  });

  // Event listener for User button
  userBtn.addEventListener("click", () => {
    console.log("Redirecting to User Profile...");
    window.location.href = "../profile.html";
  });
});
