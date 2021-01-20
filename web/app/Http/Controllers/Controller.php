<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
  use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

  public function resource($model, string $resourceClass = 'AppResource')
  {
    $class = '\App\Http\Resources\\' . $resourceClass;
    return new $class($model);
  }

  public function collection($collection, string $resourceClass = 'AppResource')
  {
    $class = '\App\Http\Resources\\' . $resourceClass;
    $method = 'collection';
    return $class::$method($collection);
  }
}
