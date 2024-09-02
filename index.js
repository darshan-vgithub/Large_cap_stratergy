document.addEventListener("DOMContentLoaded", function () {
  const strategySelect = document.getElementById("strategy-name");
  const universeSelect = document.getElementById("universe");
  const classSelect = document.getElementById("class");
  const filtersButton = document.getElementById("filters-button");
  const filtersDiv = document.getElementById("filters");
  const detailsDiv = document.getElementById("details");

  let selectedStrategyData = null;

  // Fetch JSON data
  fetch("./stratergydata.json")
    .then((response) => response.json())
    .then((data) => {
      // Populate strategy select options
      for (const [name, strategy] of Object.entries(data)) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        strategySelect.appendChild(option);
      }

      // Handle strategy selection change
      strategySelect.addEventListener("change", function () {
        selectedStrategyData = data[this.value];
        if (selectedStrategyData) {
          // Enable the universe select field
          universeSelect.disabled = false;

          // Populate universe select options
          universeSelect.innerHTML =
            '<option value="" disabled selected>Select Universe</option>';
          const universeOption = document.createElement("option");
          universeOption.value = selectedStrategyData.universe;
          universeOption.textContent = selectedStrategyData.universe;
          universeSelect.appendChild(universeOption);

          // Reset class and filters
          classSelect.disabled = true;
          classSelect.innerHTML =
            '<option value="" disabled selected>Select Class</option>';
          filtersButton.style.display = "none";
          filtersDiv.style.display = "none";
          detailsDiv.innerHTML = ""; // Clear details
        }
      });

      // Handle universe selection change
      universeSelect.addEventListener("change", function () {
        if (selectedStrategyData) {
          // Enable the class select field
          classSelect.disabled = false;

          // Populate class select options
          classSelect.innerHTML =
            '<option value="" disabled selected>Select Class</option>';
          const classOption = document.createElement("option");
          classOption.value = selectedStrategyData.class;
          classOption.textContent = selectedStrategyData.class || "N/A";
          classSelect.appendChild(classOption);
        }
      });

      // Handle class selection change
      classSelect.addEventListener("change", function () {
        if (this.value === "N/A") {
          // Show filters button and reset filters section
          filtersButton.style.display = "block";
          filtersDiv.style.display = "none";
          filtersDiv.innerHTML = "";
        } else {
          // Hide filters button if class is selected
          filtersButton.style.display = "none";
          filtersDiv.style.display = "none";
          filtersDiv.innerHTML = "";

          // Show strategy details
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
        filtersDiv.style.display = "block";

        // Populate filters section
        filtersDiv.innerHTML = selectedStrategyData.filters
          ? selectedStrategyData.filters
              .map(
                (filter) => `
                <div class="form-group">
                  <label for="${filter.filter}">${filter.filter}</label>
                  <select id="${filter.filter}">
                    ${filter.options
                      .map(
                        (option) =>
                          `<option value="${option}">${option}</option>`
                      )
                      .join("")}
                  </select>
                </div>
              `
              )
              .join("")
          : "<p>No filters available for this strategy.</p>";
      });
    })
    .catch((error) => console.error("Error fetching the JSON file:", error));
});
