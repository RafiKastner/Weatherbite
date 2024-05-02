const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at ${port}`));
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
    response.json(data)
});

app.get('/weather/:latlon', async (request, response) => {
    console.log(request)
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat,lon);
    const api_url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${process.env.API_KEY}`
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});
