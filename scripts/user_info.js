firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, retrieve user's name
    const uid = user.uid;
    db.collection("users").doc(uid).get().then((doc) => {
      if (doc.exists) {
        const userName = doc.data().name;
        document.getElementById("name").textContent = userName;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  } else {
    // No user is signed in.
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
      age: age,
      weight: weight,
      height: height,
      gender: gender
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
