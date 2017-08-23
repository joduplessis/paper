<?php

  use League\Plates\Engine as Plates;
  use Illuminate\Database\Capsule\Manager as Capsule;
  use Database as Database;

  class Controller extends Database {

    public function init($variables, $function) {

      // Set up the DB connection
      self::connect();

      $this->$function($variables);

    }

    public function render($view, $variables) {

      $templates = new Plates('views');
      echo $templates->render($view, $variables);

    }

  }

?>
