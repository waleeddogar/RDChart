<?php
$year = $_POST['year'] ;
  class AccountInfo {
      function AccountInfo($number, $secret,$country,$language)
      {
          $this->number = $number;
          $this->secret = $secret;
          $this->country = $country;
          $this->language = $language;
      }
    }

    $accountInfo = new AccountInfo("301368","5fea85db08ba48be","CA","en");
    $client = new SoapClient("http://services.chromedata.com/Description/7a?wsdl");
    $params = array(
                      "accountInfo" => $accountInfo,
                      "modelYear" => $year
                      );
    $response = $client->__soapCall("getDivisions", array($params));
    //$response = $client->__soapCall("getModelYears", array($params));
    echo json_encode($response);
?>
