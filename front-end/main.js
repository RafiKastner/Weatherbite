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
    submit.addEventListener('click', async event => {
        position().then((data) => {
            sendData(data);
        })
    })
} else {
    console.log("geolocation not available");
}

function position() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            document.getElementById("latitude").textContent = lat;
            document.getElementById("longitude").textContent = lon;
            const api_url = `${server_url}/netlify/functions/weather.mjs?cords=${lat},${lon}`;
            const response = await fetch(api_url);
            comsolr.log('response; ',response)
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
            console.log(temperature);

            document.getElementById("temperature").textContent = fahrenheit;
            data = {lat, lon, temperature, fahrenheit, weather};
            resolve(data);
        })
    })
}

function toFahrenheit(temp) {
    const places = 100
    const f = temp * 9 / 5 + 32 
    return Math.round(f * places)/places;
}

async function sendData(data) {
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    const response = await fetch(`${server_url}/api`, options);
    const json = await response.json();
    console.log(json)
}