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

const profileImage = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");
const bio = document.getElementById("bio");

let currentUser = null;
let selectedImage = null;

// Check logged-in student
onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;

        fullName.value = user.displayName || "";
        email.value = user.email || "";
        displayName.textContent = user.displayName || "Student";

        // Load saved About Me
        bio.value = localStorage.getItem(
            `studdyBuddyBio_${user.uid}`
        ) || "";

        // Load saved profile picture
        const savedImage = localStorage.getItem(
            `studdyBuddyProfileImage_${user.uid}`
        );

        if (savedImage) {
            profilePreview.src = savedImage;
        }

    } else {

        window.location.href = "login.html";

    }

});


// Preview uploaded picture
profileImage.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        message.textContent = "Please select an image.";
        message.style.color = "red";
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {

        selectedImage = reader.result;
        profilePreview.src = selectedImage;

    };

    reader.readAsDataURL(file);

});


// Save profile changes
profileForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!currentUser) return;

    const name = fullName.value.trim();
    const aboutMe = bio.value.trim();

    if (!name) {
        message.textContent = "Please enter your full name.";
        message.style.color = "red";
        return;
    }

    try {

        // Update Firebase name
        await updateProfile(currentUser, {
            displayName: name
        });

        // Save About Me
        localStorage.setItem(
            `studdyBuddyBio_${currentUser.uid}`,
            aboutMe
        );

        // Save profile picture
        if (selectedImage) {

            localStorage.setItem(
                `studdyBuddyProfileImage_${currentUser.uid}`,
                selectedImage
            );

        }

        displayName.textContent = name;

        message.textContent = "Profile updated successfully!";
        message.style.color = "green";

        selectedImage = null;

    } catch (error) {

        message.textContent = "Unable to save profile. Please try again.";
        message.style.color = "red";

        console.error("Profile update error:", error);

    }

});  