const page = 'index.html'
const api_url = 'https://api.wheretheiss.at/v1/satellites/25544'
const bounds = L.latLngBounds(L.latLng(-85, Infinity), L.latLng(85, -Infinity));
const map = L.map('map', {
    minZoom: 2,
    maxBounds: bounds,
    maxBoundsViscosity: 1
}).setView([0,0],1);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

getData();
async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    console.log(data)
    for (item of data) {
        L.marker([item.lat, item.lon]).addTo(map);

        // {
        // const root = document.createElement('div');
        // const geo = document.createElement('div');
        // const date = document.createElement('div');
        
        // geo.textContent = `${item.lat}°, ${item.lon}°`;
        // const dateString = new Date(item.timestamp).toLocaleString();
        // date.textContent = dateString;

        // root.append(geo, date);
        // document.body.append(root);
        // }
    }
}