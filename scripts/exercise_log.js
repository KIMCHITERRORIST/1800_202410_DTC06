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

    const exerciseCardContainer = document.getElementById("exercise-card-container");

    // Iterate over each activity document
    snapshot.forEach(doc => {
      const activity = doc.data();
      const { date, name, time } = activity;
      const { hour, minute, second } = activity.duration; // Assuming duration is a map/object

      // Generate HTML for each activity
      exerciseCardContainer.innerHTML += `
        <div class="bg-white p-4 rounded-lg shadow-lg w-full">
              <div class="flex items-center space-x-10">
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
                  <div class="text-xl text-black">Activity Name: <span  class="font-medium">${name}</span></div>
                  <p class="text-black">Date: ${date}</p>
                  <p class="text-black">Time: ${time}</p>
                  <p class="text-black">Duration: ${hour}h ${minute}m ${second}  s</p>
              </div>
            </div>`;
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

