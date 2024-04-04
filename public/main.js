const page = "/logs/index.html";
const submit = document.getElementById("submit");
const globals = {}

if ("geolocation" in navigator) {
        console.log("geolocation available")
        position();
} else {
        console.log("geolocation not available");
}

submit.addEventListener('click', async event => {
    position().then(({lat, lon}) => {
        data(lat, lon);
    })
})

function position() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            document.getElementById("latitude").textContent = lat;
            document.getElementById("longitude").textContent = lon;
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