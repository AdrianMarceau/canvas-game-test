<?

// Require global config file
require('../config.php');

// Ensure this file is returned with JS content type
header('Content-type: text/javascript;');

// Collect index type from the request
$allowed_types = array('abilities', 'fields', 'items', 'maps', 'operators', 'robots', 'shops', 'types');
$request_type = !empty($_GET['type']) && in_array($_GET['type'], $allowed_types) ? $_GET['type'] : false;

// Ensure required variables have been set
if (empty($request_type) && !empty($_GET['type'])){ exit('Invalid object request type!'); }
elseif (empty($request_type) && empty($_GET['type'])){ exit('Request type not provided!'); }

// Define the type-specific object variable values
switch ($request_type){

    // Field Index
    case 'fields': {
        $this_object_token = 'field';
        $this_object_path = 'fields/';
        break;
    }

    // Robot Index
    case 'robots': {
        $this_object_token = 'robot';
        $this_object_path = 'robots/';
        break;
    }

    // Undefined Index
    default: {
        header('HTTP/1.0 404 Not Found');
        exit('Undefined index request...');
        break;
    }

}

// Define a list of directories to scan for objects
$this_object_directories = array();
$this_object_directories[] = CANVASGAME_ROOT_DIR.CANVASGAME_CORE_PATH.'objects/'.$this_object_path;
$this_object_directories[] = CANVASGAME_ROOT_DIR.CANVASGAME_CUSTOM_PATH.'objects/'.$this_object_path;

// Loop through directories to collect object files
$this_object_files = array();
foreach ($this_object_directories AS $this_dir){
    $this_dir_list = scandir($this_dir);
    foreach ($this_dir_list AS $this_subdir){
        if (substr($this_subdir, 0, 1) === '.'){ continue; }
        elseif (!is_dir($this_dir.$this_subdir)){ continue; }
        elseif (!file_exists($this_dir.$this_subdir.'/'.$this_object_token.'.json')){ continue; }
        $this_object_files[] = $this_dir.$this_subdir.'/'.$this_object_token.'.json';
    }
}

// Loop through collected file names and print out their markup
$this_object_class_name = 'battle'.ucfirst($this_object_token).'Index';
$this_object_class_function = 'index'.ucfirst($this_object_token);
foreach ($this_object_files AS $this_file_dir){

    // Define the base object paths for this file
    $this_file_name = basename($this_file_dir);
    $this_file_basepath = rtrim(dirname($this_file_dir), '/').'/';
    $this_file_basepath = str_replace(CANVASGAME_ROOT_DIR, '', $this_file_basepath);

    // Collect file contents then parse lines to remove comments
    $this_file_markup = file($this_file_dir);
    foreach ($this_file_markup AS $k => $l){
        $this_file_markup[$k] = trim($l);
        if (substr($this_file_markup[$k], 0, 2) == '//'){
            unset($this_file_markup[$k]);
        }
    }

    // Parse this JSON markup and then re-compress
    $this_json_markup = implode(PHP_EOL, $this_file_markup);
    $this_json_array = json_decode($this_json_markup, true);
    $this_json_array['objectPath'] = $this_file_basepath;
    $this_json_string = json_encode($this_json_array);

    // Pass this JSON object data into the index class via function call
    echo '// '.strtoupper(dirname($this_file_basepath)).PHP_EOL;
    echo $this_object_class_name.'.'.$this_object_class_function.'('.trim($this_json_string).');'.PHP_EOL;

}

?>