document.addEventListener('DOMContentLoaded', () => { // Ensure the DOM is fully loaded
  const intensityButtons = document.querySelectorAll('.intensity-btn');

  intensityButtons.forEach(button => {
    button.addEventListener('click', function () {
      const selectedIntensity = parseInt(this.getAttribute('data-intensity'));

      intensityButtons.forEach((btn, index) => {
        const btnIntensity = parseInt(btn.getAttribute('data-intensity'));
        const icon = btn.querySelector('svg');
        if (icon) {
          // If the button's intensity is less than or equal to the selected, fill it
          icon.style.fill = btnIntensity <= selectedIntensity ? '#2d58b1' : 'none';
        }
      });

      let intensity = selectedIntensity; // Assuming it's updated somewhere in the file

      function getSelectedIntensity() {
        return intensity;
      }

      // Make the getter function global
      window.getSelectedIntensity = getSelectedIntensity;

      // Example: Recording the selected intensity, replace this with your actual implementation
      console.log(`intensity selected`);
      // You could also set this value to a hidden input field or a global variable depending on your needs
    });
  });
});



