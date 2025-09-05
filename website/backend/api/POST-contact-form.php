<?php

require_once __DIR__ . "/../helpers/helpers.php";
require_once __DIR__ . "/../environment.php";

http_method_must_be("POST");

validate_request_data($_POST, "email|string", "message|string", "honey");

safely_start_session();



// Check for honeypot
if($_POST["honey"] !== "") {
    send_response(403, "Permission denied");
}

$data = array(
    "email" => $_POST["email"],
    "message" => $_POST["message"],
    "form_token" => backend_form_token()
);

$ch = curl_init();

// Set the URL and other necessary options
curl_setopt($ch, CURLOPT_URL, "");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data)); // Convert data to URL-encoded string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the request and get the response
$response = curl_exec($ch);



if(curl_errno($ch)) {

    curl_close($ch);
    send_response(500, "Oh no! Something went wrong whilst submitting your message. Please email us instead.");

} else {

    curl_close($ch);
    send_response(200, "Thank you! We will be in touch ASAP");

}




?>