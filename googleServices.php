<?php

header('Content-type: application/xml');
$plId =urlencode($_GET['placeId']);
echo file_get_contents("https://maps.googleapis.com/maps/api/place/details/json?placeid={$plId}&key="); //you google key in front of the key 

?>