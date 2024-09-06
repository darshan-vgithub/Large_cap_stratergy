document.addEventListener("DOMContentLoaded", function () {
  const settings = {
    classes: ["CruiseMomentum", "None"],
    universes: ["Mcap_100", "Nifty_50", "Nifty_IT"],
    calendars: ["XNSE", "BCME"],
    filters: [
      {
        label: "Market Cap Filter",
        class: "McapFilter",
        options: [
          {
            label: "Minimum Cap",
            property: "min_market_cap",
            type: "number",
          },
        ],
      },
      {
        label: "Generic Momentum Filter",
        class: "AbsoluteReturnFilter",
        options: [
          {
            label: "Calendar",
            property: "calendar_name",
            type: "calendar",
          },
          {
            label: "Look up window",
            property: "lookup_window",
            type: "number",
          },
          {
            label: "Return size",
            property: "return_size",
            type: "number",
          },
        ],
      },
      {
        label: "PositiveMovementFilter",
        class: "PositiveMovementFilter",
        options: [
          {
            label: "Calendar",
            property: "calendar",
            type: "calendar",
          },
          {
            label: "Look up window",
            property: "lookup_window",
            type: "number",
          },
          {
            label: "Positive return size",
            property: "positive_return_size",
            type: "number",
          },
        ],
      },
    ],
  };

  // Function to create number input fields
  function createNumberInput(el, options) {
    const inputEl = document.createElement("input");
    inputEl.type = "number";
    inputEl.name = options.property;
    const label = document.createElement("label");
    label.innerText = options.label;
    const divEl = document.createElement("div");
    divEl.style.display = "flex";
    divEl.style.flexDirection = "column";
    divEl.appendChild(label);
    divEl.appendChild(inputEl);
    el.parentNode.appendChild(divEl);
  }

  // Function to create calendar select fields
  function createCalendarInput(el, options) {
    const selectEl = document.createElement("select");
    selectEl.name = options.property;
    settings.calendars.forEach((calendar) => {
      const optionEl = document.createElement("option");
      optionEl.value = calendar;
      optionEl.innerText = calendar;
      selectEl.appendChild(optionEl);
    });
    const label = document.createElement("label");
    label.innerText = options.label;
    const divEl = document.createElement("div");
    divEl.style.display = "flex";
    divEl.style.flexDirection = "column";
    divEl.appendChild(label);
    divEl.appendChild(selectEl);
    el.parentNode.appendChild(divEl);
  }

  // Function to handle filter type selection
  function filterTypeSelected(ev) {
    const filterContainer = ev.target.closest(".form-group");
    const existingOptions = filterContainer.querySelectorAll(
      'div[style*="display: flex"]'
    );
    existingOptions.forEach((option) => option.remove());

    const filterTypeVal = ev.target.value;
    const f = settings.filters.find((o) => o.label === filterTypeVal);

    if (f) {
      f.options.forEach((o) => {
        switch (o.type) {
          case "number":
            createNumberInput(ev.target, o);
            break;
          case "calendar":
            createCalendarInput(ev.target, o);
            break;
        }
      });
    }
  }

  // Initialize selects with settings data
  const strategySelect = document.getElementById("strategy-name");
  const universeSelect = document.getElementById("universe");
  const classSelect = document.getElementById("class");
  const filtersSection = document.getElementById("filters-section");
  const filtersSelect = document.getElementById("filters-select");
  const filterDefaultDiv = document.getElementById("filter-default");
  const addFilter = document.getElementById("addFilter");
  const addCustomFilterButton = document.getElementById("addCustomFilter");
  const customFiltersContainer = document.getElementById(
    "custom-filters-container"
  );

  settings.universes.forEach((o) => {
    const el = document.createElement("option");
    el.value = o;
    el.innerHTML = o;
    universeSelect.appendChild(el);
  });

  settings.classes.forEach((o) => {
    const el = document.createElement("option");
    el.value = o;
    el.innerHTML = o;
    classSelect.appendChild(el);
  });

  settings.filters.forEach((o) => {
    const el = document.createElement("option");
    el.value = o.label;
    el.innerHTML = o.label;
    filtersSelect.appendChild(el);
  });

  classSelect.addEventListener("change", function () {
    const selectedClass = classSelect.value;
    if (selectedClass === "None") {
      filtersSection.style.display = "block";
      addFilter.style.display = "block";
      addCustomFilterButton.style.display = "block";
    } else {
      filtersSection.style.display = "none";
      addFilter.style.display = "none";
      addCustomFilterButton.style.display = "none";
    }
  });

  classSelect.dispatchEvent(new Event("change"));

  addFilter.onclick = (ev) => {
    const el = filterDefaultDiv.cloneNode(true);
    el.id = "filter-" + new Date().getTime();
    el.style.display = "block";

    const selectEl = el.querySelector("select");
    selectEl.addEventListener("change", filterTypeSelected);

    // Clear existing options
    selectEl.innerHTML = "";

    // Add the default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.innerHTML = "Select Filter";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectEl.appendChild(defaultOption);

    // Add filter options from settings
    settings.filters.forEach((o) => {
      const option = document.createElement("option");
      option.value = o.label;
      option.innerHTML = o.label;
      selectEl.appendChild(option);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "form-button delete"; // Add delete class
    deleteButton.style.marginLeft = "10px";
    deleteButton.type = "button";
    deleteButton.onclick = () => {
      el.remove();
      showMessage("Filter deleted.", "info");
    };

    el.appendChild(deleteButton);
    customFiltersContainer.appendChild(el);
    showMessage("Filter added.", "success");
  };

  addCustomFilterButton.onclick = () => {
    const el = filterDefaultDiv.cloneNode(true);
    el.id = "custom-filter-" + new Date().getTime();
    el.style.display = "block";
    const selectEl = el.querySelector("select");
    selectEl.addEventListener("change", filterTypeSelected);
    selectEl.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.innerHTML = "Select Custom Filter";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectEl.appendChild(defaultOption);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "form-button delete";
    deleteButton.style.marginLeft = "10px";
    deleteButton.type = "button";
    deleteButton.onclick = () => {
      el.remove();
      showMessage("Custom filter deleted.", "info");
    };

    el.appendChild(deleteButton);
    customFiltersContainer.appendChild(el);
    showMessage("Custom filter added.", "success");
  };

  function showMessage(message, type) {
    const messageEl = document.createElement("div");
    messageEl.innerText = message;
    messageEl.className = `message ${type}`;
    document.body.appendChild(messageEl);
    setTimeout(() => messageEl.remove(), 3000);
  }

  const form = document.getElementById("strategyForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Include custom filters in the JSON output
    const customFilters = Array.from(
      customFiltersContainer.querySelectorAll("#filter-default")
    )
      .map((filter) => {
        const filterType = filter.querySelector("select").value;
        const filterOptions = settings.filters.find(
          (f) => f.label === filterType
        );
        if (filterOptions) {
          const options = {};
          filterOptions.options.forEach((opt) => {
            const input = filter.querySelector(`[name="${opt.property}"]`);
            if (input) options[opt.property] = input.value;
          });
          return { filterType, options };
        }
        return null;
      })
      .filter(Boolean);

    data.customFilters = customFilters;

    // Display the JSON data in the container
    const jsonOutputContainer = document.getElementById("json-output");
    jsonOutputContainer.textContent = JSON.stringify(data, null, 2);

    showMessage("Form data saved successfully.", "success");
  });
});
