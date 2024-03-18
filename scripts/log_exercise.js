async function fetchUID() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in, return the UID.
        resolve(user.uid);
      } else {
        // No user is signed in, return null or handle accordingly.
        resolve(null);
      }
    }, error => reject(error));
  });
}

async function fetchExerciseData() {
  const userUID = await fetchUID();
  const today = new Date().toISOString().split('T')[0]; // Format: yyyy-mm-dd
  const logContainer = document.getElementById('log-card-container');

  db.collection('exercises').doc(userUID).collection('dailyActivities').doc(today).collection('time')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        const cardHTML = `
          <div class="bg-white p-2 rounded-lg shadow-lg w-80vw">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-barbell" width="40" height="40"
                  viewBox="0 0 24 24" stroke-width="1.5" stroke="#172d58" fill="none" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M2 12h1"/>
                  <path d="M6 8h-2a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h2"/>
                  <path d="M6 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-10a1 1 0 0 0 -1 -1h-1a1 1 0 0 0 -1 1z"/>
                  <path d="M9 12h6"/>
                  <path d="M15 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-10a1 1 0 0 0 -1 -1h-1a1 1 0 0 0 -1 1z"/>
                  <path d="M18 8h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2"/>
                  <path d="M22 12h-1"/>
                </svg>
              </div>
              <div>
                <div class="text-xl text-black">Activity Name: <span class="font-medium">${data.name}</span></div>
                <p class="text-black">Date: ${today}</p>
                <p class="text-black">Duration: ${data.hour}h ${data.min}m ${data.sec}s</p>
              </div>
            </div>
          </div>
        `;
        // Prepend the new card
        logContainer.insertAdjacentHTML('afterbegin', cardHTML);
      });
    })
    .catch(error => {
      console.error("Error fetching exercise data: ", error);
    });
}

// Call the function to fetch and display exercise data
fetchExerciseData();