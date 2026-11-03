// ======================================
// SUBJECT SEARCH
// ======================================

const subjectSearch = document.getElementById("subjectSearch");
const subjectCards = document.querySelectorAll(".subject-card");
const noResults = document.getElementById("noResults");

if (subjectSearch) {

    subjectSearch.addEventListener("input", function () {

        const searchText = subjectSearch.value.toLowerCase().trim();

        let matchingSubjects = 0;

        subjectCards.forEach(function (card) {

            const heading = card.querySelector("h3");
            const description = card.querySelector("p");

            const subjectName = heading
                ? heading.textContent.toLowerCase()
                : "";

            const subjectDescription = description
                ? description.textContent.toLowerCase()
                : "";

            const matches =
                subjectName.includes(searchText) ||
                subjectDescription.includes(searchText);

            card.hidden = !matches;

            if (matches) {
                matchingSubjects++;
            }

        });

        if (noResults) {
            noResults.hidden = matchingSubjects > 0;
        }

    });

}


// ======================================
// ASK STUDY BUDDY
// ======================================

const studentQuestion = document.getElementById("studentQuestion");
const askButton = document.getElementById("askButton");
const answerArea = document.getElementById("answerArea");

if (studentQuestion && askButton && answerArea) {

    askButton.addEventListener("click", async function () {

        const question = studentQuestion.value.trim();

        // Check empty question
        if (!question) {

            answerArea.textContent =
                "Please enter an academic question first.";

            studentQuestion.focus();

            return;
        }

        // Show loading message
        askButton.disabled = true;
        askButton.textContent = "Thinking...";

        answerArea.textContent =
            "Studdy Buddy is preparing your answer...";

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/ask",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        question: question
                    })
                }
            );

            // Read server response
            const data = await response.json();

            // Display actual server error
            if (!response.ok) {

                answerArea.textContent =
                    data.error || "Something went wrong. Please try again.";

                return;
            }

            // Display AI answer
            answerArea.textContent = data.answer;

        }

        catch (error) {

            console.error("Study Buddy connection error:", error);

            answerArea.textContent =
                "Could not connect to the Python server. " +
                "Please make sure Flask is running.";

        }

        finally {

            askButton.disabled = false;
            askButton.textContent = "Ask Study Buddy →";

        }

    });

}
