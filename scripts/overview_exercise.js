document.addEventListener('DOMContentLoaded', function () {
  // Initialize all functions that need the DOM to be fully loaded.
  initApp();
});

async function initApp() {
  try {
    // Wait for Firebase Auth to be ready and for a user to be logged in.
    const uid = await fetchUID();
    if (uid) {
      // Firebase Auth is ready and a user is logged in, now fetch data and display charts.
      fetchDataAndDisplayChart();
      fetchAndDisplayTodaysFoodEntries();
      fetchAndDisplayTodaysExerciseEntries()
    }
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

// Fetch UID function remains the same as provided before.
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

fetchDataAndDisplayChart();

function fetchAndDisplayTodaysFoodEntries() {
  const uid = firebase.auth().currentUser.uid;
  const today = new Date().toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD
  const calorieCardContent = document.getElementById('calorieCardContent');

  db.collection("calories").doc(uid).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      let totalCalories = 0;
      let contentHTML = '';

      Object.keys(data).forEach(foodName => {
        const entry = data[foodName];
        // Check if entry date matches today's date
        if (entry.date === today) {
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
        calorieCardContent.innerHTML = contentHTML;
        document.getElementById('cardHeader').querySelector('p').textContent = `You have eaten ${totalCalories} calories today!`;
      } else {
        calorieCardContent.innerHTML = '<p>No food entries found for today.</p>';
      }

      // Make the calorie card content visible
      calorieCardContent.classList.remove('hidden');
    } else {
      console.log("No document found for this UID.");
    }
  }).catch(error => {
    console.error("Error fetching today's food entries:", error);
  });
}

function fetchAndDisplayTodaysExerciseEntries() {
  const uid = firebase.auth().currentUser.uid; // Use the UID of the currently logged-in user
  const today = new Date().toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD
  const exerciseCardContent = document.getElementById('exerciseCardContent');

  // Clear previous content
  exerciseCardContent.innerHTML = '';

  db.collection('exercises').doc(uid).collection('dailyActivities').get().then(querySnapshot => {
    let totalCaloriesBurned = 0;

    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.date === today) {
        totalCaloriesBurned += parseInt(data.caloriesBurned, 10);

        // Create a new div for each exercise entry
        const exerciseEntryDiv = document.createElement('div');
        exerciseEntryDiv.classList.add('py-2'); // Add some padding
        exerciseEntryDiv.innerHTML = `
          <p class="font-semibold">Activity - ${doc.id}</p>
          <p>Calories Burned: ${data.caloriesBurned} kcal</p>
          <p>Duration: ${data.duration.hour || 0}h ${data.duration.minute || 0}m ${data.duration.second || 0}s</p>
          <p>Heart Rate: ${data.heartRate} bpm</p>
        `;

        // Append the new div to the exerciseCardContent
        exerciseCardContent.appendChild(exerciseEntryDiv);
      }
    });

    if (exerciseCardContent.innerHTML !== '') {
      document.getElementById('cardHeaderBurn').querySelector('p').textContent = `You have burned ${totalCaloriesBurned} calories today!`;
      exerciseCardContent.classList.remove('hidden');
    } else {
      exerciseCardContent.innerHTML = '<p>No exercise entries found for today.</p>';
      exerciseCardContent.classList.remove('hidden');
    }
  }).catch(error => {
    console.error("Error fetching today's exercise entries:", error);
  });
}

document.getElementById('cardHeader').addEventListener('click', function () {
  const content = document.getElementById('calorieCardContent');
  const symbol = document.getElementById('toggleSymbol');
  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden'); // Show content
    symbol.textContent = '-'; // Change symbol to '-'
  } else {
    content.classList.add('hidden'); // Hide content
    symbol.textContent = '+'; // Change symbol to '+'
  }
});

document.getElementById('cardHeaderBurn').addEventListener('click', function () {
  const content = document.getElementById('exerciseCardContent');
  const symbol = document.getElementById('toggleSymbolBurn');
  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden'); // Show content
    symbol.textContent = '-'; // Change symbol to '-'
  } else {
    content.classList.add('hidden'); // Hide content
    symbol.textContent = '+'; // Change symbol to '+'
  }
});