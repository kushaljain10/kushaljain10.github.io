document.addEventListener("DOMContentLoaded", function () {
  // Initialize the map
  const map = L.map("map").setView([1.3521, 103.8198], 13);

  // Add the Mapbox tile layer
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken:
        "pk.eyJ1Ijoia3VzaGFsem8iLCJhIjoiY20wcDZtNjUwMDFxNzJpcjYxZjlsN2g3NiJ9.d194ACznKNqKJNfzKyanNQ",
    }
  ).addTo(map);

  // Add custom icon
  const customIcon = L.icon({
    iconUrl: "./icon.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

  // Function to parse CSV data and add markers
  function addMarkersFromCSV(data) {
    Papa.parse(data, {
      header: true,
      complete: function (results) {
        results.data.forEach(function (row) {
          if (row.Latitude && row.Longitude) {
            const marker = L.marker(
              [parseFloat(row.Latitude), parseFloat(row.Longitude)],
              { icon: customIcon }
            ).addTo(map);

            // Create popup content with the new Link field
            const popupContent = `
                            <strong>${row.Location}</strong><br>
                            Event Name: ${row["Event Name"] || "N/A"}<br>
                            Date & Time: ${row["Date & Time"] || "N/A"}<br>
                            Price: ${row["Price"] || "N/A"}
                            ${
                              row.Link
                                ? `<br><a href="${row.Link}" target="_blank">Event Registration</a>`
                                : ""
                            }
                        `;

            marker.bindPopup(popupContent);
          }
        });
      },
    });
  }

  // Load the CSV file and add markers
  fetch("events_data.csv")
    .then((response) => response.text())
    .then((data) => addMarkersFromCSV(data));
});
