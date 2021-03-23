//Global Variables
var citySearch = document.getElementById("citySearch");
var searchBtn = document.getElementById("search-btn")
var currentCity = document.getElementById("currentCity");
var cityNameE = document.getElementById("cityNameE");
var currentDateE = document.getElementById("currentDateE");
var cityTempE = document.getElementById("cityTempE");
var cityHumidityE = document.getElementById("cityHumidityE");
var cityWindspeedE = document.getElementById("cityWindspeedE");
var cityUVE = document.getElementById("cityUVE");
//search button and city input
function inputSearchBtn () {
    let city = citySearch.value;
    findLatLon(city);
}
//local storage
function inputCityStorage (city) {
    localStorage.setItem(city, city);
}
//api call for city search
function findLatLon (city) {
    let key = 'cd9757a25f0b56fd1aaa0121fbcec723';
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key)
    .then(function(resp) {
        return resp.json();
    })
    .then(function(data) {
        if (data.cod == 404) alert('Invalid city name.'); 
        let cityLat = data.coord.lat;
        let cityLong = data.coord.lon;
        getWeather(cityLat, cityLong);
    })
    
}
//api call to find lat and long for city
function getWeather( lat, lon ) {
    let key = 'cd9757a25f0b56fd1aaa0121fbcec723';
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial' + '&appid=' + key )
    .then(function(resp) {
        return resp.json();
    })
    .then(function(data) {
        insertWeatherData(data);
    })
    inputCityStorage(citySearch.value);
    removeButtons();
    getStoredCities();
}
//weather data for city searched
function insertWeatherData(weather) {
    currentCity.innerHTML = citySearch.value;
    currentDateE.innerHTML = convertDate(weather.current.dt);
    cityTempE.innerHTML= weather.current.temp + "ºF";
    cityHumidityE.innerHTML = weather.current.humidity = "&percnt";
    cityWindspeedE.innerHTML = weather.current.wind_speed + "mph";
    cityUVE.innerHTML = weather.current.uvi;

    if (weather.current.uvi < 3) {
        cityUVE.classList.add('uvLow')
    } else if (weather.current.uvi > 9) {
        cityUVE.classList.add('uvHigh')
    } else {
        cityUVE.classList.add('uvOK')
    }
//html manipulation for date, imgage, temp, and humidity
    currentCity.innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.current.weather[0].icon + '@2x.png" alt="current weather">'
    document.getElementById('dayOne').innerHTML = convertDate(weather.daily[1].dt);
    document.getElementById('dayTwo').innerHTML = convertDate(weather.daily[2].dt);
    document.getElementById('dayThree').innerHTML = convertDate(weather.daily[3].dt);
    document.getElementById('dayFour').innerHTML = convertDate(weather.daily[4].dt);
    document.getElementById('dayFive').innerHTML = convertDate(weather.daily[5].dt);

    document.getElementById('dayOneImg').innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.daily[1].weather[0].icon + '.png" alt="weather forecast">';
    document.getElementById('dayTwoImg').innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.daily[2].weather[0].icon + '.png" alt="weather forecast">';
    document.getElementById('dayThreeImg').innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.daily[3].weather[0].icon + '.png" alt="weather forecast">';
    document.getElementById('dayFourImg').innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.daily[4].weather[0].icon + '.png" alt="weather forecast">';
    document.getElementById('dayFiveImg').innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.daily[5].weather[0].icon + '.png" alt="weather forecast">';

    document.getElementById('dayOneTemp').innerHTML = weather.daily[1].temp.day;
    document.getElementById('dayTwoTemp').innerHTML = weather.daily[2].temp.day;
    document.getElementById('dayThreeTemp').innerHTML = weather.daily[3].temp.day;
    document.getElementById('dayFourTemp').innerHTML = weather.daily[4].temp.day;
    document.getElementById('dayFiveTemp').innerHTML = weather.daily[5].temp.day;

    document.getElementById('dayOneHum').innerHTML = weather.daily[1].humidity;
    document.getElementById('dayTwoHum').innerHTML = weather.daily[2].humidity;
    document.getElementById('dayThreeHum').innerHTML = weather.daily[3].humidity;
    document.getElementById('dayFourHum').innerHTML = weather.daily[4].humidity;
    document.getElementById('dayFiveHum').innerHTML = weather.daily[5].humidity;

}
//for loop to add searched cities to local storage
function getStoredCities() {
    for( i = 0 ; i < localStorage.length && i < 12 ; i++) {
        let newListItem = document.createElement('button');
        newListItem.classList.add('btn', 'btn-lg', 'btn-block');
        newListItem.innerHTML = localStorage.key(i);
        currentCity.appendChild(newListItem);
        newListItem.addEventListener("click", function(){
            processClick(newListItem.innerHTML)}
        )
    }
}
//click function
function processClick( city ) {
    userInput.value = city;
    findLatLon(city);
}
//converts date code
function convertDate (datecode) {
    return new Date(datecode * 1000).toLocaleDateString();
}
//removes buttons
function removeButtons() {
    while (currentCity.firstChild) {
        currentCity.removeChild(currentCity.firstChild);
    }
}
//eventlisteners for clicks and keypress
searchBtn.addEventListener("click", inputSearchBtn);
citySearch.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') 
    inputSearchBtn(); 
});

document.onload = getStoredCities();
