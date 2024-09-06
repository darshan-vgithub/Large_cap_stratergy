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

    filterDefaultDiv.parentNode.prepend(el);
    showMessage("Filter added!", "success");
  };

  addCustomFilterButton.onclick = () => {
    const customFilterDiv = document.createElement("div");
    customFilterDiv.style.margin = "10px 0";
    customFilterDiv.style.padding = "10px";
    customFilterDiv.style.border = "1px solid #ccc";
    customFilterDiv.style.borderRadius = "5px";
    customFilterDiv.style.backgroundColor = "#f9f9f9";

    customFilterDiv.innerHTML = `
    <label style="display: block; margin-bottom: 5px;">Custom Filter Name:</label>
    <input type="text" class="custom-filter-name" placeholder="Filter Name" style="width: 100%; padding: 8px; box-sizing: border-box;" />
    <label style="display: block; margin: 10px 0 5px;">Calendar:</label>
    <select class="custom-calendar-select" style="width: 100%; padding: 8px; box-sizing: border-box;">
      <option value="">Select Calendar</option>
    </select>
    <label style="display: block; margin: 10px 0 5px;">Look up window:</label>
    <input type="number" class="custom-look-up-window" placeholder="Look up window" style="width: 100%; padding: 8px; box-sizing: border-box;" />
    <label style="display: block; margin: 10px 0 5px;">Return size:</label>
    <input type="number" class="custom-return-size" placeholder="Return size" style="width: 100%; padding: 8px; box-sizing: border-box;" />
  `;

    const calendarSelect = customFilterDiv.querySelector(
      ".custom-calendar-select"
    );
    settings.calendars.forEach((calendar) => {
      const optionEl = document.createElement("option");
      optionEl.value = calendar;
      optionEl.innerText = calendar;
      calendarSelect.appendChild(optionEl);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "form-button delete"; // Add delete class
    deleteButton.style.marginTop = "10px";
    deleteButton.type = "button";
    deleteButton.onclick = () => {
      customFilterDiv.remove();
      showMessage("Custom filter deleted.", "info");
    };
    customFilterDiv.appendChild(deleteButton);

    customFiltersContainer.appendChild(customFilterDiv);
    showMessage("Custom filter added!", "success");
  };

  document.getElementById("strategyForm").onsubmit = function (ev) {
    ev.preventDefault();

    const formData = {
      strategy: document.getElementById("strategy-name").value,
      universe: document.getElementById("universe").value,
      class: document.getElementById("class").value,
      filters: [], // This will be populated later
    };

    document.querySelectorAll("#filters-section > div").forEach((filterDiv) => {
      const filterSelect = filterDiv.querySelector("select");
      const filterType = filterSelect.value;
      if (filterType) {
        const filter = settings.filters.find((f) => f.label === filterType);
        const filterData = {
          label: filter.label,
          class: filter.class,
          options: {},
        };

        filter.options.forEach((o) => {
          const inputEl = filterDiv.querySelector(
            `input[name="${o.property}"]`
          );
          if (inputEl) {
            filterData.options[o.property] = inputEl.value;
          }

          const selectEl = filterDiv.querySelector(
            `select[name="${o.property}"]`
          );
          if (selectEl) {
            filterData.options[o.property] = selectEl.value;
          }
        });

        formData.filters.push(filterData);
      }
    });

    document
      .querySelectorAll("#custom-filters-container > div")
      .forEach((filterDiv) => {
        const filterName = filterDiv.querySelector(".custom-filter-name").value;
        const calendarSelect = filterDiv.querySelector(
          ".custom-calendar-select"
        ).value;
        const lookUpWindow = filterDiv.querySelector(
          ".custom-look-up-window"
        ).value;
        const returnSize = filterDiv.querySelector(".custom-return-size").value;

        if (filterName && calendarSelect) {
          formData.filters.push({
            label: filterName,
            class: "CustomFilter",
            options: {
              calendar: calendarSelect,
              look_up_window: lookUpWindow,
              return_size: returnSize,
            },
          });
        }
      });

    const jsonOutput = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filters.json";
    a.click();
    URL.revokeObjectURL(url);
    showMessage("Filters saved as JSON!", "success");
  };

  function showMessage(message, type) {
    const messageEl = document.createElement("div");
    messageEl.innerText = message;
    messageEl.style.position = "fixed";
    messageEl.style.top = "20px";
    messageEl.style.right = "20px";
    messageEl.style.backgroundColor =
      type === "success" ? "#d4edda" : "#f8d7da";
    messageEl.style.color = type === "success" ? "#155724" : "#721c24";
    messageEl.style.padding = "10px";
    messageEl.style.borderRadius = "4px";
    messageEl.style.border = `1px solid ${
      type === "success" ? "#c3e6cb" : "#f5c6cb"
    }`;
    messageEl.style.zIndex = "1000"; // Ensure the message is on top of other elements
    messageEl.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)"; // Optional: add a shadow for better visibility

    document.body.appendChild(messageEl);

    setTimeout(() => {
      messageEl.remove();
    }, 3000);
  }
});
