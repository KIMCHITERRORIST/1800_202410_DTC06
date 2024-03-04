document.addEventListener("DOMContentLoaded", () => {
  const hrValueElement = document.querySelector("#caret-up-hr").nextElementSibling;
  const minValueElement = document.querySelector("#caret-up-min").nextElementSibling;
  const secValueElement = document.querySelector("#caret-up-sec").nextElementSibling;

  function adjustTime(element, max, isIncrement) {
    let currentValue = parseInt(element.textContent, 10);
    if (isIncrement) {
      currentValue = currentValue + 1 > max ? 0 : currentValue + 1;
    } else {
      currentValue = currentValue - 1 < 0 ? max : currentValue - 1;
    }
    element.textContent = currentValue;
  }

  // Event listeners for hour adjustments
  document.querySelector("#caret-up-hr").addEventListener("click", () => adjustTime(hrValueElement, 12, true));
  document.querySelector("#caret-down-hr").addEventListener("click", () => adjustTime(hrValueElement, 12, false));

  // Event listeners for minute adjustments
  document.querySelector("#caret-up-min").addEventListener("click", () => adjustTime(minValueElement, 59, true));
  document.querySelector("#caret-down-min").addEventListener("click", () => adjustTime(minValueElement, 59, false));

  // Event listeners for second adjustments
  document.querySelector("#caret-up-sec").addEventListener("click", () => adjustTime(secValueElement, 59, true));
  document.querySelector("#caret-down-sec").addEventListener("click", () => adjustTime(secValueElement, 59, false));
});
