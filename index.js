const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        response.json(data);
    })
});

app.post('/api', (request, response) => {
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now()
    data.timestamp = timestamp;
    database.insert(data);
    response.json({
        status : 'success',
        latitude: data.lat,
        longitude : data.lon,
    })
});

app.get('/weather/:latlon', async (request, response) => {
    console.log(request)
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat,lon);
    const api_url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=R0w2hiuMUFGLlOlKPxiNnf6b45UahENy`
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});
