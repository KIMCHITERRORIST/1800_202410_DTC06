document.addEventListener('DOMContentLoaded', function () {
  // Initialize all functions that need the DOM to be fully loaded.
  initApp();
});

async function initApp() {
  try {
    const uid = await fetchUID();
    if (uid) {
      // User is logged in, now fetch data
      fetchAndDisplayTodaysFoodEntries();
      fetchAndDisplayTodaysExerciseEntries();
      checkAndUpdateWeight(uid);
      const userData = await fetchUserData(uid); // Fetch user's data including TDEE and goalCalories
      await renderDonutChart(uid, userData.goalCalories); // Pass goalCalories to renderDonutChart
    }
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

async function fetchUserData(uid) {
  const userDoc = await db.collection("users").doc(uid).get();
  if (userDoc.exists) {
    return userDoc.data(); // Return all user data
  } else {
    throw new Error("User data not found");
  }
}

async function renderDonutChart(uid, goalCalories) {
  const { caloriesIn, caloriesOut } = await fetchCaloriesInAndOut(uid);

  const netCalories = Math.round(caloriesIn - caloriesOut);
  const remainingCalories = Math.max(0, Math.round(goalCalories - netCalories));
  let series, colors, caloriesLabelText;

  if (netCalories > goalCalories) {
    colors = ["#FF6347", "#D3D3D3"];
    series = [Math.round(netCalories - goalCalories), 0]; // Exceeding calories
    caloriesLabelText = `${Math.round(netCalories - goalCalories)} Calories Over Goal`; // Displaying rounded exceeded calories
  } else {
    colors = ["#1C64F2", "#D3D3D3"];
    series = [netCalories, remainingCalories];
    caloriesLabelText = `${Math.round(remainingCalories)} Calories to Burn`; // Displaying rounded calories to burn
  }

  const chartOptions = {
    series: series,
    chart: {
      type: 'donut',
      height: 320
    },
    labels: ['Calories to Burn', 'Calories Left'], // Changed labels
    colors: colors,
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '20px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
            },
            total: {
              showAlways: false,
              label: 'Total',
              formatter: function () {
                return caloriesLabelText; // Updated formatter for dynamic label
              }
            }
          }
        }
      }
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
  };

  const chart = new ApexCharts(document.querySelector("#donut-chart"), chartOptions);
  chart.render();
};


// gets calories in and out for the day to do calculations for graph
async function fetchCaloriesInAndOut(uid) {
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  const doc = await db.collection("calories").doc(uid).get();
  if (doc.exists && doc.data()[formattedToday]) {
    return doc.data()[formattedToday];
  } else {
    return { caloriesIn: 0, caloriesOut: 0 }; // Default if no entry for today
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

// Fetch TDEE function for calculations
async function fetchTDEE(uid) {
  const doc = await db.collection("users").doc(uid).get();
  return doc.exists ? doc.data().TDEE : null;
}

// Fetch goal calories function for calculations
async function fetchAndDisplayTodaysFoodEntries() {
  const uid = await fetchUID();
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  const caloriesInCardContent = document.getElementById('caloriesInCardContent');

  db.collection("meals").doc(uid).get().then(doc => {
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
          <div class="py-2 border-b border-gray-200 last:border-b-0 flex justify-between items-center bg-white">
            <div>
              <p class="font-semibold text-blue-600">${foodName}</p>
              <p class="text-sm text-gray-600">Fats: ${entry.fats}g, Carbs: ${entry.carbs}g, Protein: ${entry.protein}g</p>
            </div>
            <p class="font-bold text-xl text-right text-blue-600">${entry.calories} kcal</p>
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
      db.collection('calories').doc(uid).set({
        [formattedToday]: {
          caloriesIn: totalCalories
        }
      }, { merge: true });
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
        exerciseEntryDiv.classList.add('py-2', 'border-b', 'border-gray-200', 'last:border-b-0', 'flex', 'justify-between', 'items-center', 'bg-white');
        exerciseEntryDiv.innerHTML = `
        <div>
          <p class="font-semibold text-green-600">${data.name}</p>
          <p class="text-sm text-gray-600">Duration: ${data.duration.hour || 0}h ${data.duration.minute || 0}m ${data.duration.second || 0}s</p>
          <p class="text-sm text-gray-600">Heart Rate: ${data.heartrate} bpm</p>
        </div>
        <p class="font-bold text-xl text-right text-green-600">${data.caloriesBurned} kcal</p>
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
    db.collection('calories').doc(uid).set({
      [formattedToday]: {
        caloriesOut: totalCaloriesBurned
      }
    }, { merge: true });
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

async function checkAndUpdateWeight(uid) {
  const userDoc = await db.collection("users").doc(uid).get();
  if (userDoc.exists) {
    const userData = userDoc.data();
    if (userData.Date) {
      const lastUpdate = userData.Date.toDate(); // Convert Firestore timestamp to JavaScript Date object
      const today = new Date();
      const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

      if (lastUpdate < oneWeekAgo) {
        // A week has passed since the last update
        showModalToUpdateWeight(); // Implement this function to show your modal
      }
    }
  } else {
    console.error("No user document found or no weight update date available.");
  }
}

function showModalToUpdateWeight() {

  console.log("It's time to update your weight!");
}
