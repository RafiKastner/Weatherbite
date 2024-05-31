const page = 'index.html'
const api_url = 'https://api.wheretheiss.at/v1/satellites/25544'
let server_url = 'https://weatherbite.onrender.com'; 
if (window.location.hostname === 'localhost') {
    server_url = ''
}
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
    const response = await fetch(`${server_url}/api`);
    const data = await response.json();
    console.log(data)
    for (item of data) {
        const marker = L.marker([item.lat, item.lon]).addTo(map);
        const text = `The weather at ${item.lat}&deg;, ${item.lat}&deg;
        is ${item.weather.toLowerCase()} with a temperature of ${item.fahrenheit} &deg;F.`
        marker.bindPopup(text);

        // { displaying info
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