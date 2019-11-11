const fetch = require('node-fetch');
const config = require('../config');

//get json response from AccuWeather
const getAccuWeatherResponse = async () => {
  const response = await fetch(config.service_endpoint);
  const json = await response.json();
  return json;
};

//check if its going to rain
const checkForRain = async () => {
  const data = await getAccuWeatherResponse();
  const weatherForecast = data[0].IconPhrase.toLowerCase();
  const isGoingToRain = data[0].HasPrecipitation;
  const temp = data[0].Temperature.UnitType;

  if (isGoingToRain === true) {
    return `. Expect ${temp} degrees celcius and ${weatherForecast} within the next hour. Don't forget the umbrella!`;
  } else {
    return `. Expect ${temp} degrees celcius and ${weatherForecast} within the next hour. Have a good day!`;
  }
};

//main Azure Functions function
module.exports = async function(context, req) {
  const result = await checkForRain();

  if (req.query.name || (req.body && req.body.name)) {
    context.res = {
      body: 'Hello ' + (req.query.name || req.body.name) + result
    };
  } else {
    context.res = {
      status: 400,
      body: 'Please pass your name on the query string or in the request body'
    };
  }
};
