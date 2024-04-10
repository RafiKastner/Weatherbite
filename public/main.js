const page = "/logs/index.html";
const submit = document.getElementById("submit");

const date = new Date()
const dateTable = date.toString().match(/\b(\w+)\b/g)
document.getElementById("date").textContent = `${dateTable[0]} ${dateTable[1]} ${dateTable[2]}`;

if ("geolocation" in navigator) {
    console.log("geolocation available")
    position();
    submit.addEventListener('click', async event => {
        position().then(({lat, lon}) => {
            data(lat, lon);
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
            const api_url = `/weather/${lat},${lon}`;
            const response = await fetch(api_url);
            const json = await response.json();
            console.log(json)
            console.log(date)

            const path = json.timelines.minutely[0].values;
            
            const weatherJson = await fetch("weathercodes.json");
            const weatherCodesJson = await weatherJson.json();
            const weatherCode = path.weatherCode;
            let weather;

            for (i in weatherCodesJson.weatherCode) {
                if (weatherCode == i) {
                    weather = weatherCodesJson.weatherCode[i];
                }
            }
            
            document.getElementById("summary").textContent = weather.toLowerCase();

            const temperature = path.temperature;
            document.getElementById("temperature").textContent = temperature;
            resolve({lat, lon});
        })
    })
}

async function data(lat, lon) {
    const data = {lat, lon}
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    const response = await fetch('/api', options);
    const json = await response.json();
}