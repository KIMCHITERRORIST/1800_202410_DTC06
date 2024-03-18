// Function to get the current user's UID
function getCurrentUserId() {
  return firebase.auth().currentUser.uid;
}

// Function to retrieve and display the user's name
function fetchAndDisplayUserName() {
  const userId = getCurrentUserId();
  db.collection('users').doc(userId).get().then((doc) => {
    if (doc.exists) {
      document.getElementById('name').textContent = doc.data().name;
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
}

// Function to fetch and display recipe counts for each category
function fetchAndDisplayRecipeCounts() {
  const userId = getCurrentUserId();
  // Fetch the categories array
  db.collection('Recipes').doc(userId).get().then((doc) => {
    if (doc.exists) {
      const categories = doc.data().categories;
      categories.forEach((category) => {
        // Fetch the count for each category
        db.collection('Recipes').doc(userId).collection(category).doc('count').get().then((countDoc) => {
          if (countDoc.exists) {
            document.getElementById(`${category}-count`).textContent = countDoc.data().count;
            // Add click event listener for redirect
            document.querySelector(`div[category="${category}"]`).addEventListener('click', () => {
              window.location.href = `/${category}.html`; // Adjust the URL as needed
            });
          }
        });
      });
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
}

// Ensure calling these functions when the page loads or after the user signs in
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    fetchAndDisplayUserName();
    fetchAndDisplayRecipeCounts();
  } else {
    console.log("No user signed in.");
  }
});

