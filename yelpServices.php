
<?php
/**
 * Yelp API v2.0 code sample.
 *
 * This program demonstrates the capability of the Yelp API version 2.0
 * by using the Search API to query for businesses by a search term and location,
 * and the Business API to query additional information about the top result
 * from the search query.
 * 
 * Please refer to http://www.yelp.com/developers/documentation for the API documentation.
 * 
 * This program requires a PHP OAuth2 library, which is included in this branch and can be
 * found here:
 *      http://oauth.googlecode.com/svn/code/php/
 * 
 * Sample usage of the program:
 * `php sample.php --term="bars" --location="San Francisco, CA"`
 */
// Enter the path that the oauth library is in relation to the php file
require_once('lib/OAuth.php');
// Set your OAuth credentials here  
// These credentials can be obtained from the 'Manage API Access' page in the
// developers documentation (http://www.yelp.com/developers)
/*
$tem_term="pizza";
$tem_location="Harrison,New Jersey";
*/
$tem_term=$_GET['yelp_help']; 
$tem_location=$_GET['yelp_loc']; 
$CONSUMER_KEY =''; // your api key here
$CONSUMER_SECRET =''; // secret key
$TOKEN ='fb9Prq7-nI9edSP00Aj_JV_oSsQUclSC';
$TOKEN_SECRET ='VVf_RIST-4CE2h4fyUitjzSowXU';
$API_HOST = 'api.yelp.com';
$DEFAULT_TERM = $tem_term;
$DEFAULT_LOCATION = $tem_location; //'San Francisco, CA';
$SEARCH_LIMIT = 20;
$SEARCH_OFFSET = 20;
$SEARCH_RADIUS =$_GET['radius']; //8000;//
$SEARCH_PATH = '/v2/search/';
$BUSINESS_PATH = '/v2/business/';
/** 
 * Makes a request to the Yelp API and returns the response
 * 
 * @param    $host    The domain host of the API 
 * @param    $path    The path of the APi after the domain
 * @return   The JSON response from the request      
 */
function request($host, $path) {
    $unsigned_url = "http://" . $host . $path;
    // Token object built using the OAuth library
    $token = new OAuthToken($GLOBALS['TOKEN'], $GLOBALS['TOKEN_SECRET']);
    // Consumer object built using the OAuth library
    $consumer = new OAuthConsumer($GLOBALS['CONSUMER_KEY'], $GLOBALS['CONSUMER_SECRET']);
    // Yelp uses HMAC SHA1 encoding
    $signature_method = new OAuthSignatureMethod_HMAC_SHA1();
    $oauthrequest = OAuthRequest::from_consumer_and_token(
        $consumer, 
        $token, 
        'GET', 
        $unsigned_url
    );
    
    // Sign the request
    $oauthrequest->sign_request($signature_method, $consumer, $token);
    
    // Get the signed URL
    $signed_url = $oauthrequest->to_url();
    
    // Send Yelp API Call
    $ch = curl_init($signed_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $data = curl_exec($ch);
    curl_close($ch);
    
    return $data;
}
/**
 * Query the Search API by a search term and location 
 * 
 * @param    $term        The search term passed to the API 
 * @param    $location    The search location passed to the API 
 * @return   The JSON response from the request 
 */
function search($term, $location) {
    $url_params = array();
    
    $url_params['term'] = $term."?:".$GLOBALS['DEFAULT_TERM'];
    $url_params['location'] = $location."?:".$GLOBALS['DEFAULT_LOCATION'];
    $url_params['limit'] = $GLOBALS['SEARCH_LIMIT'];
	$url_params['offset'] = $GLOBALS['SEARCH_OFFSET'];
    $url_params['radius_filter'] = $GLOBALS['SEARCH_RADIUS'];
    $search_path = $GLOBALS['SEARCH_PATH'] . "?" . http_build_query($url_params);
    
    return request($GLOBALS['API_HOST'], $search_path);
}
/**
 * Query the Business API by business_id
 * 
 * @param    $business_id    The ID of the business to query
 * @return   The JSON response from the request 
 */
function get_business($business_id) {
    $business_path = $GLOBALS['BUSINESS_PATH'] . $business_id;
    
    return request($GLOBALS['API_HOST'], $business_path);
}
/**
 * Queries the API by the input values from the user 
 * 
 * @param    $term        The search term to query
 * @param    $location    The location of the business to query
 */
function query_api($term, $location) {     
    $response = json_decode(search($term, $location));

	$business_id=array();
	
	for($k=0;$k<count($response->businesses);$k++){
    $business_id[$k] = $response->businesses[$k]->id;
    }

   
    $total_results=count($response->businesses);
	
	$response=array();
	$response['business']=array();
    //$response="";	
    
	for($f=0;$f<$total_results;$f++){
    $response['business'][$f]= get_business($business_id[$f]);
    }

   
    $result = json_encode($response);
	
	
	echo $result;
}
/**
 * User input is handled here 
 */
$longopts  = array(
    "term::",
    "location::",
);
    
$options = getopt("", $longopts);
$term = $options['term']."?:";
$location = $options['location']."?:.";
query_api($term, $location);
?>