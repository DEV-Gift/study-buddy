import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        message.textContent = "Signing you in...";
        message.style.color = "#d4af37";

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log("Logged in successfully:", userCredential.user);

        message.textContent = "Login successful!";
        message.style.color = "green";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {

        message.style.color = "red";

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/user-not-found" ||
            error.code === "auth/wrong-password"
        ) {
            message.textContent = "Incorrect email or password.";

        } else if (error.code === "auth/invalid-email") {
            message.textContent = "Please enter a valid email address.";

        } else {
            message.textContent = "Login failed. Please try again.";
        }

        console.error("Login error:", error);

    }

});