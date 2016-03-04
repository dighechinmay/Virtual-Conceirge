<!--
	author : Chinmay Dighe
    last updated :3/20/2015 
-->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Virtual Conceirge</title> 
<!--<script
src="https://maps.googleapis.com/maps/api/js">
</script>-->
 <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places"></script>
<link rel="stylesheet" type="text/css" href="css/futurestay.css">
<script src="js/infobox.js" type="text/javascript"></script>
<script src="js/virtualConceirge.js" type="text/javascript"></script>
<style>
/*body {
	
    background-image: url("images/new-york-18779.jpg");
    background-color: #cccccc;
	opacity: 0.8;
	/* background :  rgba(0,0,0,.5);*/	
}
*/
</style>
</head>

<body>
<center>
<form name="yelpSearch" id="yelpSearch" action="" method="POST">
<input type="radio" name="selectradio" id="yelp_radio" checked>
<img src="images/yelp_logo_100x50.png" alt="yelpLogo" width="75px">
<input type="text" placeholder=" Search Yelp/Google" id="yelp_search" name="yelp_search">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

Select Radius : &nbsp;<select id="radius" name="radius" value="radius" class="required">
					<option value="">---radius----</option>
					<option value="0">reset</option>
				    <option value="8000">5 Miles</option>
					<option value="16000">10 Miles</option>
					<option value="32000">20 Miles</option>
					<option value="40000">25 Miles</option>
					<!--<option value="7400">50 Miles</option>-->
			   </select>&nbsp;&nbsp;&nbsp;<input type="button" value="Submit" onClick="setRadius()">
<br/><input type="radio" name="selectradio" id="google_radio"><img src="images/google-logo.png" alt="googleLogo" width="75px">
</form>
<br/><br/>
<div id="googleMap" style="width:950px;height:400px;"></div><br/>
<div id="yelp_results"></div>
</center>
</body>
</html>
