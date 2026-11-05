import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBpxyanY3RFM25evYxPSS09n-oCVQOLOwQ",
    authDomain: "studdy-buddy-63f56.firebaseapp.com",
    projectId: "studdy-buddy-63f56",
    storageBucket: "studdy-buddy-63f56.firebasestorage.app",
    messagingSenderId: "82286967953",
    appId: "1:82286967953:web:efc193fee45ffa8e041330",
    measurementId: "G-BTXDC3FRN4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);