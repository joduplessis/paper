<?php

  // kick off the session
  session_start();

  // Autoload all of the composer & custom classes
  require "../vendor/autoload.php";

  // App utillities
  require "app/Config.php";
  require "app/Database.php";
  require "app/Routes.php";
  require "app/Controller.php";

  // Models
  require "models/Project.php";
  require "models/Page.php";

  // Controllers
  require "controllers/ProjectsController.php";
  require "controllers/PagesController.php";

  // Routes
  require "routes/Routes.php";
