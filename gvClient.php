<?php

class gvClient {
    private $baseURL = 'https://www.google.com/accounts/ClientLogin';
    private $gvBaseURL = 'https://www.google.com/voice/';
    private $authToken = '';
    private $rnr = '';
    
    private function getCurlPost($url, array $params) {
        $session = curl_init($url);
        curl_setopt($session, CURLOPT_POST, true);
        curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($session, CURLOPT_POSTFIELDS, $params);
        curl_setopt($session, CURLOPT_SSL_VERIFYPEER, false);
        
        return $session;
    }
    
    private function getCurlGet($url) {
        $session = curl_init($url);
        curl_setopt($session, CURLOPT_POST, false);
        curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($session, CURLOPT_SSL_VERIFYPEER, false);
        
        return $session;
    }
    
    private function getCurlResult($session) {
        return curl_exec($session);
    }
    
    private function getBaseParams() {
        return array('auth' => $this->authToken);
    }
    
    private function getAuthGetParam() {
        return 'auth=' . $this->authToken;
    }
    
    private function getRNRToken() {
        if (strlen($this->rnr) < 1) {
            $session = $this->getCurlGet($this->gvBaseURL . '?' . $this->getAuthGetParam());
            $result = curl_exec($session);
            // echo $result;
            preg_match("/'_rnr_se'\: '([^']+)'/", $result,$rnr);
            // print_r($rnr);  
            $this->rnr = $rnr[1];
        }
        
        return $this->rnr;
    }
    
    public function login($username, $password) {
        $success = false;
        
        $post = array(
            'accountType' => 'HOSTED_OR_GOOGLE',
            'Email' => $username,
            'Passwd' => $password,
            'service' => 'grandcentral',
            'source' => 'thetr-voiceconnectr-alpha1'
            );
        $session = $this->getCurlPost($this->baseURL, $post);
        
        $result = curl_exec($session);
        // echo $result;
        $authPos = stripos($result, "Auth=");
        if ($authPos > -1) {
            $this->authToken = substr($result, $authPos + 5, strpos($result, "\n", $authPos) - $authPos);
            // echo "TOKEN:" . $this->authToken;
            if (strlen($this->authToken) > 0) {
                $success = true;
            }
        }
        
        return $success;
    }
    
    public function getRecentSMS() {
        $html = '';
        $json = '';
        $returnJSON = array();
        $returnJSON['SMS'] = array();
        
        // $params = $this->getBaseParams();
        $session = $this->getCurlGet($this->gvBaseURL . 'inbox/recent/sms?auth=' . $this->authToken);
        $result = curl_exec($session);
        // echo $result;
        $xml = new XMLReader();
        $xml->xml($result);
        $xml->read();
        if ($xml->name == 'response') {
            $xml->read();
            $xml->next('json');
            if ($xml->name == 'json') {
                $json = $xml->readString();
                $returnJSON['SMS']['data'] = json_decode($json, true);
            }
            
            $xml->next('html');
            // echo "name: " . $xml->name . " end";
            if ($xml->name == 'html') {
                // echo 'html: ' > $xml->readString();
                // echo "in HTML";
                // echo $xml->readString();
                $html = $xml->readString();
            }
        }
        
        if (strlen($html) > 0) {
            $dom = new DOMDocument();
            
            // $smsData = array('conversations'=>array());
            
            if (@$dom->loadHTML($html)) {
                // echo $dom->saveHTML();
                $xpath = new DOMXPath($dom);
                $conversations = $xpath->query('//div[contains(@class, " gc-message ")]');
                
                $convo = array();

                for ($citer = 0; $citer < $conversations->length; $citer++) {//$conversations as $conversation) {
                    $conversation = $conversations->item($citer);
                    // echo $entry->textContent . '<br>';
                    // echo $conversation->textContent;
                    $conversationID = $conversation->attributes->getNamedItem('id')->value;
                    $contactInfo = $xpath->query('div//a[contains(@class, "gc-message-name-link")]', $conversation);
                    $contactName = $contactInfo->item(0)->textContent;
                    
                    $returnJSON['SMS']['data']['messages'][$conversationID]['contactName'] = $contactName;
                    
                    $messages = $xpath->query('div//div[contains(@class, "gc-message-sms-row")]', $conversation);
                    for ($miter = 0; $miter < $messages->length; $miter++) {// ($messages as $message) {
                        $message = $messages->item($miter);
                        $from = trim($message->childNodes->item(1)->textContent);
                        $text = $message->childNodes->item(3)->textContent;
                        $time = trim($message->childNodes->item(5)->textContent);
                        
                        $messageJSON = array(
                            'from' => $from,
                            'text' => $text,
                            'time' => $time
                            );
                        array_push($convo, $messageJSON);
                        // echo "Message: " . $from . " " . $text . " " . $time . "<br>";
                    }
                    // echo "<br><br>";
                    // array_push($smsData['conversations'], $convo);
                    // echo $conversationID;
                    $returnJSON['SMS']['data']['messages'][$conversationID]['messages'] = $convo;
                    $convo = array();
                }

                // $returnJSON['SMS']['data'] = $smsData;
            }
        }
        
        return json_encode($returnJSON);
    }
    
    public function sendSMS($number, $text) {
        $number = str_replace("+", "", $number);
        $params = array(
            'id' => '',
            'phoneNumber' => $number,
            'text' => stripslashes($text),
            '_rnr_se' => $this->getRNRToken()
            );
        print_r($params);
        $session = $this->getCurlPost($this->gvBaseURL . 'sms/send/?' . $this->getAuthGetParam(), $params);
        $result = $this->getCurlResult($session);
        echo $result;
        return $result;
    }
}