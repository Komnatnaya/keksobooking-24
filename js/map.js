import { getCardNode } from './card.js';

const address = document.querySelector('#address');
const POINT_OF_CENTER = {
  lat: 35.68940,
  lng: 139.69200,
};
const MAP_ZOOM = 12;
let map = null;
let markerGroup = null;
const ICON_SIZE = {
  width: 40,
  height: 40,
};
const MAIN_ICON_SIZE = {
  width: 52,
  height: 52,
};
const DIGITS = 5;

const similarIcon = L.icon({
  iconUrl: '../img/pin.svg',
  iconSize: [ICON_SIZE.width, ICON_SIZE.height],
  iconAnchor: [ICON_SIZE.width / 2, ICON_SIZE.height],
});

const mainIcon = L.icon({
  iconUrl: '../img/main-pin.svg',
  iconSize: [MAIN_ICON_SIZE.width, MAIN_ICON_SIZE.height],
  iconAnchor: [MAIN_ICON_SIZE.width / 2, MAIN_ICON_SIZE.height],
});

const mainMarker = L.marker(
  {
    lat: POINT_OF_CENTER.lat,
    lng: POINT_OF_CENTER.lng,
  },
  {
    draggable: true,
    icon: mainIcon,
  },
);

const createMap = (successCallback) => {
  map = L.map('map-canvas')
    .on('load', () => {
      successCallback();
      address.value = `${POINT_OF_CENTER.lat.toFixed(DIGITS)}, ${POINT_OF_CENTER.lng.toFixed(DIGITS)}`;
    })
    .setView({
      lat: POINT_OF_CENTER.lat,
      lng: POINT_OF_CENTER.lng,
    }, MAP_ZOOM);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);

  mainMarker.on('move', (evt) => {
    address.value = evt.target.toGeoJSON().geometry.coordinates
      .map((coordinate) => coordinate.toFixed(DIGITS))
      .reverse()
      .join(', ');
  });

  mainMarker.addTo(map);
};

const addSimilarMarkers = (housings) => {
  markerGroup = L.layerGroup().addTo(map);

  housings.forEach((housing) => {
    const marker = L.marker(
      {
        lat: housing.location.lat,
        lng: housing.location.lng,
      },
      {
        icon: similarIcon,
      },
    );

    marker
      .addTo(markerGroup)
      .bindPopup(getCardNode(housing));
  });
};

const removeSimilarMarkers = () => {
  markerGroup.clearLayers();
};

export { createMap, addSimilarMarkers, removeSimilarMarkers };
