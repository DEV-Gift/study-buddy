// Find the search box
const subjectSearch = document.getElementById("subjectSearch");

// Find all subject cards
const subjectCards = document.querySelectorAll(".subject-card");

// Find the no-results message
const noResults = document.getElementById("noResults");

if (subjectSearch) {
    console.log("Search box found. Setting up search.");

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

        console.log("Search text:", searchText);
        console.log("Matching subjects:", matchingSubjects);
    });
} else {
    console.error("Search box not found on this page.");
}