<?php

  // All of projects routes
  Routes::set("", "ProjectsController@all");
  Routes::set("projects/all", "ProjectsController@all");
  Routes::set("projects/add", "ProjectsController@add");
  Routes::set("projects/add-action", "ProjectsController@addAction");
  Routes::set("projects/{id}/detail", "ProjectsController@detail");
  Routes::set("projects/{id}/delete", "ProjectsController@delete");
  Routes::set("projects/{id}/pages", "ProjectsController@pages");
  Routes::set("projects/{id}/update", "ProjectsController@update");
  Routes::set("projects/{id}/image-add", "ProjectsController@imageAdd");
  Routes::set("projects/{id}/image-delete", "ProjectsController@imageDelete");
  Routes::set("projects/{id}/editor", "ProjectsController@editor");
  Routes::set("projects/{id}/publish", "ProjectsController@publish");

  // Pages routes
  Routes::set("pages/add", "PagesController@add");
  Routes::set("pages/{id}/objects", "PagesController@objects");
  Routes::set("pages/{id}/events", "PagesController@events");
  Routes::set("pages/{id}/update", "PagesController@update");

?>
