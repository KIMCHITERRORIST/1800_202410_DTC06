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

fetchDataAndDisplayChart();