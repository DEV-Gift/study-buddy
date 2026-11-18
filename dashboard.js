import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const studentName = document.getElementById("studentName");
const profileName = document.getElementById("profileName");
const studentAvatar = document.getElementById("studentAvatar");
const welcomeAvatar = document.getElementById("welcomeAvatar");

// Check whether a student is logged in
onAuthStateChanged(auth, (user) => {

    if (user) {

        const name = user.displayName || "Student";

        // Display student's name
        if (studentName) {
            studentName.textContent = name;
        }

        if (profileName) {
            profileName.textContent = name;
        }

        // Get saved profile picture
        const savedImage = localStorage.getItem(
            `studdyBuddyProfileImage_${user.uid}`
        );

        if (savedImage) {

            // Display picture in dashboard top-right corner
            if (studentAvatar) {

                const image = document.createElement("img");

                image.src = savedImage;
                image.alt = "Student Profile Picture";

                studentAvatar.replaceChildren(image);

            }

            // Display picture beside Welcome Back
            if (welcomeAvatar) {

                welcomeAvatar.src = savedImage;
                welcomeAvatar.style.display = "block";

            }

        } else {

            // Display student's initial if no picture exists
            if (studentAvatar) {

                studentAvatar.textContent =
                    name.charAt(0).toUpperCase();

            }

            if (welcomeAvatar) {
                welcomeAvatar.style.display = "none";
            }

        }

    } else {

        window.location.href = "login.html";

    }

});


// Logout functionality
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (error) {

            console.error("Logout error:", error);

        }

    });

} 