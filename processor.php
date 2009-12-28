<?php

require_once "gvClient.php";

$requestParam = $_POST['data'];
if (!$requestParam) {
    $requestParam = $_GET['data'];
}

$client = new gvClient();
$client->login("adinardi@gmail.com", "<PASSWORD>");

if ($requestParam == 'recentSMS') {
    echo $client->getRecentSMS();
} else if ($requestParam == 'sendSMS') {
    $client->sendSMS($_POST['number'], $_POST['text']);
}
