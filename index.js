document.addEventListener("DOMContentLoaded", function () {
  const selectElement = document.getElementById("strategy-name");
  const detailsDiv = document.getElementById("details");

  // Fetch JSON data
  fetch("./stratergydata.json")
    .then((response) => response.json())
    .then((data) => {
      // Populate select options
      for (const [name, strategy] of Object.entries(data)) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        selectElement.appendChild(option);
      }

      // Handle selection change
      selectElement.addEventListener("change", function () {
        const selectedStrategy = data[this.value];
        if (selectedStrategy) {
          detailsDiv.innerHTML = `
                                <h2>Details for ${this.value}</h2>
                                <p><strong>Class:</strong> ${
                                  selectedStrategy.class || "N/A"
                                }</p>
                                <p><strong>Universe:</strong> ${
                                  selectedStrategy.universe
                                }</p>
                                <div>
                                    ${
                                      selectedStrategy.filters
                                        ? "<h3>Filters:</h3>" +
                                          selectedStrategy.filters
                                            .map(
                                              (filter) => `
                                        <div>
                                            <strong>${filter.filter}:</strong>
                                            <pre>${JSON.stringify(
                                              filter.options,
                                              null,
                                              2
                                            )}</pre>
                                        </div>
                                    `
                                            )
                                            .join("")
                                        : ""
                                    }
                                </div>
                            `;
        } else {
          detailsDiv.innerHTML = "Please select a strategy.";
        }
      });
    })
    .catch((error) => console.error("Error fetching the JSON file:", error));
});
