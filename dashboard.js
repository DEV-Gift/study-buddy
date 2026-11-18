import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const studentName = document.getElementById("studentName");
const profileName = document.getElementById("profileName");
const studentAvatar = document.getElementById("studentAvatar");

// Check whether a student is logged in
onAuthStateChanged(auth, (user) => {

    if (user) {

        const name = user.displayName || "Student";

        if (studentName) studentName.textContent = name;
        if (profileName) profileName.textContent = name;
        if (studentAvatar) {
            studentAvatar.textContent = name.charAt(0).toUpperCase();
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