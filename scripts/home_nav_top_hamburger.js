//Select the button and the menu div
const button = document.querySelector('button[data-collapse-toggle="navbar-hamburger"]');
const menu = document.getElementById('navbar-hamburger');

//Add an event listener to the button
button.addEventListener('click', () => {
  //Toggle the 'hidden' class on the menu div
  menu.classList.toggle('hidden');

  //Toggle the aria-expanded attribute to reflect the state change
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', !isExpanded);
});
