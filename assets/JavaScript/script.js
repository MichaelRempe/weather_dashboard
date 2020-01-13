$(document).ready(function(){
    var key = "b452ea12ae8781f3b7e10bd1f1ed3249";
    var query = "" //captured input;
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=Washington%20DC&APPID=b452ea12ae8781f3b7e10bd1f1ed3249"; //"...?q="+query
    
    function setPopCities(){
        var popCities = $(".list-group-item");
        console.log(popCities);
        console.log(popCities[0].val());
        // for(var i = 0; popCities.length; i++){
        //     // $("<li>") = popCities[i];
            
        //     // popCities[i].addEventListener("click", function(){
        //     //     console.log($(this).attr("value"));
        //     // });
        // }
    }
    setPopCities();
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
    });
});
