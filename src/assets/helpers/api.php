<?php
date_default_timezone_set("America/Tegucigalpa");
setlocale(LC_TIME, 'es_HN');

if (isset($_GET['function'])) {
    $func = $_GET['function'];
    if ($func == 'getCategories') {
        $handle = curl_init();

        $url = "http://190.4.56.14/XploreDeliveryAPI/api/categories/list";
		//$url = "http://localhost/XploreDeliveryAPI/api/categories/list";

// Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        $output = curl_exec($handle);
        return json_encode($output);
        curl_close($handle);
    } else if ($func == 'getTarifas') {
        $handle = curl_init();

        $url = "http://190.4.56.14/XploreDeliveryAPI/api/deliveries/getTarifas";
		//$url = "http://localhost/XploreDeliveryAPI/api/deliveries/getTarifas";

// Set the url
        curl_setopt($handle, CURLOPT_URL, $url);

        $output = curl_exec($handle);
        return json_encode($output);
        curl_close($handle);
    }
} else if(file_get_contents('php://input'))  {
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);
    if($_POST['function']=='insertDelivery'){
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "http://190.4.56.14/XploreDeliveryAPI/api/deliveries/new";
        //$url = "http://localhost:8069/XploreDeliveryAPI/public/api/deliveries/new";

    // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post);
        /* set the content type json */
    curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));

    /* set return type json */
    //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);
    }else if($_POST['function']=='searchPlace'){
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "https://calculadoradelivery.xplorerentacar.com/mod.ajax/places.php";
        //$url = "http://localhost:8069/XploreDeliveryAPI/public/api/deliveries/new";


    // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $array);
        /* set the content type json */
    curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:multipart/form-data'));

    /* set return type json */
    //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);

        return json_encode($output);
    }else if($_POST['function']=='calculateDistance'){
        $post = file_get_contents('php://input');
        $array = json_decode($post);

        $handle = curl_init();

        $url = "https://calculadoradelivery.xplorerentacar.com/mod.ajax/distance.php";
        //$url = "http://localhost:8069/XploreDeliveryAPI/public/api/deliveries/new";


    // Set the url
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $array);
        /* set the content type json */
    curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type:multipart/form-data'));

    /* set return type json */
    //curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($handle);

        curl_close($handle);

        return json_encode($output);
    }

}
