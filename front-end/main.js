const page = "/logs/index.html";
const submit = document.getElementById("submit");
let server_url = 'https://weatherbite.netlify.app'; 
if (window.location.hostname === 'localhost') {
    server_url = ''
}

const date = new Date()
const dateTable = date.toString().match(/\b(\w+)\b/g)
document.getElementById("date").textContent = `${dateTable[0]} ${dateTable[1]} ${dateTable[2]}`;

if ("geolocation" in navigator) {
    console.log("geolocation available")
    position();
} else {
    console.log("geolocation not available");
}

function position() {
    return new Promise(async (resolve) => {
        const api_url = `${server_url}/.netlify/functions/weather`
        const response = await fetch(api_url);
        const json = await response.json();
        console.log(json)
        const path = json.timelines.minutely[0].values;
        const weatherFetch = await fetch("weathercodes.json");
        const weatherCodesJson = await weatherFetch.json();

        const weatherCode = path.weatherCode;
        let weather;
        for (i in weatherCodesJson.weatherCode) {
            if (weatherCode == i) {
                weather = weatherCodesJson.weatherCode[i];
            }
        }    
        document.getElementById("summary").textContent = weather.toLowerCase();
        const temperature = path.temperature;
        const fahrenheit = toFahrenheit(temperature);

        const lat = json.context.geo.latitude
        const lon = json.context.geo.longitude
        document.getElementById("latitude").textContent = lat;
        document.getElementById("longitude").textContent = lon;

        document.getElementById("temperature").textContent = fahrenheit;
        data = {lat, lon, temperature, fahrenheit, weather};
        resolve(data);
    })
}

function toFahrenheit(temp) {
    const places = 100
    const f = temp * 9 / 5 + 32 
    return Math.round(f * places)/places;
}