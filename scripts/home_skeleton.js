//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {
  $('#navbarPlaceholder').load('./navbars/home_nav_top.html', function () {
    console.log('Navbar loaded');
    //Select the button and the menu div
    let button = document.querySelector('button[data-collapse-toggle="navbar-hamburger"]');
    let menu = document.getElementById('navbar-hamburger');

    //Add an event listener to the button
    button.addEventListener('click', () => {
      //Toggle the 'hidden' class on the menu div
      menu.classList.toggle('hidden');

      //Toggle the aria-expanded attribute to reflect the state change
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
    });

  });
  $('#footerPlaceholder').load('./navbars/home_nav_bottom.html', function () {
    console.log('Footer loaded');
    // Event listners for bottom nav
    // Reference to buttons
    const plusBtn = document.getElementById("plus-btn");
    const userBtn = document.getElementById("user-btn");
    const menu = document.getElementById("menu");
    const menuBg = document.getElementById("menuBackground");
    const closeBtn = document.getElementById("closeMenu");

    // Open menu
    plusBtn.addEventListener("click", () => {
      menu.classList.remove("hidden");
      menuBg.classList.remove("hidden");
    });

    // Close menu 
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
}
loadSkeleton();