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
          label: "look up window",
          property: "lookup_window",
          type: "number",
        },
        {
          label: "return size",
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
          label: "look up window",
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
  divEl.appendChild(label);
  divEl.appendChild(inputEl);
  el.parentNode.appendChild(divEl);
}

function createCalenderInput(el, options) {
  const selectEl = document.createElement("select");
  selectEl.name = options["property"];

  settings.calendars.forEach((o) => {
    const optionEl = document.createElement("option");
    optionEl.value = o;
    optionEl.innerText = o;
    selectEl.appendChild(optionEl);
  });

  const label = document.createElement("label");
  label.innerText = options["label"];
  const divEl = document.createElement("div");
  divEl.style.display = "flex";
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

  f.options.forEach((o) => {
    switch (o.type) {
      case "number":
        createNumberInput(ev.target, o);
        break;
      case "calendar":
        createCalenderInput(ev.target, o);
        break;
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const strategySelect = document.getElementById("strategy-name");
  const universeSelect = document.getElementById("universe");
  const classSelect = document.getElementById("class");
  const filtersButton = document.getElementById("filters-button");
  const filtersSection = document.getElementById("filters-section");
  const filtersSelect = document.getElementById("filters-select");
  const filterDefaultDiv = document.getElementById("filter-default");
  const filterOptionsDiv = document.getElementById("filter-options");
  const addFilter = document.getElementById("addFilter");
  const detailsDiv = document.getElementById("details");
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
    el.value = o["label"];
    el.innerHTML = o["label"];
    filtersSelect.appendChild(el);
  });

  addFilter.onclick = (ev) => {
    const el = filterDefaultDiv.cloneNode(true);
    el.id = "filter-" + new Date().getTime();
    el.style.display = "block";
    el.addEventListener("change", filterTypeSelected);

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
    customFilterDiv.innerHTML = `
    <label>Custom Filter Name:</label>
    <input type="text" class="custom-filter-name" placeholder="Filter Name" />
    <label>Filter Type:</label>
    <select class="custom-filter-type">
      <option value="calendar">Calendar</option>
      <option value="number">Number</option>
    </select>
    <label>Custom Filter Options:</label>
    <div class="custom-filter-options-container">
      <input type="text" class="custom-filter-options" placeholder="Option1, Option2, Option3" />
    </div>
    <button type="button" class="save-custom-filter">Save</button>
    <button type="button" class="delete-custom-filter">Delete</button>
  `;

    // Add calendar options if the filter type is calendar
    const filterTypeSelect = customFilterDiv.querySelector(
      ".custom-filter-type"
    );
    filterTypeSelect.addEventListener("change", function () {
      const optionsContainer = customFilterDiv.querySelector(
        ".custom-filter-options-container"
      );
      optionsContainer.innerHTML = ""; // Clear existing options

      if (this.value === "calendar") {
        settings.calendars.forEach((calendar) => {
          const optionInput = document.createElement("input");
          optionInput.type = "checkbox";
          optionInput.value = calendar;
          optionInput.id = `calendar-${calendar}`;
          const optionLabel = document.createElement("label");
          optionLabel.innerText = calendar;
          optionLabel.setAttribute("for", optionInput.id);

          optionsContainer.appendChild(optionInput);
          optionsContainer.appendChild(optionLabel);
          optionsContainer.appendChild(document.createElement("br"));
        });
      } else {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "custom-filter-options";
        input.placeholder = "Option1, Option2, Option3";
        optionsContainer.appendChild(input);
      }
    });

    customFiltersContainer.appendChild(customFilterDiv);

    customFilterDiv.querySelector(".save-custom-filter").onclick = () => {
      const nameInput = customFilterDiv.querySelector(".custom-filter-name");
      const typeSelect = customFilterDiv.querySelector(".custom-filter-type");
      const optionsContainer = customFilterDiv.querySelector(
        ".custom-filter-options-container"
      );
      const filterName = nameInput.value.trim();
      const filterType = typeSelect.value;

      let filterOptions = [];
      if (filterType === "calendar") {
        filterOptions = Array.from(
          optionsContainer.querySelectorAll('input[type="checkbox"]:checked')
        ).map((checkbox) => checkbox.value);
      } else {
        const optionsInput = optionsContainer.querySelector(
          ".custom-filter-options"
        );
        filterOptions = optionsInput.value
          .split(",")
          .map((option) => option.trim())
          .filter((option) => option);
      }

      if (filterName && filterOptions.length > 0) {
        const filterOption = {
          label: filterName,
          type: filterType,
          options:
            filterType === "calendar"
              ? filterOptions
              : {
                  lookup_window: 252,
                  return_size: 50,
                },
        };

        const filterOptionSelect = document.createElement("option");
        filterOptionSelect.value = filterName;
        filterOptionSelect.innerText = filterName;

        filtersSelect.appendChild(filterOptionSelect);

        // Clear the custom filter form
        customFilterDiv.remove();
      } else {
        alert("Please enter a valid filter name and options.");
      }
    };

    customFilterDiv.querySelector(".delete-custom-filter").onclick = () => {
      customFilterDiv.remove();
    };
  };

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

  function createNumberInput(el, options) {
    const inputEl = document.createElement("input");
    inputEl.type = "number";
    inputEl.name = options["property"];
    const label = document.createElement("label");
    label.innerText = options["label"];
    const divEl = document.createElement("div");
    divEl.style.display = "flex";
    divEl.appendChild(label);
    divEl.appendChild(inputEl);
    el.parentNode.appendChild(divEl);
  }

  function createCalendarInput(el, options) {
    const selectEl = document.createElement("select");
    selectEl.name = options["property"];

    settings.calendars.forEach((o) => {
      const optionEl = document.createElement("option");
      optionEl.value = o;
      optionEl.innerText = o;
      selectEl.appendChild(optionEl);
    });

    const label = document.createElement("label");
    label.innerText = options["label"];
    const divEl = document.createElement("div");
    divEl.style.display = "flex";
    divEl.appendChild(label);
    divEl.appendChild(selectEl);

    el.parentNode.appendChild(divEl);
  }

  let selectedStrategyData = null;

  fetch("./stratergydata.json")
    .then((response) => response.json())
    .then((data) => {
      Object.keys(data).forEach((key) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        strategySelect.appendChild(option);
      });

      strategySelect.addEventListener("change", function () {
        selectedStrategyData = data[this.value];
        if (selectedStrategyData) {
          universeSelect.disabled = false;
          universeSelect.innerHTML =
            '<option value="" disabled selected>Select Universe</option>';

          selectedStrategyData["universe"].forEach((uni) => {
            const option = document.createElement("option");
            option.value = uni;
            option.textContent = uni;
            universeSelect.appendChild(option);
          });
        }
      });

      universeSelect.addEventListener("change", function () {
        if (selectedStrategyData) {
          classSelect.disabled = false;
          classSelect.innerHTML =
            '<option value="" disabled selected>Select Class</option>';

          selectedStrategyData["class"].forEach((cls) => {
            const option = document.createElement("option");
            option.value = cls;
            option.textContent = cls;
            classSelect.appendChild(option);
          });
          filtersButton.style.display = "block";
        }
      });

      classSelect.addEventListener("change", function () {
        if (selectedStrategyData) {
          filtersSection.style.display = "block";
          filterOptionsDiv.innerHTML = "";

          selectedStrategyData["filters"].forEach((filter) => {
            const filterDiv = document.createElement("div");
            filterDiv.style.margin = "5px";
            filterDiv.style.padding = "5px";
            filterDiv.style.border = "solid #eee 1px";
            filterDiv.style.display = "flex";
            filterDiv.style.alignItems = "center";

            const filterLabel = document.createElement("span");
            filterLabel.textContent = filter["label"];
            filterDiv.appendChild(filterLabel);

            const filterInput = document.createElement("input");
            filterInput.type = "text";
            filterInput.name = filter["property"];
            filterDiv.appendChild(filterInput);

            filterOptionsDiv.appendChild(filterDiv);
          });

          detailsDiv.innerHTML = `Filter details for ${this.value}`;
        }
      });
    });
});
