async function fetchAndDisplayUserActivities() {
  userUID = await fetchUID();
  console.log("User UID:", userUID);
  try {
    // Reference to the user's daily activities collection
    const dailyActivitiesRef = db.collection("exercises").doc(userUID).collection("dailyActivities");

    // Fetch all activity documents for the user
    const snapshot = await dailyActivitiesRef.get();

    if (snapshot.empty) {
      console.log("No activities found.");
      return;
    }

    // Iterate over each activity document
    activities = [];
    snapshot.forEach(doc => {
      const activity = doc.data();
      activity.dateTime = activity.date + " " + activity.time;
      activities.push(activity);
    });

    sortedDateTimeActivities = activities.sort((a, b) => {
      if (b.dateTime > a.dateTime) {
        return -1;
      } else if (a.dateTime > b.dateTime) {
        return 1;
      } else {
        return 0;
      }
    });

    const exerciseCardContainer = document.getElementById("exercise-card-container");
    sortedDateTimeActivities.forEach(activity => {
      const { date, name, time, caloriesBurned } = activity;
      const { hour, minute, second } = activity.duration;


      // Generate HTML for each activity
      exerciseCard = `
        <div class="bg-white p-4 rounded-lg shadow-lg w-full">
              <div class="flex items-center">
                <div class="flex container space-x-10">
                  <div class="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler   icon-tabler-barbell" width="40" height="40"
                      viewBox="0 0 24 24" stroke-width="1.5" stroke="#172d58"   fill="none" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M2 12h1"/>
                      <path d="M6 8h-2a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h2"/>
                      <path d="M6 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-10a1 1 0 0 0   -1 -1h-1a1 1 0 0 0 -1 1z"/>
                      <path d="M9 12h6"/>
                      <path d="M15 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-10a1 1 0 0  0 -1 -1h-1a1 1 0 0 0 -1 1z"/>
                      <path d="M18 8h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2"/>
                      <path d="M22 12h-1"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-xl text-black font-medium">Activity Name:<span class= "font-normal"> ${name}</span></div>
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
fetchAndDisplayUserActivities();


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

