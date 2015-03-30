<?php

$postalCode = $_POST['postalCode'];
$styleId = $_POST['styleId'];

$url = "https://incentives.chromedata.com/IncentivesWebService/newincentives/latest/" . $postalCode . "/" . $styleId . "/incentives.JSON";

$curl = curl_init();
curl_setopt($curl, CURLOPT_HTTPGET, 1);

if($data)
  curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($curl, CURLOPT_USERPWD, "301368:5fea85db08ba48be");

curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

$result = curl_exec($curl);

curl_close($curl);

echo $result;

?>
