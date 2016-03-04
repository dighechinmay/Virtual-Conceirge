<?php
/*
author:Chinmay Dighe
date:3/29/2015

*/


$connection = mysql_connect("host","username","password");
if (!$connection) {
    die("Database connection failed: " . mysql_error());
}

// 2. Select a database to use 
$db_select = mysql_select_db("database_name",$connection);
if (!$db_select) {
    die("Database selection failed: " . mysql_error());
}

if ($connection) {
   // echo "i am cool";
}

if(isset($_GET['q'])){
$string = $_GET['q'];
$decode = json_decode($string,true);
$place=$decode['placeName'];
$placeFormatted= mysql_real_escape_string($place);
$lat=$decode['latitude'];
$long=$decode['longitude'];
  
     $sql="Insert into yelpTokens (placeName,lat,longi) VALUES ('".$placeFormatted."',".$lat.",".$long.")";
	 //echo $sql;
	 mysql_query($sql);//or die(mysql_query($sql));
	 //echo "success";
}
else{
	
	$sql="Insert into googlePlaceIds (place_id) VALUES ('".$_GET['p']."')";
    mysql_query($sql);
	echo "success";
}
?>


