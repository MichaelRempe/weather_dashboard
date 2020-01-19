$(document).ready(function () {
    // INPUT FIELD DOM
    var inputField = $("#queryInput");
    var inputBTN = $("#queryBTN");
    // JUMBOTRON VALUES and DISPLAYS
    var cityDSP = $("#city");
    var timeDSP = $("#time");
    var tempDSP = $("#currentTemp");
    var humidityDSP = $("#currentHumidity");
    var wind_speedDSP = $("#currentWindSpeed");
    var uv_indexDSP = $("#currentUV");
    var iconDSP = $("#current_icon");
    //default jumbotron values
    var temp = "-";
    var humidity = "-";
    var wind_speed = "-";
    var uv_index = "-";
    var current_city = "Search for a city!";
    var current_time = "";
    var main_icon = "";

    // 5-DAY CARDs
    var cards = [$(".card-0"), $(".card-1"), $(".card-2"), $(".card-3"), $(".card-4")];

    // API global vals
    var key = "b452ea12ae8781f3b7e10bd1f1ed3249";
    var query = ""; //captured input;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather"; //"...?q="+query

    // Global array of items in local storage initially set to empty
    var localCities = ["London"];
    localStorage.setItem("cities", localCities);
    // Search bar input field and button
    inputBTN.on("click", function () {
        captureInput();
    });

    //capture input from text field
    function captureInput() {
        query = inputField.val();
        requestAPI();
    }

    //main function handling page functionality
    function main() {
        renderPopCities();
        //inital render at defualt "-" ticks
        renderJumbo();
        var dash = "-";
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i]; // access array of jquery div obj on DOM
            card.empty();   //empty current content
            // add updated content based on new forecast returned data 
            var header = $("<div>");
            header.attr("class", "card-header");
            header.text(dash);
            var icon = $("<img>");
            icon.attr("src", "#");
            var body = $("<div>");
            body.attr("class", "card-body");
            var card_temp = $("<p>");
            card_temp.attr("class", "card-text");
            card_temp.text(dash)
            var card_humid = $("<p>");
            card_humid.attr("class", "card-text");
            card_humid.text(dash);
            //attach card data to card
            body.append(card_temp);
            body.append(card_humid);

            card.append(header);
            card.append(icon);
            card.append(body);

            cards[i].append(card);
        }

    }
    //Dynamic creation of group items of popular cities
    //obtains list group and appends jquery list items with bootstrap attributes. Based on popCities array whcih is added to based on search quiries
    // predefined pop city arry
    
    var popCities = ["Boston", "Washington", "New York City", "Tampa", "Houston", "Kansas City", "Las Vegas", "Seattle"];
    function renderPopCities() {
        var popCitiesLG = $(".list-group");
        popCitiesLG.empty();
        //add onto list based on local storage using same for loop logic for clearing pop cities div and re rendering list
        var storage = localStorage.getItem("cities");
        var pulledCities = storage.split(",");
        for (var i = 0; i < pulledCities.length; i++) {
            if (popCities.includes(pulledCities[i])===false) {
                popCities.push(pulledCities[i]);
            }
        }
        for (var i = 0; i < popCities.length; i++) {
            //creat list item
            var city = $("<li>");
            // add attributes and event listener
            city.text(popCities[i]);
            city.attr("value", popCities[i]);
            city.attr("class", "list-group-item");
            city.attr("type", "button");
            city.removeClass("active");
            // pass user click to query to re-render card states
            city.on("click", function () {
                query = $(this).attr("value");  //set query to selected city
                popCitiesLG.empty(); //clear list and re-render with new active attribue set
                renderPopCities();
                var active = $(this).attr("value");
                $("li[value|='" + active + "']").attr("class", "list-group-item active");
                $("li[value|='" + active + "']").attr("style", "background-color: orange");

                $(this).attr("class", "list-group-item active");
                requestAPI();
            });
            popCitiesLG.append(city);
        }
    }
    //Render Jumbo displays results of response data
    function aquireJumbo(data) {
        //Aquire response data
        current_city = (data.name);
        current_time = moment().format('LLL');
        temp = Math.round((data.main.temp - 273.15) * 9 / 5 + 32) + "°F."; //ferenheight conversion from Kelvin
        humidity = data.main.humidity + " %";
        wind_speed = data.wind.speed + " MPH";
        main_icon = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
        var latitude = data.coord.lat;
        var longitude = data.coord.lon;

        // seperate request for UV index based on initial city lat and long
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?",
            method: "GET",
            data: {
                APPID: key,
                lat: latitude,
                lon: longitude,
            }
        }).then(function (response) {
            uv_index = response.value;
            // Now that we have all data we can render to DOM
            renderJumbo();
        });
    }
    function renderJumbo() {
        //Set Span text of each cat to data
        cityDSP.text(current_city);
        timeDSP.text(current_time);
        iconDSP.attr("src", main_icon);
        tempDSP.text(temp);
        humidityDSP.text(humidity);
        wind_speedDSP.text(wind_speed);
        uv_indexDSP.text(uv_index);
        uv_indexDSP
            .attr("style", " padding: 0.1rem; border-radius: 5px; border: gray solid 2px; background-color: orange;")
    }
    // renders blnak bootsrap cards (forcast_data will eventually be incorporated)
    function aquireCardData(forcast_data) {
        var count = 0;
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i]; // Access array sotring DOM Cards
            card.empty();   //Clear current card of any Data

            // Update Data to current Card
            var header = $("<div>");
            header.attr("class", "card-header");
            header.attr("styles", "wdith:100%");
            //create moment obj out of data time stamp for current card for formatting
            var m = moment(forcast_data.list[count].dt_txt);
            header.text(m.format("LL"));


            var icon = $("<img>");
            icon.attr("src", "https://openweathermap.org/img/wn/" + forcast_data.list[count].weather[0].icon + "@2x.png");

            // Temp and Humid data
            var body = $("<div>");
            body.attr("class", "card-body justify-content-left");
            var card_temp = $("<p>");
            card_temp.attr("class", "card-text");
            //conversion from kelvin to ferenheight
            card_temp.text("Temperature: " + Math.round((forcast_data.list[count].main.temp - 273.15) * 9 / 5 + 32) + "°F.")
            var card_humid = $("<p>");
            card_humid.attr("class", "card-text");
            card_humid.text("Humidity: " + forcast_data.list[count].main.humidity+"%");


            //attach card data to card
            body.append(card_temp);
            body.append(card_humid);
            card.append(header);
            card.append(icon);
            card.append(body);

            cards[i].append(card);

            count += 8; //forcast data returns an array of 40 data sets, so incrementing by 8 gets us each new day at the same time and allows us to work with a multiple of 5 to say within the scope of current loop
        }

    }
    function requestAPI() {
        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                q: query,
                APPID: key
            }
        }).then(function (data) {
            aquireJumbo(data);
            requestForcastAPI();
            if(popCities.includes(data.name)==false){
                //if quried city is not already in popular city list, add it to local storage for later use
                localCities.push(data.name);
                localStorage.setItem("cities", localCities);
                renderPopCities();
            }
            
        });
    }
    function requestForcastAPI() {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?",
            method: "GET",
            data: {
                q: query,
                APPID: key
            }
        }).then(function (forcast_data) {
            aquireCardData(forcast_data);
        })
    }
    main();
});