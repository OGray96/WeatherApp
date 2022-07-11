
var additionalInfoUrl;

var searchButton = $('.search-button');

var currentDay = moment().format("DD/M/YYYY");

var weather = $('.weather-container')

console.log(currentDay)

var citySearches = JSON.parse(localStorage.getItem("Cities")) ||[];

var city;

var ids=[];

var savedCitiesArray;



searchButton.on('click', function(event){
    event.preventDefault();
    weather.empty();
    $('.5-day-forecast').empty();
    var city = $('.search-bar').val();


    weatherDetails(city);
    createButton(city)
})


function weatherDetails(city){


    var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=c8503ee4bda8db1588a020ed5fae1015'

    console.log(weatherApiUrl)
    fetch(weatherApiUrl)
        .then(function(response){
            return response.json();
        })
            .then(function(data){
                lat = data.coord.lat;
                lon = data.coord.lon;
                var cityName = $('<h3>');
                var currentTemp = $('<p>');
                var currentWind = $('<p>');
                var currentHumidity = $('<p>');
                var currentUV = $('<p>');

                cityName.text(city +' (' + currentDay + ')')
                currentTemp.text("Temp: " + data.main.temp + " C");
                currentWind.text("Wind: " + data.wind.speed + " KPH");
                currentHumidity.text("Humidity: " + data.main.humidity + "%");
                currentUV.text();


                weather.append(cityName);
                weather.append(currentTemp);
                weather.append(currentWind);
                weather.append(currentHumidity);
                weather.append(currentUV);
                var additionalInfoUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ lat + '&lon=' + lon + '&units=metric&appid=c8503ee4bda8db1588a020ed5fae1015'
                console.log(additionalInfoUrl)
                    fetch(additionalInfoUrl)
                        .then(function(response){
                            return response.json();
                            })
                                .then(function(data){
                                    console.log(data);
                                    uvIndex = data.cu
                                    currentUV.text("UV Index: " + data.current.uvi)
                                    if(data.current.uvi < 4){
                                        currentUV.attr('style','background-color: green')
                                    } 
                                    else if(data.current.uvi < 8){
                                        currentUV.attr('style','background-color: yellow')
                                    }
                                    else{
                                        currentUV.attr('style','background-color: red')
                                    }

                                    for(i=0; i < 4; i++){


                                        weatherTable = $('<table>');
                                        tableDateTR = $('<tr>');
                                        tableDateTH = $('<th>');
                                        tableDateTH.text(moment().add(i+1,'days').format("DD/M/YYYY"));

                                        tableIconTR = $('<tr>');
                                        tableIconTH = $('<i>');
                                        tableIconTH.text(data.daily[i].weather[0].icon)

                                        tableTempTR = $('<tr>');
                                        tableTempTH = $('<th>');
                                        tableTempTH.text("Temp: " + data.daily[i].temp.day);

                                        tableWindTR = $('<tr>');
                                        tableWindTH = $('<th>');
                                        tableWindTH.text("Wind: " + data.daily[i].wind_speed);

                                        tableHumidityTR = $('<tr>');
                                        tableHumidityTH = $('<th>');
                                        tableHumidityTH.text("Humidity: " + data.daily[i].humidity);


                                        tableTempTH.attr('style','font-weight:normal')
                                        tableWindTH.attr('style','font-weight:normal')
                                        tableHumidityTH.attr('style','font-weight:normal')
                                       


                                        weatherTable.attr('style', 'padding-left:30px; height:100px');



                                        $('.5-day-forecast').append(weatherTable)
                                        $('.5-day-forecast').attr('style','display:flex; margin-left:270px');

                                        weatherTable.append(tableDateTR);
                                        weatherTable.append(tableIconTR)
                                        weatherTable.append(tableTempTR);
                                        weatherTable.append(tableWindTR);
                                        weatherTable.append(tableHumidityTR);

                                        tableDateTR.append(tableDateTH);
                                        tableTempTR.append(tableTempTH);
                                        tableWindTR.append(tableWindTH);
                                        tableHumidityTR.append(tableHumidityTH);
                                        tableIconTR.append(tableIconTH);
                                    }

                                })
            })
}


function init(){

    var savedCitiesArray = JSON.parse(localStorage.getItem('Cities'))
    if(savedCitiesArray){
        for(var i=0; i<savedCitiesArray.length; i++ ){
            locationButton = $('<button>');
            locationButton.attr('class','location-button')
            locationButton.attr('id', savedCitiesArray[i].cities)
            locationButton.text(savedCitiesArray[i].cities);
            $('.search-history').append(locationButton);
        }
    }
}


$(document).on('click', '.location-button', function(event){
    citySearchButtonText = $(this).text();
    event.preventDefault();
    weather.empty();
    $('.5-day-forecast').empty();
    weatherDetails(citySearchButtonText);
    
    

}
)


function createButton(city){

    var checkArray = JSON.parse(localStorage.getItem('cities'))
    var checks = [];

  

    locationButton = $('<button>')
    locationButton.text(city)
    locationButton.attr('class', 'location-button city')
    locationButton.attr('id', city)
    $('.search-history').append(locationButton);

    savedCities = {
        cities: city
    }
    
    citySearches.push(savedCities)
    console.log(citySearches);
    localStorage.setItem('Cities', JSON.stringify(citySearches))
}


init();