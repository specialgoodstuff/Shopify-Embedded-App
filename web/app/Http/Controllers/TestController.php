<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\Plan;

class TestController extends Controller
{
  public function successResponseViaSerializableObject(Request $request)
  {
    return Plan::first();
  }

  public function successResponseViaArray(Request $request)
  {
    return ['one', 'two', 'three'];
  }

  public function successResponseViaResponse(Request $request)
  {
    return response(['one', 'two', 'three']);
  }

  public function successResponseViaTrue(Request $request)
  {
    return response(['data' => true]);
  }

  public function successResponseViaFalse(Request $request)
  {
    return response(['data' => false]);
  }

  public function successResponseViaNull(Request $request)
  {
    return response(['data' => null]);
  }

  public function errorResponseViaException()
  {
    throw new \Exception('Handle me');
  }

  public function errorResponseViaNotJsonable()
  {
    return 'what am I';
  }
}
