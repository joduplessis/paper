<?php

  // Namespace glory
  use Illuminate\Database\Capsule\Manager as Capsule;
  use League\Plates\Engine as Plates;

  class Database {

    public static function connect() {

      // Instatniate the Capsule (Eloquent) class
      $capsule = new Capsule;

      // Set up the Eloquent connection variables
      $capsule->addConnection([
        'driver'    => 'mysql',
        'host'      => DB_HOST,
        'database'  => DB_DATABASE,
        'username'  => DB_USERNAME,
        'password'  => DB_PASSWORD,
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci',
        'prefix'    => '',
      ]);

      // Make this Capsule instance available globally via static methods
      $capsule->setAsGlobal();

      // Setup the Eloquent ORM
      $capsule->bootEloquent();

    }

  }



?>
