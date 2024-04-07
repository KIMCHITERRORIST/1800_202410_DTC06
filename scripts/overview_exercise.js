document.addEventListener('DOMContentLoaded', function () {
  // Initialize all functions that need the DOM to be fully loaded.
  initApp();
});

async function initApp() {
  try {
    const uid = await fetchUID();
    if (uid) {
      // User is logged in, now fetch data
      fetchDataAndDisplayChart();
      fetchAndDisplayTodaysFoodEntries();
      fetchAndDisplayTodaysExerciseEntries();
      const TDEE = await fetchTDEE(uid); // Fetch user's TDEE
      const goalCalories = TDEE - 500; // Calculate goal calories
      await renderDonutChart(uid, goalCalories); // Render the donut chart
    }
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

async function renderDonutChart(uid, goalCalories) {
  const { caloriesIn, caloriesOut } = await fetchCaloriesInAndOut(uid); // Fetch today's calories in and out
  const remainingCalories = Math.max(0, goalCalories - caloriesIn); // Calculate remaining calories, ensure it's not negative

  // Prepare chart options
  const chartOptions = {
    series: [caloriesIn, remainingCalories],
    labels: ['Calories In', 'Calories Remaining'],
    colors: ["#1C64F2", "#FDBA8C"], // Custom colors: Calories In and Calories Remaining
    chart: {
      type: 'donut',
      height: 320,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              label: 'Total',
              formatter: () => `${goalCalories - remainingCalories} of ${goalCalories}`
            }
          }
        }
      }
    },
    legend: {
      position: "bottom",
    },
    // Include other chart configurations as needed
  };

  // Render the chart
  const chart = new ApexCharts(document.getElementById("donut-chart"), chartOptions);
  chart.render();
}

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

async function fetchTDEE(uid) {
  const doc = await db.collection("users").doc(uid).get();
  return doc.exists ? doc.data().TDEE : null;
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
          <div class="py-2 border-b border-gray-200 last:border-b-0 flex justify-between items-center rounded-lg bg-white shadow">
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
        exerciseEntryDiv.classList.add('py-2', 'border-b', 'border-gray-200', 'last:border-b-0', 'flex', 'justify-between', 'items-center', 'rounded-lg', 'bg-white', 'shadow');
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
