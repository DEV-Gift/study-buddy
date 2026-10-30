
// ===================================
// SUBJECT SEARCH
// ===================================

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


// ===================================
// ASK STUDY BUDDY
// ===================================

const studentQuestion = document.getElementById("studentQuestion");
const askButton = document.getElementById("askButton");
const answerArea = document.getElementById("answerArea");

if (studentQuestion && askButton && answerArea) {
    askButton.addEventListener("click", async function () {
        const question = studentQuestion.value.trim();

        if (!question) {
            answerArea.textContent =
                "Please enter an academic question first.";
            studentQuestion.focus();
            return;
        }

        askButton.disabled = true;
        askButton.textContent = "Sending question...";
        answerArea.textContent =
            "Connecting to Study Buddy's server...";

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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Something went wrong."
                );
            }

            answerArea.textContent = data.answer;

        } catch (error) {
            console.error("Study Buddy error:", error);

            answerArea.textContent =
                "Could not connect to the Python server. " +
                "Check that Flask is running in your terminal.";
        } finally {
            askButton.disabled = false;
            askButton.textContent = "Ask Study Buddy →";
        }
    });
}
