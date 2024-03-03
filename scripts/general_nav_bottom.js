document.addEventListener('DOMContentLoaded', () => {
  // Function to show the tooltip
  const showTooltip = (tooltipId) => {
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
      tooltip.classList.remove('invisible', 'opacity-0');
      tooltip.classList.add('visible', 'opacity-100');
    }
  };

  // Function to hide the tooltip
  const hideTooltip = (tooltipId) => {
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
      tooltip.classList.remove('visible', 'opacity-100');
      tooltip.classList.add('invisible', 'opacity-0');
    }
  };

  // Attach event listeners to buttons
  const buttons = document.querySelectorAll('button[data-tooltip-target]');
  buttons.forEach(button => {
    const tooltipId = button.getAttribute('data-tooltip-target');

    // Mouse events
    button.addEventListener('mouseenter', () => showTooltip(tooltipId));
    button.addEventListener('mouseleave', () => hideTooltip(tooltipId));

    // Focus events
    button.addEventListener('focus', () => showTooltip(tooltipId));
    button.addEventListener('blur', () => hideTooltip(tooltipId));
  });
});
