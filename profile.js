import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const profileForm = document.getElementById("profileForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const displayName = document.getElementById("displayName");
const message = document.getElementById("profileMessage");

let currentUser = null;

// Check logged-in student
onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;

        fullName.value = user.displayName || "";
        email.value = user.email || "";
        displayName.textContent = user.displayName || "Student";

    } else {

        window.location.href = "login.html";

    }

});

// Save profile changes
profileForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!currentUser) return;

    const name = fullName.value.trim();

    if (!name) {
        message.textContent = "Please enter your full name.";
        message.style.color = "red";
        return;
    }

    try {

        await updateProfile(currentUser, {
            displayName: name
        });

        displayName.textContent = name;

        message.textContent = "Profile updated successfully!";
        message.style.color = "green";

    } catch (error) {

        message.textContent = "Unable to update profile. Please try again.";
        message.style.color = "red";

        console.error(error);

    }

});