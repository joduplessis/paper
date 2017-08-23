<?php

  class ProjectsController extends Controller {

    public function all($variables) {

        $projects = Project::all();
        $projectsData = [];

        // Get the list of projects
        foreach ($projects as $project) {
          $pages = Page::where('project', $project->id)->get()->count();
          // Create the array
          array_push($projectsData, [
            'id'=> $project->id,
            'name'=> $project->name,
            'width'=> $project->width,
            'height'=> $project->height,
            'images'=> $project->images,
            'pages'=>$pages
          ]);
        }

        // Render the template
        $this->render("ProjectsAllView", ['projects'=>$projectsData]);

    }

    public function add($variables) {
      $this->render("ProjectsAddView", []);
    }

    public function addAction($variables) {

      $project = new Project;
      $project->name = $variables['post']['name'];
      $project->width = $variables['post']['width'];
      $project->height = $variables['post']['height'];
      $project->save();

      // Redirect
      header("Location: ".SITE_ROOT."/projects/all");

    }

    public function detail($variables) {

      $project = Project::where('id', $variables['id'])->get()->first();

      // Render the template
      $this->render("ProjectsDetailView", ['project'=>[
        'id'=> $project->id,
        'name'=> $project->name,
        'width'=> $project->width,
        'height'=> $project->height,
        'images'=> $project->images
      ]]);

    }

    public function delete($variables) {

      Project::where('id', $variables['id'])->delete();

      // Redirect
      header("Location: ".SITE_ROOT."/projects/all");

    }

    public function update($variables) {

      $project = Project::where('id', $variables['id'])->get()->first();
      $project->name = $variables['post']['name'];
      $project->width = $variables['post']['width'];
      $project->height = $variables['post']['height'];
      $project->save();

      // Redirect
      header("Location: ".SITE_ROOT."/projects/all");

    }

    public function imageAdd($variables) {

      $project = Project::where('id', $variables['id'])->get()->first();

      if ($project->images=="") {
        $images = [];
      } else {
        $images = explode(",", $project->images);
      }
      $target_file = "assets/".basename($variables['files']['image']['name']);
      $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);

      if (move_uploaded_file($variables['files']['image']['tmp_name'], $target_file)) {
        array_push($images, basename($variables['files']['image']['name']));
      }

      $project->images = join(",",$images);
      $project->save();

      // Redirect
      header("Location: ".SITE_ROOT."/projects/".$variables['id']."/detail");

    }

    public function imageDelete($variables) {

      $project = Project::where('id', $variables['id'])->get()->first();
      $images = explode(",", $project->images);

      foreach ($variables['post']['images'] as $image) {
        $index = array_search($image, $images);
        if ($index !== FALSE) {
            unset($images[$index]);
        }
      }

      var_dump($images);

      $project->images = join(",",$images);
      $project->save();

      // Redirect
      header("Location: ".SITE_ROOT."/projects/".$variables['id']."/detail");

    }

    public function editor($variables) {

      $project = Project::where('id', $variables['id'])->get()->first();
      $pages = Page::where('project', $variables['id'])->get()->count();

      // Render the template
      $this->render("ProjectsEditorView", ['project'=>[
        'id'=> $project->id,
        'name'=> $project->name,
        'width'=> $project->width,
        'height'=> $project->height,
        'images'=> $project->images,
        'pages'=> $pages
      ]]);

    }

    public function publish($variables) {

      $project = Project::where('id', $variables['id'])->get()->first();
      $pages = Page::where('project', $variables['id'])->get();
      $pagesData = [];

      foreach ($pages as $page) {
        array_push($pagesData, [
          'objects'=>$page->objects,
          'events'=>$page->events
        ]);
      }

      // Render the template
      $this->render("ProjectsPublishView", ['project'=>[
        'id'=> $project->id,
        'name'=> $project->name,
        'width'=> $project->width,
        'height'=> $project->height,
        'images'=> $project->images,
        'pages'=> $pagesData
      ]]);

    }

    public function pages($variables) {

      $pages = Page::where('project', $variables['id'])->get();
      $pagesData = [];

      // Get the list of projects
      foreach ($pages as $page) {
        array_push($pagesData, $page->id);
      }

      echo join(",",$pagesData);

    }

  }

?>
