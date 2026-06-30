const searchBtn = document.getElementById("searchBtn");


async function searchRecommendations() {
    const keyword = document.getElementById("searchInput").value.trim().toLowerCase();

    // Fetch the data from the JSON file.
    const response = await fetch("travel_recommendation.json");
    const data = await response.json();

    // Flatten the JSON into a single array of destination objects.
    // Countries hold nested cities; temples and beaches are flat lists.
    const destinations = [];

    data.countries.forEach((country) => {
        country.cities.forEach((city) => {
            destinations.push({ category: "country", ...city });
        });
    });

    data.temples.forEach((temple) => {
        destinations.push({ category: "temple", ...temple });
    });

    data.beaches.forEach((beach) => {
        destinations.push({ category: "beach", ...beach });
    });

    // Select the objects relevant to the user-entered text.
    const results = destinations.filter((dest) => {
        // Match category keywords like "beach"/"beaches", "temple"/"temples", "country"/"countries".
        const matchesCategory =
            keyword === dest.category ||
            keyword === dest.category + "s" ||
            (dest.category === "country" && keyword === "countries");

        // Match the keyword against the destination name or description.
        const matchesText =
            dest.name.toLowerCase().includes(keyword) ||
            dest.description.toLowerCase().includes(keyword);

        return keyword !== "" && (matchesCategory || matchesText);
    });

    displayResults(results);
    return results;
}

// Render the matching destinations into the results container.
function displayResults(results) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    if (results.length === 0) {
        container.innerHTML = "<p>No recommendations found. Try another keyword.</p>";
        return;
    }

    results.forEach((dest) => {
        const card = document.createElement("div");
        card.className = "result-card";

        const image = document.createElement("img");
        image.src = dest.imageUrl;
        image.alt = dest.name;

        const name = document.createElement("h2");
        name.textContent = dest.name;

        const description = document.createElement("p");
        description.textContent = dest.description;

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(description);
        container.appendChild(card);
    });
}

// Clear the search input and any displayed results.
function resetResults() {
    document.getElementById("searchInput").value = "";
    document.getElementById("results").innerHTML = "";
}

searchBtn.addEventListener("click", searchRecommendations);

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", resetResults);
