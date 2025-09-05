<?php

require_once __DIR__ . "/../environment.php";

/**
 * Throw a HTTP error if the method is incorrect
 */
function http_method_must_be($method) {
    if($_SERVER["REQUEST_METHOD"] !== $method) {
        http_response_code(405);
        echo "HTTP method must be " . $method;
        exit;
    }
}

function send_response($code, $string) {
    http_response_code($code);
    echo $string;
    exit;
}


function safely_start_session() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function must_be_authenticated() {

    safely_start_session();

    if(!(isset($_SESSION["username"]) && $_SESSION["username"] !== "")) {
        send_response(403, "You are not authenticated");
    }
}

function set_document_owner($document, $userID) {
    $document["user_id"] = $userID;
    return $document;
}

function must_be_document_owner($document) {
    must_be_authenticated();

    if(!isset($document["user_id"]) || $_SESSION["user_id"] !== $document["user_id"]) {
        send_response(403, "You are not authorised to access this resource");
    }
}

function validate_request_data($data, ...$rules) {
    foreach ($rules as $rule) {
        // Split rule by '|' to get field and type (if type is provided)
        $ruleParts = explode('|', $rule);
        $field = $ruleParts[0];
        $type = isset($ruleParts[1]) ? $ruleParts[1] : null;

        // Check if the field exists
        if (!isset($data[$field])) {
            send_response(400, "The field '$field' is required.");
        }

        $value = $data[$field];

        // If a type is provided, validate the type
        if ($type) {
            switch ($type) {
                case 'string':
                    if (!is_string($value)) {
                        send_response(400, $field . " is incorrect data type. Should be " . $type);
                    }
                    // if($value === "") {
                    //     send_response(400, $field . " cannot be an empty string");
                    // }
                    break;

                case 'number':
                    if (!is_numeric($value)) {
                        send_response(400, $field . " is incorrect data type. Should be " . $type);
                    }
                    break;

                case 'json':
                    json_decode($value);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        send_response(400, $field . " is not a valid JSON string.");
                    }
                    break;

                default:
                    send_response(500, "Unknown validation type '$type' for field '$field'");
            }
        }
    }
}

?>