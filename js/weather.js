// const WEATHER_API_KEY = "15e0931995b169c8e56540d7b20307fd"
const WEATHER_API_KEY = "dcf8126732b527f0b0368733a434a0cc";
let btnSearch = $("#btnSearch");
let txtDestination = $("#toInput");
let datepickerDepart = $("#datepickerDepart");
let datepickerReturn = $("#datepickerReturn");
let weatherInfoDiv = $("#weatherInfoDiv");
let weatherData = [];
let dateSelected = "";

$(document).ready(function() {
  $("#datepickerDepart").change(function() {
    dateSelected = new Date(this.value);
    let destination = txtDestination.val();

    accessCityDetails(destination, function(data) {
      let weatherSummary = weatherData[3].substring(
        0,
        weatherData[3].length - 1
      );

      let imgpath = "images/wi-day-sunny.png";

      if (weatherData[1] == "clear-day") {
        imgpath = "images/sun.svg";
      } else if (weatherData[1] == "clear-day") {
        imgpath = "images/rain.svg";
      } else if (weatherData[1] == "partly-cloudy-day") {
        imgpath = "images/partly-cloudy.svg";
      } else if (weatherData[1] == "cloudy") {
        imgpath = "images/cloud.svg";
      } else if (weatherData[1] == "snow") {
        imgpath = "images/snow.svg";
      } else if (weatherData[1] == "sleet") {
        imgpath = "images/day-sleet.svg";
      } else if (weatherData[1] == "wind") {
        imgpath = "images/windy.svg";
      } else if (weatherData[1] == "fog") {
        imgpath = "images/foggy.svg";
      } else if (weatherData[1] == "thunderstorm") {
        imgpath = "images/storm.svg";
      } else {
        imgpath = "images/partly-cloudy.svg";
      }
      let weatherInfo = `<div id="weatherForecastDiv" class="jumbotron">
                                        <h2 align='center'>weather forecast for your trip</h2>
                                        <div class="row">
                                            <div class='col-sm'>
                                                <img src='${imgpath}' height='200px' width='200px'>
                                            </div>
                                            <div class='col-lg'>
                                                <br/>
                                                <h4>${dateSelected.toUTCString()}</h4>
                                                <br/>
                                                <h4><img src="images/temp.png" height='20px' width='20px'></img>Temperature:${
                                                  weatherData[2]
                                                }<small>&nbspin celcius</small></h4>
                                                <br/>
                                                <p><h5>${weatherSummary} when you land in <b>${destination}.</b></h5></p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>`;
      weatherInfoDiv.html(weatherInfo);
    });
  });
});
// variable cityString = city of destination
function accessCityDetails(cityString, getCityDetails) {
  fetch(
    "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityString
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      getCityLocation(json, getCityDetails);
    });
}

function getCityLocation(cityObj, getCityDetails) {
  let latitude = cityObj.results[0].geometry.location.lat;
  let longitude = cityObj.results[0].geometry.location.lng;
  getWeatherData(latitude, longitude, getCityDetails);
}

function getWeatherData(lat, long, getCityDetails) {
  let dateSelectedMS = dateSelected.getTime();
  let dateSelectedTime = Math.round(dateSelectedMS / 1000);
  let base_url = "https://api.darksky.net/forecast/";
  let searchQuery =
    base_url +
    WEATHER_API_KEY +
    "/" +
    lat +
    "," +
    long +
    "," +
    dateSelectedTime;

  fetch(searchQuery)
    .then(function(response) {
      console.log(response);
      return response.json();
    })
    .then(function(json) {
      weatherData = [];
      weatherData.push(dateSelectedTime);
      weatherData.push(json.daily.data[0].icon);
      weatherData.push(json.daily.data[0].temperatureHigh);
      weatherData.push(json.daily.data[0].summary);

      getCityDetails(weatherData);
    })
    .catch(function(ex) {
      console.log(ex);
    });
}
