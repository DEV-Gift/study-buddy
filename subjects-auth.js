import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if (user) {

        // Student is logged in
        document.body.style.visibility = "visible";

        console.log("Student is authenticated.");

    } else {

        // Student is not logged in
        window.location.replace("login.html");

    }

});