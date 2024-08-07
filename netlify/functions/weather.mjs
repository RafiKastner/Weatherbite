const fs = require('fs')

export default async (event, context) => {
    try {
        const lat = context.geo.latitude;
        const lon = context.geo.longitude;
        const api_url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${process.env.TOMORROW_IO_KEY}`
        const fetch_response = await fetch(api_url);
        const json = await fetch_response.json();
        json.context = context;
        
        return Response.json(json)
    } catch (error) {
        console.log('error', error);
        return {
            statusCode: 500,
            body: error.toString()
        };
    };
};