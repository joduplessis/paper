<?php

  use Controller as Controller;

  class PagesController extends Controller {

    public function add($variables) {

      $page = new Page;
      $page->project = $variables['post']['project'];
      $page->objects = $variables['post']['objects'];
      $page->events = $variables['post']['events'];
      $page->save();

      echo $page->id;

    }

    public function objects($variables) {

      $page = Page::where('id', $variables['id'])->get()->first();
      echo $page->objects;

    }

    public function events($variables) {

      $page = Page::where('id', $variables['id'])->get()->first();
      echo $page->events;

    }

    public function update($variables) {

      $page = Page::where('id', $variables['id'])->get()->first();
      $page->objects = $variables['post']['objects'];
      $page->events = $variables['post']['events'];
      $page->save();
      
      echo $page->id;

    }

  }

?>
