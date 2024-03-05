// document.addEventListener('DOMContentLoaded', () => {
//   const exercisesContainer = document.getElementById('log-card-container'); // container for cards

//   if (window.exerciseData && window.exerciseData.length > 0) {
//     window.exerciseData.forEach((exercise) => {
//       const card = document.createElement('div');
//       card.className = 'exercise-card'; // Assuming you have CSS for this class
//       card.innerHTML = `
//         <h3>${exercise.activityName}</h3>
//         <p>Duration: ${exercise.hours} hours, ${exercise.minutes} minutes, ${exercise.seconds} seconds</p>
//         <p>Intensity: ${exercise.intensity}</p>
//       `;

//       exercisesContainer.appendChild(card);
//     });
//   } else {
//     console.log("No exercise data found.");
//   }
// });

$(document).ready(function () {
  // Function to display exercises
  function displayExercises() {
    const data = JSON.parse(localStorage.getItem('exerciseData')) || [];
    const container = $('#log-card-container');
    container.html(''); // Clear existing content

    data.forEach((exercise, index) => {
      const cardHtml = `
<div class="card" id="exercise-${index}">
    <div class="bg-white p-2 rounded-lg shadow-lg w-80vw">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-barbell" width="40" height="40"
            viewBox="0 0 24 24" stroke-width="1.5" stroke="#172d58" fill="none" stroke-linecap="round"
            stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M2 12h1" />
            <path d="M6 8h-2a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h2" />
            <path d="M6 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-10a1 1 0 0 0 -1 -1h-1a1 1 0 0 0 -1 1z" />
            <path d="M9 12h6" />
            <path d="M15 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-10a1 1 0 0 0 -1 -1h-1a1 1 0 0 0 -1 1z" />
            <path d="M18 8h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2" />
            <path d="M22 12h-1" />
          </svg>
        </div>
        <div>
          <div class="text-xl text-black">Activity Name: <span class="font-medium">${exercise.activityName}</span></div>
          <p class="text-black">Date: ${exercise.today}</p>
          <p class="text-black">Duration: Duration: ${exercise.hours} hours, ${exercise.minutes} minutes,
            ${exercise.seconds} seconds</p>
          </p>
          <p class="text-black">Intensity: ${exercise.intensity}</p>
          <p class="text-black">Estimated calorie burnt: </p>
        </div>
      </div>
    </div>
  </div>`;
      container.prepend(cardHtml); // Prepend new card
    });
  }

  // Initially display exercises and whenever new data is added
  displayExercises();
});
