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
  const editButton = document.getElementById("edit");
  const jsonOutputTextarea = document.getElementById("json-output");

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
    debugger;

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
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      const container = document.createElement("div");
      container.id = "toast-container";
      container.style.position = "fixed";
      container.style.top = "10px";
      container.style.right = "10px";
      container.style.zIndex = "9999";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    toast.style.marginTop = "5px";
    toast.style.padding = "10px";
    toast.style.color = "#fff";
    toast.style.backgroundColor = type === "success" ? "#4caf50" : "#f44336";
    toast.style.borderRadius = "4px";
    toast.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s";
    document.getElementById("toast-container").appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "1";
    }, 100);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 500);
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

  const copyButton = document.getElementById("copy-json");
  const jsonOutput = document.getElementById("json-output");

  copyButton.addEventListener("click", function () {
    // Use the Clipboard API if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(jsonOutput.textContent).then(
        () => {
          showMessage("Copied to clipboard!", "success");
        },
        (err) => {
          console.error("Failed to copy: ", err);
        }
      );
    } else {
      // Fallback for older browsers
      const range = document.createRange();
      range.selectNode(jsonOutput);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      try {
        document.execCommand("copy");
        showMessage("Copied to clipboard!", "success");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }

      selection.removeAllRanges();
    }
  });

  if (editButton) {
    editButton.addEventListener("click", function () {
      if (editButton.textContent === "Edit") {
        // Switch to Edit mode
        editButton.textContent = "Save";
        jsonOutputTextarea.removeAttribute("readonly");
        jsonOutputTextarea.style.backgroundColor = "#fff";
        jsonOutputTextarea.style.border = "1px solid #ccc";
        jsonOutputTextarea.style.padding = "10px";
      } else {
        // Switch to Save mode
        editButton.textContent = "Edit";
        jsonOutputTextarea.setAttribute("readonly", true);
        jsonOutputTextarea.style.backgroundColor = "#f5f5f5";
        jsonOutputTextarea.style.border = "none";
        jsonOutputTextarea.style.padding = "0";
        try {
          const updatedJson = JSON.parse(jsonOutputTextarea.value);
          if (validateJSON(updatedJson)) {
            loadJSONData(updatedJson);
            showMessage("JSON data updated!", "success");
          } else {
            showMessage("Invalid JSON data.", "error");
          }
        } catch (e) {
          console.error("JSON parsing error: ", e);
          showMessage("Invalid JSON data.", "error");
        }
      }
    });
  } else {
    console.error("Edit button not found!");
  }

  function validateJSON(jsonObject) {
    // Basic validation to check if the JSON structure is correct
    if (typeof jsonObject !== "object" || jsonObject === null) {
      return false;
    }
    const strategyName = Object.keys(jsonObject)[0];
    if (!strategyName || typeof jsonObject[strategyName] !== "object") {
      return false;
    }
    const data = jsonObject[strategyName];
    if (!data.class || !data.universe || !Array.isArray(data.filters)) {
      return false;
    }
    return true;
  }

  function loadJSONData(jsonObject) {
    // Clear existing filters
    document.getElementById("filters-section").childNodes.forEach((o) => {
      if (o.id !== "filter-default") {
        o.remove();
      }
    });
    customFiltersContainer.innerHTML = "";

    if (jsonObject) {
      const strategyName = Object.keys(jsonObject)[0];
      const data = jsonObject[strategyName];

      strategyInput.value = strategyName;
      universeSelect.value = data.universe;
      classSelect.value = data.class;
      classSelect.dispatchEvent(new Event("change"));

      // Handle regular filters
      data.filters.forEach((filter) => {
        if (filter.filter) {
          // Add regular filters
          const filterDiv = filterDefaultDiv.cloneNode(true);
          filterDiv.id = "filter-" + new Date().getTime();
          filterDiv.style.display = "block";

          const selectEl = filterDiv.querySelector("select");
          selectEl.value = settings.filters.find(
            (f) => f.class === filter.filter
          ).label;
          selectEl.dispatchEvent(new Event("change"));

          filter.options &&
            Object.keys(filter.options).forEach((key) => {
              const inputEl = filterDiv.querySelector(`[name=${key}]`);
              if (inputEl) {
                inputEl.value = filter.options[key];
              }
            });

          const deleteButton = document.createElement("button");
          deleteButton.innerText = "Delete";
          deleteButton.className = "form-button delete";
          deleteButton.style.marginLeft = "10px";
          deleteButton.type = "button";
          deleteButton.onclick = () => {
            filterDiv.remove();
            showMessage("Filter deleted.", "info");
          };
          filterDiv.appendChild(deleteButton);

          filtersSection.prepend(filterDiv);
        } else if (filter.filter === "") {
          // Add custom filters
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

          const customFilterName = customFilterDiv.querySelector(
            ".custom-filter-name"
          );
          const customCalendarSelect = customFilterDiv.querySelector(
            ".custom-calendar-select"
          );
          const customLookUpWindow = customFilterDiv.querySelector(
            ".custom-look-up-window"
          );
          const customReturnSize = customFilterDiv.querySelector(
            ".custom-return-size"
          );

          customFilterName.value = filter.filter;
          customCalendarSelect.value = filter.options.calendar_name;
          customLookUpWindow.value = filter.options.lookup_window;
          customReturnSize.value = filter.options.return_size;

          customFilterDiv.querySelector(".remove-custom-filter").onclick =
            () => {
              customFilterDiv.remove();
              showMessage("Custom filter removed.", "info");
            };

          customFiltersContainer.appendChild(customFilterDiv);
        }
      });
    }
  }
});
