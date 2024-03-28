var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {

      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid)
      //get the document for current user.
      currentUser.get()
        .then(userDoc => {
          //get the data fields of the user
          let userName = userDoc.data().name;
          let userAge = userDoc.data().age;
          let userHeight = userDoc.data().height;
          let userWeight = userDoc.data().weight;
          let userGender = userDoc.data().gender;

          //if the data fields are not empty, then write them in to the form.
          if (userName != null) {
            document.getElementById("name").innerText = userName;
            document.getElementById("nameField").value = userName;
          }
          if (userAge != null) {
            document.getElementById("age").value = userAge;
          }
          if (userHeight != null) {
            document.getElementById("height").value = userHeight;
          }
          if (userWeight != null) {
            document.getElementById("weight").value = userWeight;
          }
          if (userGender != null) {
            document.getElementById("gender").value = userGender;
          }
        })
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}

//call the function to run it 
populateUserInfo();

function editUserInfo() {
  //Enable the form fields
  document.getElementById('personal_info').disabled = false;
}

function saveUserInfo() {
  userName = document.getElementById('nameField').value;
  userAge = document.getElementById('age').value;
  userHeight = document.getElementById('height').value;
  userWeight = document.getElementById('weight').value;
  userGender = document.getElementById('gender').value;

  currentUser.update({
    name: userName,
    age: userAge,
    height: userHeight,
    weight: userWeight,
    gender: userGender
  }).then(() => { console.log("User info updated") })
  document.getElementById('personal_info').disabled = true;
}      