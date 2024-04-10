const page = "/logs/index.html";
const submit = document.getElementById("submit");

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
            //&apikey=R0w2hiuMUFGLlOlKPxiNnf6b45UahENy
            const response = await fetch(api_url);
            const json = await response.json();
            console.log(json)
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