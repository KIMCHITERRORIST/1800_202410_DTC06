async function fetchUID() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in, return the UID.
        resolve(user.uid);
      } else {
        // No user is signed in.
        resolve(null);
      }
    }, error => reject(error));
  });
}

async function fetchExerciseData() {
  try {
    const userUID = await fetchUID();
    if (!userUID) {
      console.error("No user is signed in.");
      return; // Exit the function if no user is signed in
    }

    // Use a fixed date for testing purposes
    const today = "2024-03-18";
    const logContainer = document.getElementById('log-card-container');

    const querySnapshot = await db.collection('exercises').doc('5lxfkSZhEJTSWiYRCN08Mz9Bibt2').collection('dailyActivities').doc('2024-03-18').collection('Jogging').orderBy('timestamp', 'desc').limit(5).get();

    if (querySnapshot.empty) {
      console.log("No documents found.");
      return; // Exit the function if no documents are found
    }

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const cardHTML = `
        <div class="bg-white p-2 rounded-lg shadow-lg w-80vw">
          <div class="flex items-center space-x-3">
            ... // Your SVG and other HTML elements here
            <div>
              <div class="text-xl text-black">Activity Name: <span class="font-medium">${data.name}</span></div>
              <p class="text-black">Date: ${today}</p>
              <p class="text-black">Duration: ${data.hour}h ${data.min}m ${data.sec}s</p>
            </div>
          </div>
        </div>
      `;
      // Prepend the new card to the container
      logContainer.insertAdjacentHTML('afterbegin', cardHTML);
    });
  } catch (error) {
    console.error("Error fetching exercise data: ", error);
  }
}

// Call the function to fetch and display exercise data
fetchExerciseData();
