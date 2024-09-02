document.addEventListener("DOMContentLoaded", function () {
  const selectElement = document.getElementById("strategy-name");
  const universeSelect = document.getElementById("universe");
  const classSelect = document.getElementById("class");
  const filtersButton = document.getElementById("filters-button");
  const detailsDiv = document.getElementById("details");

  // Fetch JSON data
  fetch("./stratergydata.json")
    .then((response) => response.json())
    .then((data) => {
      // Populate strategy select options
      for (const [name, strategy] of Object.entries(data)) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        selectElement.appendChild(option);
      }

      // Handle strategy selection change
      selectElement.addEventListener("change", function () {
        const selectedStrategy = data[this.value];
        if (selectedStrategy) {
          // Populate universe select options
          universeSelect.innerHTML =
            '<option value="" disabled selected>Select Universe</option>';
          const universeOption = document.createElement("option");
          universeOption.value = selectedStrategy.universe;
          universeOption.textContent = selectedStrategy.universe;
          universeSelect.appendChild(universeOption);

          // Populate class select options
          classSelect.innerHTML =
            '<option value="" disabled selected>Select Class</option>';
          const classOption = document.createElement("option");
          classOption.value = selectedStrategy.class;
          classOption.textContent = selectedStrategy.class || "N/A";
          classSelect.appendChild(classOption);

          // Show filters button if class is "N/A"
          filtersButton.style.display = selectedStrategy.class
            ? "none"
            : "block";
        } else {
          universeSelect.innerHTML =
            '<option value="" disabled selected>Select Universe</option>';
          classSelect.innerHTML =
            '<option value="" disabled selected>Select Class</option>';
          filtersButton.style.display = "none";
        }

        // Display strategy details
        detailsDiv.innerHTML = `
          <h2>Details for ${this.value}</h2>
          <p><strong>Class:</strong> ${selectedStrategy.class || "N/A"}</p>
          <p><strong>Universe:</strong> ${selectedStrategy.universe}</p>
          <div>
            ${
              selectedStrategy.filters
                ? "<h3>Filters:</h3>" +
                  selectedStrategy.filters
                    .map(
                      (filter) => `
                        <div>
                          <strong>${filter.filter}:</strong>
                          <pre>${JSON.stringify(filter.options, null, 2)}</pre>
                        </div>
                      `
                    )
                    .join("")
                : ""
            }
          </div>
        `;
      });
    })
    .catch((error) => console.error("Error fetching the JSON file:", error));
});
