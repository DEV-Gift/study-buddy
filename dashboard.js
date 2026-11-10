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

        studentName.textContent = name;
        profileName.textContent = name;

        studentAvatar.textContent = name.charAt(0).toUpperCase();

    } else {

        window.location.href = "login.html";

    }

});


// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        console.error("Logout error:", error);

    }

});