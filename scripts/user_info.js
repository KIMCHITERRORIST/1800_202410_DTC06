firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, retrieve user's name and check for additional info
    const uid = user.uid;
    db.collection("users").doc(uid).get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const userName = userData.name;
        // Display the user's name
        document.getElementById("name").textContent = userName;

        // Check if the user has already filled in additional info
        if (userData.age && userData.weight && userData.height && userData.gender) {
          // User has filled in their information, redirect to overview
          window.location.href = "overview.html";
        }
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  } else {
    console.log("No user signed in.");
  }
});


document.getElementById("user-info-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission

  const user = firebase.auth().currentUser;
  if (user) {
    const uid = user.uid;
    const age = document.getElementById("age").value;
    const weight = document.getElementById("weight").value;
    const height = document.getElementById("height").value;
    const gender = document.getElementById("gender").value;

    // Update user's info in Firestore
    db.collection("users").doc(uid).set({
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      gender: gender,
      BMI: Number(weight / (height / 100 * height / 100))
    }, { merge: true }).then(() => {
      console.log("Document successfully written!");
      window.location.href = "overview.html";
    }).catch((error) => {
      console.error("Error writing document: ", error);
    });
  }
});

document.getElementById("cancel").addEventListener("click", function () {
  window.history.back();
});
