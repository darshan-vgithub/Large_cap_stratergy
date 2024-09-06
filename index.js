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
        label: "Positive Movement Filter",
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

  const strategyInput = document.getElementById("strategy-name");
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

    selectEl.innerHTML = "";

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
    deleteButton.className = "form-button delete";
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
      <button class="remove-custom-filter" style="margin-top: 10px; padding: 8px 12px; background-color: #f44336; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Remove</button>
    `;

    const calendarSelect = customFilterDiv.querySelector(
      ".custom-calendar-select"
    );
    settings.calendars.forEach((calendar) => {
      const option = document.createElement("option");
      option.value = calendar;
      option.innerHTML = calendar;
      calendarSelect.appendChild(option);
    });

    customFilterDiv.querySelector(".remove-custom-filter").onclick = () => {
      customFilterDiv.remove();
      showMessage("Custom filter removed.", "info");
    };

    customFiltersContainer.appendChild(customFilterDiv);
    showMessage("Custom filter added!", "success");
  };

  function showMessage(message, type) {
    const messageContainer = document.getElementById("message-container");
    messageContainer.innerHTML = `<p class="${type}">${message}</p>`;
    setTimeout(() => {
      messageContainer.innerHTML = "";
    }, 3000);
  }

  document.querySelector("form").addEventListener("submit", function (ev) {
    ev.preventDefault();

    const strategyName = strategyInput.value || "";
    const jsonObject = {
      [strategyName]: {
        class: classSelect.value || "None",
        universe: universeSelect.value || "",
        filters: [],
      },
    };

    // Add custom filters to the JSON object
    customFiltersContainer.querySelectorAll("div").forEach((filterDiv) => {
      const name = filterDiv.querySelector(".custom-filter-name").value;
      const calendar = filterDiv.querySelector(".custom-calendar-select").value;
      const lookupWindow = filterDiv.querySelector(
        ".custom-look-up-window"
      ).value;
      const returnSize = filterDiv.querySelector(".custom-return-size").value;

      if (name) {
        const filter = {
          filter: name,
          options: {
            calendar_name: calendar,
            lookup_window: parseInt(lookupWindow),
            return_size: parseFloat(returnSize),
          },
        };
        jsonObject[strategyName].filters.push(filter);
      }
    });

    // Add regular filters to the JSON object
    document
      .querySelectorAll("#filters-section .form-group")
      .forEach((group) => {
        const selectEl = group.querySelector("select");
        const filterType = selectEl.value;
        const filter = settings.filters.find((f) => f.label === filterType);
        if (filter) {
          const options = {};
          filter.options.forEach((o) => {
            const input = group.querySelector(`[name=${o.property}]`);
            if (input) {
              options[o.property] = input.value;
            }
          });
          jsonObject[strategyName].filters.push({
            filter: filter.class,
            options,
          });
        }
      });

    document.getElementById("json-output").textContent = JSON.stringify(
      jsonObject,
      null,
      2
    );
  });
});
