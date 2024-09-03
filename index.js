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

          const universeOption = document.createElement("option");
          universeOption.value = selectedStrategyData.universe;
          universeOption.textContent = selectedStrategyData.universe;
          universeSelect.appendChild(universeOption);

          classSelect.disabled = true;
          classSelect.innerHTML =
            '<option value="" disabled selected>Select Class</option>';
          filtersButton.style.display = "none";
          filtersSection.style.display = "none";
          filterOptionsDiv.innerHTML = "";
          detailsDiv.innerHTML = "";
        }
      });

      universeSelect.addEventListener("change", function () {
        if (selectedStrategyData) {
          classSelect.disabled = false;
          classSelect.innerHTML =
            '<option value="" disabled selected>Select Class</option>';

          const classOption = document.createElement("option");
          classOption.value = selectedStrategyData.class || "N/A";
          classOption.textContent = selectedStrategyData.class || "N/A";
          classSelect.appendChild(classOption);
        }
      });

      classSelect.addEventListener("change", function () {
        const selectedClassValue = this.value.trim().toLowerCase();

        if (selectedClassValue === "none") {
          filtersSection.style.display = "block";
          filtersButton.style.display = "none";
          detailsDiv.innerHTML = "";
        } else if (
          !selectedClassValue ||
          selectedClassValue === "select class"
        ) {
          filtersSection.style.display = "none";
          filtersButton.style.display = "none";
          detailsDiv.innerHTML = "";
        } else {
          filtersSection.style.display = "none";
          filtersButton.style.display = "none";
          detailsDiv.innerHTML = `
            <h2>Details for ${strategySelect.value}</h2>
            <p><strong>Class:</strong> ${
              selectedStrategyData.class || "N/A"
            }</p>
            <p><strong>Universe:</strong> ${selectedStrategyData.universe}</p>
          `;
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching strategy data:", error);
    });
});
