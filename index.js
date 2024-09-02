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
      // Populate Strategy Name select options
      for (const [name, strategy] of Object.entries(data)) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        selectElement.appendChild(option);
      }

      // Handle Strategy Name selection change
      selectElement.addEventListener("change", function () {
        const selectedStrategy = data[this.value];

        if (selectedStrategy) {
          // Populate Universe select options
          universeSelect.innerHTML = `<option value="">Select Universe</option>`;
          universeSelect.innerHTML += `<option value="${selectedStrategy.universe}">${selectedStrategy.universe}</option>`;

          // Populate Class select options
          classSelect.innerHTML = `<option value="">Select Class</option>`;
          if (selectedStrategy.class) {
            classSelect.innerHTML += `<option value="${selectedStrategy.class}">${selectedStrategy.class}</option>`;
          } else {
            classSelect.innerHTML += `<option value="null">No Class (null)</option>`;
          }

          detailsDiv.innerHTML = `
            <h2>Details for ${this.value}</h2>
            <p><strong>Class:</strong> ${selectedStrategy.class || "N/A"}</p>
            <p><strong>Universe:</strong> ${selectedStrategy.universe}</p>
          `;
        } else {
          detailsDiv.innerHTML = "Please select a strategy.";
        }
      });

      // Handle Class selection change
      classSelect.addEventListener("change", function () {
        if (this.value === "null") {
          filtersButton.style.display = "block";
        } else {
          filtersButton.style.display = "none";
        }
      });

      // Handle Filters button click
      filtersButton.addEventListener("click", function (e) {
        e.preventDefault();
        const selectedStrategy = data[selectElement.value];
        if (selectedStrategy && selectedStrategy.filters) {
          detailsDiv.innerHTML += `
            <div>
              <h3>Filters:</h3>
              ${selectedStrategy.filters
                .map(
                  (filter) => `
                  <div>
                    <strong>${filter.filter}:</strong>
                    <pre>${JSON.stringify(filter.options, null, 2)}</pre>
                  </div>`
                )
                .join("")}
            </div>
          `;
        }
      });
    })
    .catch((error) => console.error("Error fetching the JSON file:", error));
});
