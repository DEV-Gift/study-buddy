import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// TEST: Check if JavaScript loads
console.log("Signup JavaScript loaded successfully!");


const signupForm = document.getElementById("signupForm");
const message = document.getElementById("signupMessage");


signupForm.addEventListener("submit", async function(event) {

    // Prevent page refresh
    event.preventDefault();

    console.log("Signup button clicked!");

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;


    // Check if passwords match
    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        message.style.color = "red";
        return;
    }


    // Check password length
    if (password.length < 6) {
        message.textContent = "Password must be at least 6 characters.";
        message.style.color = "red";
        return;
    }


    try {

        message.textContent = "Creating your account...";
        message.style.color = "#d4af37";

        console.log("Connecting to Firebase...");


        // Create Firebase account
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;


        // Save user's fullname
        await updateProfile(user, {
            displayName: fullname
        });


        console.log("Account created successfully!");


        message.textContent = "Account created successfully!";
        message.style.color = "green";


        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);


    } catch (error) {

        message.style.color = "red";

        if (error.code === "auth/email-already-in-use") {
            message.textContent = "This email already has an account.";

        } else if (error.code === "auth/invalid-email") {
            message.textContent = "Please enter a valid email address.";

        } else if (error.code === "auth/weak-password") {
            message.textContent = "Please choose a stronger password.";

        } else {
            message.textContent = error.message;
        }

        console.error("Firebase signup error:", error);

    }

});
