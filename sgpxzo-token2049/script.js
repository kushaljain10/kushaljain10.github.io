document.addEventListener("DOMContentLoaded", function () {
  // Function to check if the device is mobile
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Adjust initial view based on screen size
  const initialZoom = isMobile() ? 12.5 : 13.5; // Decreased from 14 and 15 to 13 and 14 respectively
  const initialCenter = [1.3067, 103.8518]; // Coordinates for Little India, Singapore

  // Initialize the map
  const map = L.map("map").setView(initialCenter, initialZoom);

  // Change the map style to dark theme with custom road color
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "kushalzo/cm0pf5vgu00ey01pjha8rg45a", // Make sure this is the correct ID for your updated style
      accessToken:
        "pk.eyJ1Ijoia3VzaGFsem8iLCJhIjoiY20wcDZtNjUwMDFxNzJpcjYxZjlsN2g3NiJ9.d194ACznKNqKJNfzKyanNQ",
    }
  ).addTo(map);

  // Add custom icon
  const customIcon = L.divIcon({
    html: `
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#FF4545" stroke="#ffffff" stroke-width="4"/>
        <circle cx="20" cy="20" r="8" fill="#ffffff"/>
      </svg>
    `,
    className: "custom-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // Add this helper function at the top of your script
  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date
      .toLocaleDateString("en-US", options)
      .replace(",", "")
      .replace(" at", "•");
  }

  // Function to parse CSV data and add markers and list items
  function addMarkersAndListItems(data) {
    const eventList = document.getElementById("event-list");
    let activeMarker = null;

    Papa.parse(data, {
      header: true,
      complete: function (results) {
        results.data.forEach(function (row) {
          if (row.Latitude && row.Longitude) {
            // Add marker to the map
            const marker = L.marker(
              [parseFloat(row.Latitude), parseFloat(row.Longitude)],
              { icon: customIcon }
            ).addTo(map);

            // Create Google Maps directions link
            const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${row.Latitude},${row.Longitude}`;

            // Create popup content
            const formattedDateTime = formatDateTime(row["Date & Time"]);
            const popupContent = `
              <strong>${row["Event Name"] || "N/A"}</strong>
              <p>📍 ${row.Location || "N/A"}</p>
              <p>📅 ${formattedDateTime}</p>
              <p>💰 ${row["Price"] || "N/A"}</p>
              <div class="popup-buttons">
                ${
                  row.Link
                    ? `<a href="${row.Link}" target="_blank" class="popup-button">Registration Link</a>`
                    : ""
                }
                <a href="${directionsLink}" target="_blank" class="popup-button">Directions</a>
              </div>
            `;

            marker.bindPopup(popupContent);

            // Add this event listener to handle popup close
            marker.on("popupclose", function () {
              resetActiveMarker(activeMarker);
              activeMarker = null;
              // Remove active class from list items
              document
                .querySelectorAll(".event-item")
                .forEach((item) => item.classList.remove("active"));
            });

            // Add item to the list view
            const listItem = document.createElement("li");
            listItem.className = "event-item";
            listItem.innerHTML = `
              <div class="event-item-header">
                <h3>${row["Event Name"] || "N/A"}</h3>
                <span class="chevron">&#9662;</span>
              </div>
              <div class="event-item-content">
                <p>📍 ${row.Location || "N/A"}</p>
                <p>📅 ${formattedDateTime}</p>
                <p>💰 ${row["Price"] || "N/A"}</p>
                <div class="list-item-buttons">
                  ${
                    row.Link
                      ? `<a href="${row.Link}" target="_blank" class="list-button">Registration Link</a>`
                      : ""
                  }
                  <a href="${directionsLink}" target="_blank" class="list-button">Directions</a>
                </div>
              </div>
            `;
            eventList.appendChild(listItem);

            // Add click event for accordion functionality
            const header = listItem.querySelector(".event-item-header");
            const content = listItem.querySelector(".event-item-content");
            const chevron = listItem.querySelector(".chevron");

            header.addEventListener("click", function () {
              content.classList.toggle("active");
              chevron.classList.toggle("active");
            });

            // Modify the click event listener for the entire list item
            listItem.addEventListener("click", function (e) {
              if (
                e.target.closest(".event-item-header") ||
                e.target.tagName === "A"
              )
                return;

              map.setView(
                [parseFloat(row.Latitude), parseFloat(row.Longitude)],
                15
              );
              marker.openPopup();

              // Remove active class from previous marker
              if (activeMarker) {
                L.DomUtil.removeClass(activeMarker._icon, "active-marker");
                updateMarkerColor(activeMarker, false);
              }

              // Add active class to current marker
              L.DomUtil.addClass(marker._icon, "active-marker");
              updateMarkerColor(marker, true);
              activeMarker = marker;

              // Highlight the clicked item
              document
                .querySelectorAll(".event-item")
                .forEach((item) => item.classList.remove("active"));
              this.classList.add("active");

              // If on mobile, switch to the map view
              if (isMobile()) {
                setTimeout(() => {
                  document
                    .querySelector('.tab-button[data-view="map"]')
                    .click();
                }, 100);
              }
            });

            // Modify the marker click event
            marker.on("click", function () {
              resetActiveMarker(activeMarker);
              L.DomUtil.addClass(marker._icon, "active-marker");
              updateMarkerColor(marker, true);
              activeMarker = marker;

              // Highlight corresponding list item
              document
                .querySelectorAll(".event-item")
                .forEach((item) => item.classList.remove("active"));
              eventList.children[results.data.indexOf(row)].classList.add(
                "active"
              );

              // Ensure the popup opens on both mobile and desktop
              setTimeout(() => {
                marker.openPopup();
              }, 100);

              // If on mobile, switch to the map view
              if (isMobile()) {
                document.querySelector('.tab-button[data-view="map"]').click();
              }
            });
          }
        });
      },
    });
  }

  // Load the CSV file and add markers and list items
  fetch("events_data.csv")
    .then((response) => response.text())
    .then((data) => addMarkersAndListItems(data));

  function updateMarkerColor(marker, isActive) {
    const icon = marker.getElement().querySelector("svg");
    if (isActive) {
      icon.querySelector("circle:first-child").setAttribute("fill", "#4D4DFF");
    } else {
      icon.querySelector("circle:first-child").setAttribute("fill", "#FF4545");
    }
  }

  // Add this function at the top level of your script
  function resetActiveMarker(activeMarker) {
    if (activeMarker) {
      L.DomUtil.removeClass(activeMarker._icon, "active-marker");
      updateMarkerColor(activeMarker, false);
    }
  }

  // Add tab switching functionality
  const tabSwitcher = document.getElementById("tab-switcher");
  const listContainer = document.getElementById("list-container");
  const mapContainer = document.getElementById("map-container");

  tabSwitcher.addEventListener("click", function (e) {
    if (e.target.classList.contains("tab-button")) {
      const view = e.target.dataset.view;
      document
        .querySelectorAll(".tab-button")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      if (view === "list") {
        listContainer.style.display = "flex"; // Changed from "block" to "flex"
        mapContainer.style.display = "none";
      } else {
        mapContainer.style.display = "block";
        listContainer.style.display = "none";
        resizeMap();
      }
    }
  });

  // Function to set initial view based on device
  function setInitialView() {
    if (isMobile()) {
      listContainer.style.display = "none";
      mapContainer.style.display = "block";
      document
        .querySelector('.tab-button[data-view="list"]')
        .classList.remove("active");
      document
        .querySelector('.tab-button[data-view="map"]')
        .classList.add("active");
    } else {
      listContainer.style.display = "flex";
      mapContainer.style.display = "block";
    }
    resizeMap();
  }

  // Set initial view on page load
  setInitialView();

  // Update view on window resize
  window.addEventListener("resize", setInitialView);

  function resizeMap() {
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }

  // Add this function at the end of your script
  function updatePopupSize() {
    const popups = document.querySelectorAll(".leaflet-popup-content-wrapper");
    popups.forEach((popup) => {
      popup.style.width = isMobile() ? "90vw" : "400px";
    });
  }

  // Call updatePopupSize when the window is resized
  window.addEventListener("resize", updatePopupSize);

  // Call updatePopupSize after the map is loaded
  map.on("load", updatePopupSize);
});
