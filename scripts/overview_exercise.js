document.addEventListener('DOMContentLoaded', function () {
  // Initialize all functions that need the DOM to be fully loaded.
  initApp();
});

async function initApp() {
  try {
    const uid = await fetchUID();
    if (uid) {
      // User is logged in, now fetch data and display charts.
      fetchDataAndDisplayChart();
      fetchAndDisplayTodaysFoodEntries();
      fetchAndDisplayTodaysExerciseEntries()
    }
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

// Fetch UID function 
async function fetchUID() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        resolve(user.uid);
      } else {
        reject('User is not logged in.');
      }
    });
  });
}

async function fetchDataAndDisplayChart() {
  try {
    const uid = await fetchUID();

    // Get a reference to the dailyActivities collection
    var activitiesRef = db.collection('exercises').doc(uid).collection('dailyActivities');
    var today = new Date();
    var formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;


    // Data arrays for the chart
    var caloriesBurned = [];
    var times = [];

    // Fetch data from Firebase
    const activitiesSnapshot = await activitiesRef.get();
    activitiesSnapshot.forEach(doc => {
      var data = doc.data();
      if (formattedToday === data.date) {
        caloriesBurned.push(Number(data.caloriesBurned));
        times.push(data.time);
      }
    });
    times.sort()

    // Chart configuration
    var chartConfig = {
      type: 'line',
      data: {
        labels: times,
        datasets: [{
          label: 'Calories Burned Today',
          data: caloriesBurned,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Calories Burned'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            },
          },
        }
      }
    }
    // Initialize the chart
    var dailyCalorieBurntChart = document.getElementById('dailyCalorieBurntChart').getContext('2d');
    var lineChart = new Chart(dailyCalorieBurntChart, chartConfig)
  } catch (error) {
    console.error("Error fetching data:", error)
  }
};

async function fetchAndDisplayTodaysFoodEntries() {
  const uid = await fetchUID();
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  const caloriesInCardContent = document.getElementById('caloriesInCardContent');

  db.collection("calories").doc(uid).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      let totalCalories = 0;
      let contentHTML = '';

      Object.keys(data).forEach(foodName => {
        const entry = data[foodName];
        // Check if entry date matches today's date
        if (entry.date === formattedToday) {
          totalCalories += parseInt(entry.calories, 10); // Update total calories
          // Create HTML content for each food entry
          contentHTML += `
            <div class="py-2">
              <p class="font-semibold">${foodName} - ${entry.calories} kcal</p>
              <p>Fats: ${entry.fats}g, Carbs: ${entry.carbs}g, Protein: ${entry.protein}g</p>
            </div>
          `;
        }
      });

      // Check if contentHTML is not empty, then update the DOM
      if (contentHTML !== '') {
        caloriesInCardContent.innerHTML = contentHTML;
        document.getElementById('cardHeaderCaloriesIn').querySelector('p').textContent = `You have eaten ${totalCalories} calories today!`;
      } else {
        document.getElementById('cardHeaderCaloriesIn').querySelector('p').textContent = 'No food entries found for today.';
      }
    } else {
      console.log("No document found for this UID.");
    }
  }).catch(error => {
    console.error("Error fetching today's food entries:", error);
  });
}

async function fetchAndDisplayTodaysExerciseEntries() {
  const uid = await fetchUID(); // Use the UID of the currently logged-in user
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  const caloriesBurntCardContent = document.getElementById('caloriesBurntCardContent');

  // Clear previous content
  caloriesBurntCardContent.innerHTML = '';

  db.collection('exercises').doc(uid).collection('dailyActivities').get().then(querySnapshot => {
    let totalCaloriesBurned = 0;

    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.date === formattedToday) {
        totalCaloriesBurned += parseInt(data.caloriesBurned, 10);

        // Create a new div for each exercise entry
        const exerciseEntryDiv = document.createElement('div');
        exerciseEntryDiv.classList.add('py-2'); // Add some padding
        exerciseEntryDiv.innerHTML = `
          <p class="font-semibold">Activity - ${data.name}</p>
          <p>Calories Burned: ${data.caloriesBurned} kcal</p>
          <p>Duration: ${data.duration.hour || 0}h ${data.duration.minute || 0}m ${data.duration.second || 0}s</p>
          <p>Heart Rate: ${data.heartrate} bpm</p>
        `;

        // Append the new div to the exerciseCardContent
        caloriesBurntCardContent.appendChild(exerciseEntryDiv);
      }
    });

    if (caloriesBurntCardContent.innerHTML !== '') {
      document.getElementById('cardHeaderCaloriesBurnt').querySelector('p').textContent = `You have burned ${totalCaloriesBurned} calories today!`;
    } else {
      document.getElementById('cardHeaderCaloriesBurnt').querySelector('p').textContent = 'No exercise entries found for today.';
    }
  }).catch(error => {
    console.error("Error fetching today's exercise entries:", error);
  });
}

document.getElementById('cardHeaderCaloriesIn').addEventListener('click', function () {
  const contentsCaloriesIn = document.getElementById('caloriesInCardContent');
  const chevronCaloriesIn = document.getElementById('toggleChevronDownSymbolCaloriesIn');
  if (contentsCaloriesIn.classList.contains('hidden')) {
    contentsCaloriesIn.classList.remove('hidden'); // Show content
    chevronCaloriesIn.innerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-chevron-up" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2d58b1" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
  <path d="M9 13l3 -3l3 3" />
</svg>`;

  } else {
    contentsCaloriesIn.classList.add('hidden'); // Hide content
    chevronCaloriesIn.innerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-chevron-down" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2d58b1" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M15 11l-3 3l-3 -3" />
  <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
</svg>`;
  }
});

document.getElementById('cardHeaderCaloriesBurnt').addEventListener('click', function () {
  const contentsCaloriesBurnt = document.getElementById('caloriesBurntCardContent');
  const chevronCaloriesOut = document.getElementById('toggleChevronDownSymbolCaloriesBurnt');
  if (contentsCaloriesBurnt.classList.contains('hidden')) {
    contentsCaloriesBurnt.classList.remove('hidden'); // Show content
    chevronCaloriesOut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-chevron-up" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2d58b1" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
  <path d="M9 13l3 -3l3 3" />
</svg>`;
  } else {
    contentsCaloriesBurnt.classList.add('hidden'); // Hide content
    chevronCaloriesOut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-chevron-down" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2d58b1" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M15 11l-3 3l-3 -3" />
  <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
</svg>`;
  }
});