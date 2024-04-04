const page = "/logs/index.html";
const submit = document.getElementById("submit");
const globals = {}

if ("geolocation" in navigator) {
        console.log("geolocation available")
        position();
} else {
        console.log("geolocation not available");
}

function setup() {      
    noCanvas();
    const video = createCapture(VIDEO)
    video.size(320,240);
    submit.addEventListener('click', async event => {
        position().then(({lat, lon}) => {
            video.loadPixels()
            const image = video.canvas.toDataURL();
            console.log(image);
            data(lat, lon, image);
        })
    })
}

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

async function data(lat, lon, image) {
    const data = {lat, lon, image}
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    const response = await fetch('/api', options);
    const json = await response.json();
    console.log(json)
}