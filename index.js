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
      <div class="custom-filter-options-container"></div>
      <button type="button" class="save-custom-filter">Save</button>
      <button type="button" class="delete-custom-filter">Delete</button>
    `;

    // Add calendar options dynamically
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
        optionsContainer.appendChild(input);
      }
    });

    // Save custom filter
    customFilterDiv
      .querySelector(".save-custom-filter")
      .addEventListener("click", () => {
        const filterName = customFilterDiv.querySelector(
          ".custom-filter-name"
        ).value;
        const filterType = customFilterDiv.querySelector(
          ".custom-filter-type"
        ).value;
        const optionsContainer = customFilterDiv.querySelector(
          ".custom-filter-options-container"
        );

        const customFilter = {
          label: filterName,
          class: "CustomFilter",
          options: [],
        };

        if (filterType === "calendar") {
          optionsContainer
            .querySelectorAll("input[type=checkbox]:checked")
            .forEach((checkbox) => {
              customFilter.options.push({
                label: checkbox.nextSibling.textContent,
                property: checkbox.id,
                type: "calendar",
              });
            });
        } else {
          customFilter.options.push({
            label: "Custom Option",
            property: "custom_option",
            type: "number",
          });
        }

        settings.filters.push(customFilter);
        const optionEl = document.createElement("option");
        optionEl.value = filterName;
        optionEl.innerHTML = filterName;
        filtersSelect.appendChild(optionEl);

        customFiltersContainer.removeChild(customFilterDiv);
      });

    // Delete custom filter
    customFilterDiv
      .querySelector(".delete-custom-filter")
      .addEventListener("click", () => {
        customFiltersContainer.removeChild(customFilterDiv);
      });

    customFiltersContainer.appendChild(customFilterDiv);
  };
});
