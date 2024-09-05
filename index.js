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

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.innerHTML = "Select Filter";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectEl.appendChild(defaultOption);

    settings.filters.forEach((o) => {
      const option = document.createElement("option");
      option.value = o.label;
      option.innerHTML = o.label;
      selectEl.appendChild(option);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.style.marginLeft = "10px";
    deleteButton.type = "button";
    deleteButton.onclick = () => {
      el.remove();
    };
    el.appendChild(deleteButton);

    filterDefaultDiv.parentNode.prepend(el);
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
    deleteButton.style.marginTop = "10px";
    deleteButton.type = "button";
    deleteButton.onclick = () => {
      customFilterDiv.remove();
    };
    customFilterDiv.appendChild(deleteButton);

    customFiltersContainer.appendChild(customFilterDiv);
  };

  document.getElementById("strategyForm").onsubmit = function (ev) {
    ev.preventDefault();

    const formData = {
      strategy: document.getElementById("strategy-name").value,
      universe: document.getElementById("universe").value,
      class: document.getElementById("class").value,
      filters: [],
      customFilters: [],
    };

    // Collect filter data
    const filterDivs = document.querySelectorAll(
      "#filters-section > div[id^='filter-']"
    );
    filterDivs.forEach((div) => {
      const filterName = div.querySelector("select").value;
      if (filterName) {
        const filterOptions = {};
        const inputs = div.querySelectorAll("input, select");
        inputs.forEach((input) => {
          filterOptions[input.name] = input.value;
        });
        formData.filters.push({
          filterName: filterName,
          options: filterOptions,
        });
      }
    });

    // Collect custom filter data
    const customFilterDivs = document.querySelectorAll(
      "#custom-filters-container > div"
    );
    customFilterDivs.forEach((div) => {
      const customFilterName = div.querySelector(".custom-filter-name").value;
      const calendar = div.querySelector(".custom-calendar-select").value;
      const lookupWindow = div.querySelector(".custom-look-up-window").value;
      const returnSize = div.querySelector(".custom-return-size").value;

      if (customFilterName) {
        formData.customFilters.push({
          customFilterName: customFilterName,
          calendar: calendar,
          lookupWindow: lookupWindow,
          returnSize: returnSize,
        });
      }
    });

    // Create a JSON string from the form data
    const jsonData = JSON.stringify(formData, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a link element to download the Blob
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json"; // This will be the name of the downloaded file
    document.body.appendChild(link);

    // Automatically click the link to trigger the download
    link.click();

    // Remove the link from the DOM
    document.body.removeChild(link);
  };
});
