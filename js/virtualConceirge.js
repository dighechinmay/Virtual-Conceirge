/**

@author:chinmay dighe
@version:1.0.0
@date:4/12/2015

*/
var map;
var pos;
var rad;
var Response;
var JSONtext;
var geocoder;
var Lat;
var Long;
var place;
var each;
var locations=new Array(20);
var searchResults;
var myCity;
var placeMarker;
var markers=[];
var keys=[];
var responses=[];

function initialize() {
	
  geocoder = new google.maps.Geocoder();
  var mapProp = {
	// center:new google.maps.LatLng(51.508742,-0.120850),
    zoom:11,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  map=new google.maps.Map(document.getElementById("googleMap"), mapProp);
}


function saveTokens(name,lat,lon){

var Args;
Args = {"placeName" : name,
        "latitude"  :  lat,
		"longitude" :  lon};
		
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    
	//alert(xmlhttp.responseText);
	
    }
  }

var ArgsString = JSON.stringify(Args);
xmlhttp.open("GET","tokenGenerator.php?q= " + ArgsString,true);
xmlhttp.send();	
}

//displaces yelp places on website
function display_places(){

    var i;	   
    var infowindow = new google.maps.InfoWindow();
    var boxText = document.createElement("div");
    boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: orange; padding: 5px;font-style:bold";
		
        var myOptions = {
		 content: boxText
		,disableAutoPan: false
		,maxWidth: 0
		,pixelOffset: new google.maps.Size(-140, 0)
		,zIndex: null
		,boxStyle: { 
		  background: "url('images/tipbox.gif') no-repeat"
		  ,opacity: 0.75
		  ,width: "280px"
		 }
		,closeBoxMargin: "10px 2px 2px 2px"
		,infoBoxClearance: new google.maps.Size(1, 1)
		,isHidden: false
		,pane: "floatPane"
		,enableEventPropagation: false
	};		
	    
		var ib = new InfoBox(myOptions);
		
		for (i = 0; i < locations.length; i++) {  
			  placeMarker = new google.maps.Marker({
				position: new google.maps.LatLng(locations[i][1], locations[i][2]),
				map: map,
				icon:'images/pizzaria.png'
			  });
			  markers.push(placeMarker);
              
			  
			  google.maps.event.addListener(placeMarker, 'mouseover',(function(placeMarker, i) {
				return function() {
				   //infowindow.setContent();
				   //infowindow.open(map, this);
					boxText.innerHTML = locations[i][0];	
			        ib.open(map,this);
              }
			  })(placeMarker, i));


              google.maps.event.addListener(placeMarker, 'mouseout', function() {
              //infowindow.close();
			  ib.close();
              });
			  
			  
			  google.maps.event.addListener(placeMarker, 'click', (function(placeMarker, i) {
				return function() {
				  //infowindow.setContent(locations[i][0]);
				  //infowindow.open(map, placeMarker);
				  saveTokens(locations[i][0],locations[i][1],locations[i][2]);
				}
			  })(placeMarker, i));
        }
}

//for circle
if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
       pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
									   
       Lat=position.coords.latitude;
	   Long=position.coords.longitude;
	  
	  var infowindow = new google.maps.InfoWindow();
	  var marker=new google.maps.Marker({
		position:pos,
		});
		
		google.maps.event.addListener(marker, 'mouseover', function() {
            infowindow.setContent("My location"),
	        infowindow.open(map, this)
        });
		google.maps.event.addListener(marker, 'mouseout', function() {
            infowindow.close();
        });
    /*  myCity = new google.maps.Circle({
		center:pos,
		radius:rad,
		strokeColor:"#00ff00",
		strokeOpacity:0.5,
		strokeWeight:0.4,
		fillColor:"#4cff4c",
		fillOpacity:0.4
		});

       myCity.setMap(map);*/
	   marker.setMap(map);
	   map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }       
  
//write code when geolocation is not supported.
function setRadius(){
	
var e = document.getElementById("radius");
rad = Number(e.options[e.selectedIndex].value);
var term=document.getElementById("yelp_search").value;
	 
	if(rad==null || rad==""){
       
	   alert("Please select a radius");
	   return false;
	}
	else if(term==null || term==""){
		
		alert("Please enter a search term");
		return false;
	}
    else  if(document.getElementById('yelp_radio').checked) {
             
			 codeLatLng(); //calling the yelp search
    }
    else if(document.getElementById('google_radio').checked){
		
             hitSearch(); //calling the google search
    } 
	
}

//to get lat,long of the current place set on google maps known as reverse geocoding
function codeLatLng() {
	
var upos=String(pos);
var latlngStr = upos.split(',');
var lat =  Lat;   //  parseFloat(latlngStr[0]);
var lng =  Long;  //parseFloat(latlngStr[1]);
var latlng = new google.maps.LatLng(lat, lng);
geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        map.setZoom(11);
        marker = new google.maps.Marker({
            position: latlng,
            map: map
        });
       	
		place=results[0].address_components[2].long_name+","+results[0].address_components[4].long_name;
		getYelpData(place);
		
       // infowindow.setContent(results[1].formatted_address);
       // infowindow.open(map, marker);
	   
      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });
}
google.maps.event.addDomListener(window, 'load', initialize);

//gets yelp data from yelp servers.
function getYelpData(place)
{
var loc_place=place;
var xmlhttp;
var htmlContent;
if(document.getElementById("yelp_search").value !=null || document.getElementById("yelp_search").value != "")
var yelp_term=document.getElementById("yelp_search").value;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    
	//alert(xmlhttp.responseText);
	//alert(Response.location.coordinate.latitude);
    //alert(Response);
	
	JSONtext=xmlhttp.responseText;
	Response= JSON.parse(JSONtext);	
		
	//resets circle on yelp page
	if(myCity != null){
	 myCity.setMap(null);
	 }
	
	 
	 myCity = new google.maps.Circle({
		center:pos,
		radius:rad,
		strokeColor:"#00ff00",
		strokeOpacity:0.5,
		strokeWeight:0.4,
		fillColor:"#4cff4c",
		fillOpacity:0.4
		});

       myCity.setMap(map);
	   
	   //to reset markers
	   //if(locations[0] != null){
		
		    for (var i = 0; i < markers.length; i++) {
                  markers[i].setMap(null);
            }
            markers = [];
	  //  }
		
	    searchResults="<div id='accordion'>";
	      for(var q=0;q<20;q++){
	         
			  //alert(Response['business'][q]);
			  //alert(each.categories[0][1]);
              //alert(place_name=each.name);
			  //alert(each.location.coordinate.latitude);
			  var each;
			  each=JSON.parse(Response['business'][q]);
			  place_name=each.name;
	          locations[q]=[place_name,each.location.coordinate.latitude,each.location.coordinate.longitude];			  
			  searchResults+="<article><h2>"+ (q+1) +"."+each.name+"</h2><p>Category : "+ each.categories[0][1] +"<br/><img src='"+each.image_url+"' width='100px' height='67px'><br/><img src='"+each.rating_img_url+"' width='50px'><b>Review</b><br/>"+ each.snippet_text +"<br/><a href='"+ each.url +"'>see on yelp</a><br/>Address : "+ each.location.display_address + "</p></article>";
			  if(q==8){
				searchResults+="<br/>";
			  }
			  /*
	    	  searchResults+="<h2>"+ (q+1) +"."+each.name+"</h2><br/><p>Category : "+ each.categories[0][1] +"<br/><img src='"+each.rating_img_url+"' width='50px'><br/><b>Review</b><br/>"+ each.snippet_text +"<br/><a href='"+ each.url +"'>see on yelp</a><br/>Address : "+ each.location.display_address + "</p><br/>";  
			  */
		  }
	    searchResults+="</div>";
	
	
        //alert(locations);
	     
	    display_places();
	
        htmlContent="<h2><img src='images/reviewsFromYelpBLK.gif' alt='yelp' ></h2><br/><p>"+Response.snippet_text+"</p>";
	
	    document.getElementById('yelp_results').innerHTML=searchResults;
	    //document.getElementById('accordian').innerHTML=searchResults;
    
	}
  }
xmlhttp.open("GET","yelpServices.php?yelp_help="+yelp_term+"&yelp_loc="+loc_place+"&radius="+rad,true);
xmlhttp.send();
}



//google code


function hitSearch(){
	
var term;
term=document.getElementById('yelp_search').value;

var request = {
		location: pos,
		radius: rad,
		query: term
	  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);


}





function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
	  
	 if(myCity != null){
	 myCity.setMap(null);
	 }
	  myCity = new google.maps.Circle({
		center:pos,
		radius:rad,
		strokeColor:"#00ff00",
		strokeOpacity:0.5,
		strokeWeight:0.4,
		fillColor:"#4cff4c",
		fillOpacity:0.4
		});

       myCity.setMap(map);
	   
	      //reset google markers.
	     for (var i = 0; i < markers.length; i++) {
                  markers[i].setMap(null);
           }
           markers = [];
		   //keys = [];
		   responses= [];
		   document.getElementById('yelp_results').innerHTML="";
		   
    for (var i = 0; i < results.length; i++) { //clean yelp markers if yelp already used
      createMarker(results[i]);
	  //keys.push(results[i].place_id);
	  getDetails(results[i].place_id);
    }
	      //var each=JSON.parse(responses[0]);
	      //alert(each.result.rating);
		  //alert(count);
		  
		  searchResults="<div id='accordion'>";
	      for(var f=0;f<results.length;f++){
	         		
                  					
				var each=JSON.parse(responses[f]);		  
				//alert(each.result.rating);	  
						  
			  searchResults+="<article><h2>"+ (f+1) +"."+each.result.name+"</h2><p><img src='"+each.result.icon+"' width='100px' height='67px'>Types :"+each.result.types+"<br/>Rating : "+ each.result.rating+"<br/><b>Review :</b>"+each.result.reviews[0].text+"<br/><a target='_blank' href='"+each.result.url+"'>see on google</a><br/>Address : "+ each.result.formatted_address + "<br/>"+ each.result.formatted_phone_number +"</p></article>";
			  if(f==8){
				searchResults+="<br/>";
			  }
			 
			 
		  }
	    searchResults+="</div>";
	
	    document.getElementById('yelp_results').innerHTML=searchResults;
}
}


function createMarker(place) {
  var placeLoc = place.geometry.location;
  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
	icon:'images/pizzaria.png'
  });
   markers.push(marker);

		
		google.maps.event.addListener(marker, 'mouseover', function() {
            infowindow.setContent(place.name),
	        infowindow.open(map, this)
        });
		google.maps.event.addListener(marker, 'mouseout', function() {
            infowindow.close();
        });
		
  google.maps.event.addListener(marker, 'click', function() {
   // infowindow.setContent(place.name);
   // infowindow.open(map, this);
	//alert(keys);place.place_id
	 savePlaceIds(place.place_id);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

function getDetails(placeInfo)
{
var xmlhttp;
var url="googleServices.php?placeId="+placeInfo;

if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {	
	//alert(xmlhttp.responseText);
	responses.push(xmlhttp.responseText);	
	}
  }
xmlhttp.open("GET",url,false);
xmlhttp.send();
}


function savePlaceIds(id){
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    alert(xmlhttp.responseText);
    }
  }
xmlhttp.open("GET","tokenGenerator.php?p="+id,true);
xmlhttp.send();	
}

