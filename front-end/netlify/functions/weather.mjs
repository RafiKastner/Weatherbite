export default async (req, context) => {
    try {
        console.log(req);
        const latlon = req.queryStringParameters.cords.split(',');
        const lat = latlon[0];
        const lon = latlon[1];
        console.log(lat,lon);
        const api_url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${process.env.API_KEY}`
        const fetch_response = await fetch(api_url);
        const json = await fetch_response.json();
        return json
    } catch (error) {
        console.log('error', error);
        return {
            statusCode: 500,
            body: error.toString()
        };
    };
};