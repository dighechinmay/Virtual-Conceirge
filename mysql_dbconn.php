<?php
// 1. Create a database connection
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
?>