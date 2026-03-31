const boroughData = {
  Manhattan: {
    description: "Manhattan is the densest borough and the financial and cultural core of NYC.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/69/Luchtfoto_van_Lower_Manhattan.jpg",
    population: "1.63 million",
    parks: "250+ parks",
    bikeLanes: "80 miles"
  },
  Brooklyn: {
    description: "Brooklyn is known for culture, food, and iconic neighborhoods.",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/00/Brooklyn_Bridge_Manhattan.jpg",
    population: "2.6 million",
    parks: "300+ parks",
    bikeLanes: "140 miles"
  },
  Queens: {
    description: "Queens is the most diverse borough in NYC.",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/db/Queensboro_Bridge_New_York_October_2016_003.jpg",
    population: "2.3 million",
    parks: "275+ parks",
    bikeLanes: "120 miles"
  },
  Bronx: {
    description: "The Bronx is home to Yankee Stadium and large green spaces.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Bronx_Zoo_001.jpg",
    population: "1.47 million",
    parks: "100+ parks",
    bikeLanes: "75 miles"
  },
  "Staten Island": {
    description: "Staten Island is quieter and known for waterfront views.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/39/Look_out_point_%28cropped%29.jpg",
    population: "495,000",
    parks: "170+ parks",
    bikeLanes: "50 miles"
  }
};

const map = L.map("map", {
  scrollWheelZoom: false
}).setView([40.7128, -74.0060], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

setTimeout(() => {
  map.invalidateSize();
}, 100);

let selectedLayer = null;
let boroughLayer;

function updateInfoPanel(name) {
  const info = boroughData[name];
  if (!info) return;

  document.getElementById("borough-name").textContent = name;
  document.getElementById("borough-description").textContent = info.description;
  document.getElementById("stat-population").textContent = info.population;
  document.getElementById("stat-parks").textContent = info.parks;
  document.getElementById("stat-bikeLanes").textContent = info.bikeLanes;

  const img = document.getElementById("borough-image");
  img.src = info.image;
  img.alt = name + " photo";
  img.style.display = "block";
}

fetch("https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/NYC_Borough_Boundary/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=pgeojson")
  .then(response => response.json())
  .then(data => {
    boroughLayer = L.geoJSON(data, {
      style: function () {
        return {
          color: "#222",
          weight: 2,
          fillColor: "#4f81bd",
          fillOpacity: 0.55
        };
      },

      onEachFeature: function (feature, layer) {
        layer.on({
          click: function () {
            const name =
              feature.properties.boro_name ||
              feature.properties.BoroName ||
              feature.properties.name ||
              "Unknown Borough";

            updateInfoPanel(name);

            if (selectedLayer) {
              boroughLayer.resetStyle(selectedLayer);
            }

            selectedLayer = layer;
            layer.setStyle({
              fillOpacity: 0.85,
              weight: 3
            });

            layer.bringToFront();
          },

          mouseover: function () {
            if (layer !== selectedLayer) {
              layer.setStyle({
                fillOpacity: 0.75
              });
            }
          },

          mouseout: function () {
            if (layer !== selectedLayer) {
              boroughLayer.resetStyle(layer);
            }
          }
        });
      }
    }).addTo(map);

    map.fitBounds(boroughLayer.getBounds());
  })
  .catch(error => console.log("GeoJSON load error:", error));

function setTheme(theme) {
  const body = document.body;
  const infoBox = document.getElementById("info-box");

  if (theme === "classic") {
    body.style.background = "#f5f5f5";
    infoBox.style.background = "white";
    infoBox.style.color = "#111";
  }

  if (theme === "dark") {
    body.style.background = "#1f1f1f";
    infoBox.style.background = "#2c2c2c";
    infoBox.style.color = "white";
  }

  if (theme === "pastel") {
    body.style.background = "#fdf1f7";
    infoBox.style.background = "#fff8dc";
    infoBox.style.color = "#333";
  }
}