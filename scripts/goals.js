// Store the activity levels and its respective index to do the calculations with
const activityLevels = {
    "1.2": "Sedentary (little or no exercise, desk job)",
    "1.375": "Lightly active (light exercise/sports 1-3 days/week)",
    "1.55": "Moderately active (moderate exercise/sports 3-5 days/week)",
    "1.725": "Very active (hard exercise every day, or exercising 2x/day)",
    "1.9": "Extra active (hard exercise 2 or more times per day)"
};


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in and run other functions
        console.log("User is signed in.", user.uid);
        fetchAndDisplayUserData(user.uid); // Fetch and display user data
    } else {
        // No user is signed in.
        console.log("No user is signed in.");
    }
});

// Function to fetch and display user data
/**Function to fetch and display user data from the database
 * @param {string} uid - User ID
 * @returns {void}
 **/
function fetchAndDisplayUserData(uid) {
    db.collection("users").doc(uid).get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            const userData = doc.data();
            // Display fetched user data in the page
            document.getElementById("currentWeight").textContent = userData.weight + ' kg';
            document.getElementById("activityLevelText").textContent = activityLevels[userData.activityLevel];
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

// Add event listener to the set goal button to set the goal weight and date
document.getElementById("setGoal").addEventListener("click", function () {
    const user = firebase.auth().currentUser;
    if (user) {
        const goalWeight = document.getElementById("goalWeight").value;
        const goalDate = document.getElementById("goalDate").value;

        console.log("Setting goal:", goalWeight, goalDate);

        if (goalWeight && goalDate) {
            // save the goals to the database
            db.collection("users").doc(user.uid).update({
                goalWeight: Number(goalWeight),
                goalDate: goalDate
            }).then(() => {
                console.log("Goal successfully set!");
            }).catch((error) => {
                console.error("Error setting goal: ", error);
            });
        }
    }
});

// Function to show the activity level modal
/** Function to show the activity level modal
 * @param {boolean} show - Show or hide the modal
 * @returns {void}
 **/
function showModal(show) {
    document.getElementById("activityLevelModal").style.display = show ? "block" : "none";
}

// Trigger to open the activity level modal
document.getElementById("activityLevelText").addEventListener("click", function () {
    showModal(true);
});

// Cancel button inside activity level modal
document.getElementById("closeModal").addEventListener("click", function () {
    showModal(false);
});

// Save button inside activity level modal
document.getElementById("saveActivityLevel").addEventListener("click", function () {
    const user = firebase.auth().currentUser;
    const newActivityLevel = document.getElementById("newActivityLevel").value;

    // Update the activity level in the database
    if (user) {
        db.collection("users").doc(user.uid).update({
            activityLevel: newActivityLevel
        }).then(() => {
            console.log("Activity level updated successfully");
            const activityLevelText = activityLevels[newActivityLevel];
            document.getElementById("activityLevelText").textContent = activityLevelText;
            showModal(false);
        }).catch((error) => {
            console.error("Error updating activity level: ", error);
        });
    }
});
