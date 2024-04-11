document.addEventListener('DOMContentLoaded', function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in, fetch user ID and run other functions
      fetchAndDisplayUserActivities();

      document.getElementById('saveExerciseChanges').addEventListener('click', (event) => {
        event.preventDefault();
        saveActivityChanges();
      });

      document.getElementById('deleteExercise').addEventListener('click', (event) => {
        event.preventDefault();
        deleteActivity();
      });
    } else {
      // No user is signed in. Redirect to login page
      window.location.href = 'login.html';
    }
  });
});

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

// Function to fetch and display user activities
async function fetchAndDisplayUserActivities() {
  uid = await fetchUID();
  console.log("User UID:", uid);
  try {
    // Reference to the user's daily activities collection
    const dailyActivitiesRef = db.collection("exercises").doc(uid).collection("dailyActivities");

    // Fetch all activity documents for the user
    const snapshot = await dailyActivitiesRef.get();

    if (snapshot.empty) {
      document.getElementById("exercise-card-container").innerHTML = "<p class='text-center text-xl text-gray-500'>No activities found.</p>";
    }

    // Iterate over each activity document
    let activities = [];
    snapshot.forEach(doc => {
      const activity = doc.data();
      activity.id = doc.id;  // Save the document auto-generated ID for later use
      activity.dateTime = activity.date + " " + activity.time; // Combine date and time for sorting
      activities.push(activity);
    });

    // Sort the activities by date and time
    sortedDateTimeActivities = activities.sort((a, b) => {
      if (b.dateTime > a.dateTime) {
        return -1;
      } else if (a.dateTime > b.dateTime) {
        return 1;
      } else {
        return 0;
      }
    });

    // Display the activities on the page
    const exerciseCardContainer = document.getElementById("exercise-card-container");
    sortedDateTimeActivities.forEach(activity => {
      const { id, date, name, time, caloriesBurned, duration, heartrate } = activity;
      const { hour, minute, second } = activity.duration;

      exerciseCard = `
<div class="bg-white p-4 rounded-lg shadow-lg w-full" data-id="${id}" onclick="openEditModal('${id}')">
  <div class="flex items-center">
    <div class="flex container space-x-10">
      <div class="flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler   icon-tabler-barbell" width="40" height="40"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="#172d58" fill="none" stroke-linecap="round"
          stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M2 12h1" />
          <path d="M6 8h-2a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h2" />
          <path d="M6 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-10a1 1 0 0 0   -1 -1h-1a1 1 0 0 0 -1 1z" />
          <path d="M9 12h6" />
          <path d="M15 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-10a1 1 0 0  0 -1 -1h-1a1 1 0 0 0 -1 1z" />
          <path d="M18 8h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2" />
          <path d="M22 12h-1" />
        </svg>
      </div>
      <div>
        <div class="text-xl text-black font-medium">Activity Name:<span class="font-normal"> ${name}</span></div>
        <p class="text-black font-medium">Heart Rate: <span class="font-normal">${heartrate}</span></p>
        <p class="text-black font-medium">Date: <span class="font-normal">${date}</span></p>
        <p class="text-black font-medium">Time: <span class="font-normal">${time}</span></p>
        <p class="text-black font-medium">Duration: <span class="font-normal">${hour}h ${minute}m ${second}s</span></p>
      </div>
    </div>
    <div class="flex flex-col text-center items-center justify-end">
      <p class="text-black text-lg font-bold">Burnt</p>
      <div>
        <p class="text-black text-lg font-medium"><span class="font-normal">${caloriesBurned}</span></p>
        <img src="/images/kcal_icon.svg" alt="Calories Icon" class="w-10 h-10">
      </div>
    </div>
  </div>
</div>
</div>`;

      // Append the activity card to the container
      exerciseCardContainer.insertAdjacentHTML("afterbegin", exerciseCard);
    });
  } catch (error) {
    console.error("Error fetching user activities:", error);
  }
}


// open the modal to edit an activity
async function openEditModal(activityId) {
  uid = await fetchUID();

  const activityRef = db.collection("exercises").doc(uid).collection("dailyActivities").doc(activityId);
  activityRef.get().then(doc => {
    if (doc.exists) {
      const activity = doc.data();
      document.getElementById('editActivityId').value = activityId;
      document.getElementById('editExerciseName').value = activity.name;
      document.getElementById('editHeartRate').value = activity.heartrate;
      document.getElementById('editCaloriesBurned').value = activity.caloriesBurned;

      // Format and set the duration in the modal
      const duration = activity.duration;
      const formattedDuration = `${duration.hour.toString().padStart(2, '0')}:${duration.minute.toString().padStart(2,
        '0')}:${duration.second.toString().padStart(2, '0')}`;
      document.getElementById('editExerciseDuration').value = formattedDuration;

      document.getElementById('editExerciseModal').classList.remove('hidden');
    } else {
      console.log("No such document!");
    }
  }).catch(error => {
    console.error("Error getting document:", error);
  });
}

// Function to save changes to the activity
async function saveActivityChanges() {
  uid = await fetchUID();
  const activityId = document.getElementById('editActivityId').value;
  const newName = document.getElementById('editExerciseName').value;
  const newHeartRate = document.getElementById('editHeartRate').value;

  // Get the new duration values
  const newDuration = document.getElementById('editExerciseDuration').value;
  const [newHour, newMinute, newSecond] = newDuration.split(':').map(Number);

  // Get the new calories burned value
  const newCaloriesBurned = document.getElementById('editCaloriesBurned').value;

  // Reference to the specific activity document
  const activityRef = db.collection("exercises").doc(uid).collection("dailyActivities").doc(activityId);

  // Update the activity document with the new values
  await activityRef.update({
    name: newName,
    heartrate: newHeartRate,
    duration: {
      hour: newHour,
      minute: newMinute,
      second: newSecond
    },
    caloriesBurned: parseInt(newCaloriesBurned, 10) // Ensure this is saved as a number
  });

  // After saving the changes, hide the modal and possibly refresh the data shown on the page
  document.getElementById('editExerciseModal').classList.add('hidden');
  window.location.reload(); // Refresh the page to show the updated list of activities
}



// Function to delete an activity
async function deleteActivity() {
  uid = await fetchUID();

  const activityId = document.getElementById('editActivityId').value;

  const activityRef = db.collection("exercises").doc(uid).collection("dailyActivities").doc(activityId);
  await activityRef.delete(); // Delete the activity document

  document.getElementById('editExerciseModal').classList.add('hidden');
  window.location.reload();
}

document.getElementById('closeModal').addEventListener('click', function () {
  document.getElementById('editExerciseModal').classList.add('hidden');
});
