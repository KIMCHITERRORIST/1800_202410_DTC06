document.addEventListener('DOMContentLoaded', function () {
  // Ensures the user is authenticated before fetching and displaying entries.
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // If the user is signed in, fetch and display their food entries.
      fetchAndDisplayFoodEntries();
    } else {
      // If no user is signed in, handle accordingly (e.g., redirect to login page).
      console.log('User is not signed in.');
      // Optional: Redirect to login or another appropriate page
      window.location.href = 'login.html';
    }
  });
});

function fetchAndDisplayFoodEntries() {
  const uid = firebase.auth().currentUser.uid; // Assuming you have the user's UID
  const foodCardContainer = document.getElementById('food-card-container');

  db.collection("meals").doc(uid).get().then(doc => {
    if (doc.exists) {
      const foodEntries = doc.data();
      const foodEntriesList = Object.entries(foodEntries).map(([recipeName, details]) => ({
        recipeName,
        ...details,
        dateTime: `${details.date} ${details.time}`
      }));

      const sortedDateTimeMealEntries = foodEntriesList.sort((a, b) => {
        if (b.dateTime > a.dateTime) {
          return 1;
        } else if (a.dateTime > b.dateTime) {
          return -1;
        } else {
          return 0;
        }
      });

      sortedDateTimeMealEntries.forEach(entry => {
        const { recipeName, date, time, fats, carbs, protein, calories } = entry;
        const foodCard = `
<div class="bg-white p-4 rounded-lg shadow-lg w-full flex justify-between items-center">
  <div class="flex space-x-4 items-center">
    <!-- Food Icon -->
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-meat" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2d58b1" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M13.62 8.382l1.966 -1.967a2 2 0 1 1 3.414 -1.415a2 2 0 1 1 -1.413 3.414l-1.82 1.821"/>
      <path d="M5.904 18.596c2.733 2.734 5.9 4 7.07 2.829c1.172 -1.172 -.094 -4.338 -2.828 -7.071c-2.733 -2.734 -5.9 -4 -7.07 -2.829c-1.172 1.172 .094 4.338 2.828 7.071z"/>
      <path d="M7.5 16l1 1"/>
      <path d="M12.975 21.425c3.905 -3.906 4.855 -9.288 2.121 -12.021c-2.733 -2.734 -8.115 -1.784 -12.02 2.121"/>
    </svg>
    
    <!-- Nutrition Information -->
    <div class="ml-4">
      <div><span class="text-xl text-black font-medium">${recipeName}</span></div>
      <p class="text-black font-medium">Date: <span class="font-normal">${date}</span></p>
      <p class="text-black font-medium">Time: <span class="font-normal">${time}</span></p>
      <p class="text-black font-medium">Fats: <span class="font-normal">${fats} g</span></p>
      <p class="text-black font-medium">Carbs: <span class="font-normal">${carbs} g</span></p>
      <p class="text-black font-medium">Protein: <span class="font-normal">${protein} g</span></p>
    </div>
  </div>
  
  <!-- Calorie Information -->
  <div class="flex-col text-center">
    <p class="text-black text-xl font-normal">${calories} kcal</p>
    <img src="/images/cal_in icon.svg" alt="Calories in Icon" class="w-10 h-10">
  </div>
</div>
`;
        foodCardContainer.insertAdjacentHTML("beforeend", foodCard);
      });
    } else {
      foodCardContainer.innerHTML = "<p>No food entries found.</p>";
    }
  }).catch(error => {
    console.error("Error fetching food entries:", error);
  });
}
