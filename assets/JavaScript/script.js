$(document).ready(function () {
    // INPUT FIELD DOM
    var inputField = $("#queryInput");
    var inputBTN = $("#queryBTN");
    // JUMBOTRON VALUES and DISPLAYS
    var tempDSP = $("#currentTemp");
    var humidityDSP = $("#currentHumidity");
    var wind_speedDSP = $("#currentWindSpeed"); 
    var uv_indexDSP = $("#currentUV");
        //default jumbotron values
    var temp = "-";
    var humidity = "-";
    var wind_speed = "-";
    var uv_index = "-";

    // 5-DAY CARDs

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
        renderJumbo();
        renderCards();
        
    }
    //Dynamic creation of group items of popular cities
    //obtains list group and appends jquery list items with bootstrap attributes. Based on popCities array
    // predefined pop city arry
    var popCities = ["Boston", "Washington DC", "New York", "Tampa", "New Oreleans", "Oklahoma City", "Las Vegas", "Seatle"];
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
                $(this).attr("class", "list-group-item active");
                setPopCities();
                query = $(this).attr("value");
                requestAPI();
            });
            popCitiesLG.append(city);
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
        }).then(function (response) {
            console.log(response);
        });
    }
    main();
});
