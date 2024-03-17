document.addEventListener("DOMContentLoaded", () => {
  // Reference to buttons
  const homeBtn = document.getElementById("home-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const plusBtn = document.getElementById("plus-btn");
  const userBtn = document.getElementById("user-btn");

  // Event listener for Home button
  homeBtn.addEventListener("click", () => {
    console.log("Redirecting to Home Page...");
    // Code to redirect to Home Page
    window.location.href = "overview.html";
  });

  // Event listener for Settings button
  settingsBtn.addEventListener("click", () => {
    console.log("Opening Settings...");
    // Code to open Settings
    // Example: openSettingsFunction();
  });

  // Event listener for Plus button
  plusBtn.addEventListener("click", () => {
    console.log("Displaying Popup Menu...");
  });

  // Event listener for User button
  userBtn.addEventListener("click", () => {
    console.log("Redirecting to User Settings...");
  });
});
