<?

// Ensure this file is returned with JS content type
header('Content-type: text/javascript;');

// Collect a list of all JS object files in this directory
$thisDir = rtrim(str_replace('\\', '/', dirname(__FILE__)), '/').'/';
$thisFiles = scandir($thisDir);
foreach ($thisFiles AS $fileKey => $fileName){
    if (substr($fileName, 0, 1) === '.'){ unset($thisFiles[$fileKey]); }
    elseif (substr($fileName, -3, 3) !== '.js'){ unset($thisFiles[$fileKey]); }
}

// Loop through collected file names and print out their markup
$thisFiles = array_values($thisFiles);
foreach ($thisFiles AS $fileKey => $fileName){
    $thisFileDir = $thisDir.$fileName;
    $thisFileMarkup = file_get_contents($thisFileDir);
    echo trim($thisFileMarkup).PHP_EOL;
}

?>