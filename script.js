
// Get the search input
const subjectSearch = document.getElementById("subjectSearch");

// Get all subject cards
const subjectCards = document.querySelectorAll(".subject-card");

// Get the message shown when no subject matches
const noResults = document.getElementById("noResults");

// Listen for typing in the search box
subjectSearch.addEventListener("input", function () {

    // Convert the search text to lowercase
    const searchText = subjectSearch.value.toLowerCase().trim();

    // Count matching subjects
    let matchingSubjects = 0;

    // Check every subject card
    subjectCards.forEach(function (card) {

        // Get the subject name
        const subjectName = card.querySelector("h3").textContent.toLowerCase();

        // Get the subject description
        const subjectDescription = card.querySelector("p").textContent.toLowerCase();

        // Check whether the name or description matches
        const matches =
            subjectName.includes(searchText) ||
            subjectDescription.includes(searchText);

        // Show matching cards and hide the others
        card.hidden = !matches;

        // Count the matches
        if (matches) {
            matchingSubjects++;
        }
    });

    // Show a message if nothing matches
    noResults.hidden = matchingSubjects !== 0;

});