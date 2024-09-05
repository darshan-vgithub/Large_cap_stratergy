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

function createNumberInput(el, options) {
  const inputEl = document.createElement("input");
  inputEl.type = "number";
  inputEl.name = options["property"];
  const label = document.createElement("label");
  label.innerText = options["label"];
  const divEl = document.createElement("div");
  divEl.style.display = "flex";
  divEl.style.flexDirection = "column";
  divEl.appendChild(label);
  divEl.appendChild(inputEl);
  el.parentNode.appendChild(divEl);
}

function createCalendarInput(el, options) {
  const selectEl = document.createElement("select");
  selectEl.name = options["property"];

  settings.calendars.forEach((calendar) => {
    const optionEl = document.createElement("option");
    optionEl.value = calendar;
    optionEl.innerText = calendar;
    selectEl.appendChild(optionEl);
  });

  const label = document.createElement("label");
  label.innerText = options["label"];
  const divEl = document.createElement("div");
  divEl.style.display = "flex";
  divEl.style.flexDirection = "column";
  divEl.appendChild(label);
  divEl.appendChild(selectEl);

  el.parentNode.appendChild(divEl);
}

function filterTypeSelected(ev) {
  const filterContainer = ev.target.closest(".form-group");

  // Remove any previously appended filter options
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

document.addEventListener("DOMContentLoaded", function () {
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

  // Populate the universe and class selects
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
    el.value = o["label"];
    el.innerHTML = o["label"];
    filtersSelect.appendChild(el);
  });

  // Handle class selection change
  classSelect.addEventListener("change", function () {
    const selectedClass = classSelect.value;

    // Show or hide filters and custom filter options based on selected class
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

  // Trigger the change event on page load to set the initial state
  classSelect.dispatchEvent(new Event("change"));

  addFilter.onclick = (ev) => {
    const el = filterDefaultDiv.cloneNode(false);
    el.id = "filter-" + new Date().getTime();
    el.style.display = "block";

    const selectEl = document.createElement("select");
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

    el.appendChild(selectEl);

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
      <button type="button" class="delete-custom-filter" style="margin-top: 10px; padding: 10px 15px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Delete</button>
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

    customFilterDiv
      .querySelector(".delete-custom-filter")
      .addEventListener("click", () => {
        customFilterDiv.remove();
      });

    customFiltersContainer.prepend(customFilterDiv);
  };

  // Event listener for form submission
  const form = document.getElementById("strategyForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    const formData = {
      strategyName: strategySelect.value,
      universe: universeSelect.value,
      class: classSelect.value,
      filters: [],
      customFilters: [],
    };

    // Collect filter data
    const filterGroups = document.querySelectorAll("#filters-section > div");
    filterGroups.forEach((group) => {
      const filterName = group.querySelector("select").value;
      if (filterName) {
        const filterOptions = {};
        const inputs = group.querySelectorAll("input, select");
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

      formData.customFilters.push({
        customFilterName: customFilterName,
        calendar: calendar,
        lookupWindow: lookupWindow,
        returnSize: returnSize,
      });
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
  });
});
