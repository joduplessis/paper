<?php

class Routes {

  private static function getUri() {

    // Get the current URL
    $urlString = $_SERVER['REQUEST_URI'];

    // Remove the site portion of it - so it's only the relevant parts
    $editedUrlString = str_replace(SITE_ROOT."/", '', $urlString);
    if (substr($editedUrlString, -1)=="/") {
      $editedUrlString = substr_replace($editedUrlString, "", -1);
    }

    // Break it apart
    $urlArray = explode("/", $editedUrlString);

    // Return it
    return $urlArray;

  }

  private static function isVariable($str) {

    // Set the default to NO
    $isv = false;

    // strip out the brackets so we get the variable name
    if (strlen($str)>0) {
      if ($str[0]=="{") {
        if ($str[strlen($str)-1]=="}") {
          $str = str_replace("{", "", $str);
          $str = str_replace("}", "", $str);
          $isv = $str;
        }
      }
    }

    // return it
    return $isv;

  }

  static public function set($url, $action) {

    $currentUrlArray = self::getUri();
    $routeUrlArray = explode("/", $url);
    $found = false;
    $variables = [];
    $controller = explode("@", $action);
    $controllerClass = $controller[0];
    $controllerFunction = $controller[1];

    // Forms
    if (isset($_FILES)) $variables['files'] = $_FILES;
    if (isset($_POST)) $variables['post'] = $_POST;

    // Go over each element
    for ($u=0; $u<count($currentUrlArray); $u++) {

      // Boolean to see if it's a variable
      $isVar = self::isVariable($routeUrlArray[$u]);

      // If it's a variable we get the variable name & value
      if ($isVar!=false) {
        $variables[$isVar] = $currentUrlArray[$u];
      }

      // If they match or if it's a variable
      // It only gets set to true on the last itiration
      if (($routeUrlArray[$u]==$currentUrlArray[$u]) || ($isVar!=false)) {
        if ($u == (count($routeUrlArray)-1)) {
          $found = true;
          break;
        }
      } else {
        break;
      }
    }

    // If the route matches
    if ($found) {
      $object = new $controllerClass();
      $object->init($variables, $controllerFunction);
    }

  }

}


?>
