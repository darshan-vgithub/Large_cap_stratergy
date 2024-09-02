document.addEventListener("DOMContentLoaded", function () {
  const strategySelect = document.getElementById("strategy-name");
  const universeSelect = document.getElementById("universe");
  const classSelect = document.getElementById("class");
  const filtersButton = document.getElementById("filters-button");
  const filtersSection = document.getElementById("filters-section");
  const filtersSelect = document.getElementById("filters-select");
  const filterOptionsDiv = document.getElementById("filter-options");
  const detailsDiv = document.getElementById("details");

  let selectedStrategyData = null;

  // Fetch JSON data
  fetch("./stratergydata.json")
    .then((response) => response.json())
    .then((data) => {
      // Populate strategy select options
      Object.keys(data).forEach((key) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        strategySelect.appendChild(option);
      });

      // Handle strategy selection change
      strategySelect.addEventListener("change", function () {
        selectedStrategyData = data[this.value];
        if (selectedStrategyData) {
          // Enable the universe select field
          universeSelect.disabled = false;
          universeSelect.innerHTML =
            '<option value="" disabled selected>Select Universe</option>';

          // Populate universe select options
          const universeOption = document.createElement("option");
          universeOption.value = selectedStrategyData.universe;
          universeOption.textContent = selectedStrategyData.universe;
          universeSelect.appendChild(universeOption);

          // Reset class and filters
          classSelect.disabled = true;
          classSelect.innerHTML =
            '<option value="" disabled selected>Select Class</option>';
          filtersButton.style.display = "none";
          filtersSection.style.display = "none";
          filterOptionsDiv.innerHTML = ""; // Clear filter options
          detailsDiv.innerHTML = ""; // Clear details
        }
      });

      // Handle universe selection change
      universeSelect.addEventListener("change", function () {
        if (selectedStrategyData) {
          // Enable the class select field
          classSelect.disabled = false;
          classSelect.innerHTML =
            '<option value="" disabled selected>Select Class</option>';

          // Populate class select options
          const classOption = document.createElement("option");
          classOption.value = selectedStrategyData.class || "N/A";
          classOption.textContent = selectedStrategyData.class || "N/A";
          classSelect.appendChild(classOption);
        }
      });

      // Handle class selection change
      classSelect.addEventListener("change", function () {
        const selectedClassValue = this.value.trim().toLowerCase();

        if (!selectedClassValue || selectedClassValue === "n/a") {
          // Show filters button if class is null, "N/A", or "na"
          filtersButton.style.display = "block";
          filtersSection.style.display = "none";
          detailsDiv.innerHTML = ""; // Clear details
        } else {
          // Hide filters button if class is selected and show details
          filtersButton.style.display = "none";
          filtersSection.style.display = "none";
          detailsDiv.innerHTML = `
            <h2>Details for ${strategySelect.value}</h2>
            <p><strong>Class:</strong> ${
              selectedStrategyData.class || "N/A"
            }</p>
            <p><strong>Universe:</strong> ${selectedStrategyData.universe}</p>
          `;
        }
      });

      // Handle filters button click
      filtersButton.addEventListener("click", function (e) {
        e.preventDefault();
        filtersSection.style.display = "block"; // Show the filters section

        // Populate filters select dropdown
        if (
          selectedStrategyData.filters &&
          Array.isArray(selectedStrategyData.filters)
        ) {
          filtersSelect.innerHTML = selectedStrategyData.filters
            .map(
              (filter, index) =>
                `<option value="${index}">${filter.filter}</option>`
            )
            .join("");
        } else {
          filtersSelect.innerHTML =
            '<option value="" disabled>No filters available</option>';
        }
      });

      // Handle filter selection change
      filtersSelect.addEventListener("change", function () {
        const selectedFilterIndex = this.value;
        const selectedFilter = selectedStrategyData.filters
          ? selectedStrategyData.filters[selectedFilterIndex]
          : null;

        if (selectedFilter && selectedFilter.options) {
          // Check if options is an object and convert it to an array
          const options =
            typeof selectedFilter.options === "object" &&
            selectedFilter.options !== null
              ? Object.entries(selectedFilter.options)
              : [];

          filterOptionsDiv.innerHTML = `
            <label for="${selectedFilter.filter}-options">${
            selectedFilter.filter
          } Options:</label>
            <ul>
              ${
                options.length > 0
                  ? options
                      .map(([key, value]) => `<li>${key}: ${value}</li>`)
                      .join("")
                  : "<li>No options available</li>"
              }
            </ul>
          `;
        } else {
          filterOptionsDiv.innerHTML =
            "<p>No filter selected or options unavailable.</p>";
        }
      });
    })
    .catch((error) => console.error("Error fetching the JSON file:", error));
});
