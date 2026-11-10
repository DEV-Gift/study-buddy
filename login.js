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

        await signInWithEmailAndPassword(auth, email, password);

        message.textContent = "Login successful!";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {

        message.style.color = "red";

        if (error.code === "auth/invalid-credential") {
            message.textContent = "Incorrect email or password.";
        } else if (error.code === "auth/user-not-found") {
            message.textContent = "Account not found.";
        } else {
            message.textContent = error.message;
        }

        console.error(error);

    }

});