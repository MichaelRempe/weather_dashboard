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
        //default jumbotron values
    var temp = "-";
    var humidity = "-";
    var wind_speed = "-";
    var uv_index = "-";
    // var latitude = "";
    // var longitude = "";
    var current_city="Search for a city!";
    var current_time="";

    // 5-DAY CARDs
    var cardDSP = $(".card-display");

    // API global vals
    var key = "b452ea12ae8781f3b7e10bd1f1ed3249";
    var query = ""; //captured input;
    var queryURL = "http://api.openweathermap.org/data/2.5/weather"; //"...?q="+query
    

    

    // Search bar input field and button
    inputBTN.on("click", function(){
        captureInput();
    });
    
    //capture input from text field
    function captureInput(){
        query = inputField.val();
        requestAPI();
    }

    //main function handling page functionality
    function main(){
        renderPopCities();
        //inital render at defualt "-" ticks
        renderJumbo();
    }
    //Dynamic creation of group items of popular cities
    //obtains list group and appends jquery list items with bootstrap attributes. Based on popCities array
    // predefined pop city arry
    var popCities = ["Boston", "Washington DC", "New York", "Tampa", "Huston", "Kansas City", "Las Vegas", "Seattle"];
    function renderPopCities() {
        var popCitiesLG = $(".list-group");
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
                $("li[value|='"+active+"']").attr("class","list-group-item active");
                $("li[value|='"+active+"']").attr("style", "background-color: orange");

                $(this).attr("class", "list-group-item active");
                requestAPI();
            });
            popCitiesLG.append(city);
        }
    }
    //Render Jumbo displays results of response data
    function aquireJumbo(data){
        //Aquire response data
        current_city = (data.name);
        current_time = moment().format('LLL');
        temp = Math.round((data.main.temp -273.15)*9/5+32)+"°F."; //ferenheight conversion from Kelvin
        humidity = data.main.humidity+" %";
        wind_speed = data.wind.speed+" MPH";
        var latitude = data.coord.lat;
        var longitude = data.coord.lon;
        console.log(latitude);
        console.log(longitude);

        // seperate request for UV index based on initial city lat and long
        $.ajax({
            url: "http://samples.openweathermap.org/data/2.5/uvi?",
            method: "GET",
            data: {
                APPID : key,
                lat: latitude,
                lon: longitude,
            }
        }).then(function (response) {
            console.log(response);
            uv_index = response.value;
            // Now that we have all data we can render to DOM
            renderJumbo();
        });
    }
    function renderJumbo(){
        //Set Span text of each cat to data
        cityDSP.text(current_city);
        timeDSP.text(current_time);
        tempDSP.text(temp);
        humidityDSP.text(humidity);
        wind_speedDSP.text(wind_speed);
        uv_indexDSP.text(uv_index);
        uv_indexDSP
            .attr("style", " padding: 0.1rem; border-radius: 5px; border: gray solid 2px; background-color: orange;")
    }
// renders blnak bootsrap cards (forcast_data will eventually be incorporated)
    function aquireCardData(forcast_data){
        console.log(forcast_data);
        for(var i=0; i<5; i++){
            var col = $("<div>");
            col.attr("class", "col-2");
            var card = $("<div>");
            card.attr("class", "card");
            var header = $("<div>");
            header.attr("class", "card-header");
            var icon = $("<img>");
            icon.attr("src", "...");
            var body = $("<div>");
            body.attr("class", "card-body");
            var card_temp = $("<p>");
            card_temp.attr("class", "card-text");
            var card_humid = $("<p>");
            card_humid.attr("class", "card-text");

            body.append(card_temp);
            body.append(card_humid);

            card.append(header);
            card.append(icon);
            card.append(body);

            col.append(card);
            cardDSP.append(col);
        }
    }
    function requestAPI() {
        $.ajax({
            
            url: queryURL,
            method: "GET",
            data: {
                q: query,
                APPID : key
            }
        }).then(function (data) {
            aquireJumbo(data);
            requestForcastAPI();
            
        });
    }
    function requestForcastAPI(){
        console.log(query);
        $.ajax({
            url: "api.openweathermap.org/data/2.5/forecast?",
            method: "GET",
            data:{
                q: query,
                APPID: key
            }
        }).then(function (forcast_data){
            aquireCardData(forcast_data);
        })
    }
    main();
});
