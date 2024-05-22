const express = require('express');
const cors = require('cors');
const Datastore = require('nedb');
import('node-fetch');
const path = require('path');
require('dotenv').config();

//const { MongoClient } = require('mongodb');
const url = `mongodb+srv://rafikastner:${process.env.MONGODB_PASS}>@weatherbite.hasmell.mongodb.net/?retryWrites=true&w=majority&appName=Weatherbite`;
//const client = new MongoClient(url);

const app = express();
const port = process.env.PORT || 3000;
console.log(port);
app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static(process.env.EXPRESS_DIRECTORY));
const whitelist = process.env.CORS_WHITELIST;
var corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== 1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/', (req, res) => {res.json({ message : 'Server up and running'})});

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        response.json(data);
    })
});

app.post('/api', (request, response) => {
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

app.get('/weather/:latlon', async (request, response) => {
    console.log(request);
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat,lon);
    const api_url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${process.env.API_KEY}`
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});