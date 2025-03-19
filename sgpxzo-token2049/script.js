document.addEventListener("DOMContentLoaded", function () {
  function isMobile() {
    return window.innerWidth <= 768;
  }

  mapboxgl.accessToken =
    "pk.eyJ1Ijoia3VzaGFsem8iLCJhIjoiY20wcDZtNjUwMDFxNzJpcjYxZjlsN2g3NiJ9.d194ACznKNqKJNfzKyanNQ";

  const initialZoom = isMobile() ? 12.5 : 18.5;
  const initialCenter = [-122.40119962635396, 37.781759273685715]; // [longitude, latitude]37.781759273685715, -122.40119962635396

  const map = new mapboxgl.Map({
    container: "map",
    center: initialCenter,
    zoom: initialZoom,
    pitch: 60, // Add a 45-degree pitch
    bearing: -30, // Rotate the map slightly
  });

  map.on("style.load", () => {
    map.setConfigProperty("basemap", "lightPreset", "night");
    map.setConfigProperty("basemap", "showPointOfInterestLabels", false);
    map.setConfigProperty("basemap", "showPlaceLabels", false);
    map.setConfigProperty("basemap", "showRoadLabels", false);
    map.setConfigProperty("basemap", "showTransitLabels", false);

    // Add 3D building layer
    map.addLayer({
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#aaa",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": 0.6,
      },
    });
  });

  map.addControl(new mapboxgl.NavigationControl());

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

  function addMarkersAndListItems(data) {
    const eventList = document.getElementById("event-list");
    let activeMarker = null;

    Papa.parse(data, {
      header: true,
      complete: function (results) {
        results.data.forEach(function (row) {
          if (row.Latitude && row.Longitude) {
            const marker = new mapboxgl.Marker()
              .setLngLat([parseFloat(row.Longitude), parseFloat(row.Latitude)])
              .addTo(map);

            const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${row.Latitude},${row.Longitude}`;
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

            const popup = new mapboxgl.Popup()
              .setLngLat(marker.getLngLat())
              .setHTML(popupContent);

            marker.setPopup(popup);

            const listItem = document.createElement("li");
            listItem.className = "event-item";
            listItem.innerHTML = `
              <h3>${row["Event Name"] || "N/A"}</h3>
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
            `;
            eventList.appendChild(listItem);

            listItem.addEventListener("click", function (e) {
              if (e.target.tagName !== "A") {
                map.flyTo({
                  center: [parseFloat(row.Longitude), parseFloat(row.Latitude)],
                  zoom: 15,
                });
                popup.addTo(map);
              }
            });
          }
        });
      },
    });
  }

  fetch("events_data.csv")
    .then((response) => response.text())
    .then((data) => addMarkersAndListItems(data));

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
        listContainer.style.display = "flex";
        mapContainer.style.display = "none";
      } else {
        mapContainer.style.display = "block";
        listContainer.style.display = "none";
        map.resize();
      }
    }
  });

  function setInitialView() {
    if (isMobile()) {
      listContainer.style.display = "flex";
      mapContainer.style.display = "none";
      document
        .querySelector('.tab-button[data-view="list"]')
        .classList.add("active");
      document
        .querySelector('.tab-button[data-view="map"]')
        .classList.remove("active");
    } else {
      listContainer.style.display = "flex";
      mapContainer.style.display = "block";
    }
    map.resize();
  }

  setInitialView();
  window.addEventListener("resize", setInitialView);
});
