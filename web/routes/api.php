<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Create an Api resource controller with associated model:
| php artisan make:controller PhotoController --api --resource --model=Photo
|
| Actions registered by a resource controller:
|
| GET	/photos	              index	  photos.index
| GET	/photos/create	      create	photos.create
| POST	/photos	            store	  photos.store
| GET	/photos/{photo}	      show	  photos.show
| GET	/photos/{photo}/edit	edit	  photos.edit
| PUT/PATCH	/photos/{photo}	update	photos.update
| DELETE	/photos/{photo}	  destroy	photos.destroy
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
  return $request->user();
});

Route::group(['middleware' => 'api'], function () {
  //users
  Route::match(['put', 'post'], 'users/login', [UserController::class, 'login']);

  //Route::group(['middleware' => 'auth:api'], function () {
  Route::apiResource('users', UserController::class);
  //});

  //plans
  //Route::apiResource('plans', PlanController::class)->only(['index', 'show']);

  //tests
  Route::group(['prefix' => 'test'], function () {
    Route::get('success/object', [TestController::class, 'successResponseViaSerializableObject']);
    Route::get('success/array', [TestController::class, 'successResponseViaArray']);
    Route::get('success/response', [TestController::class, 'successResponseViaResponse']);
    Route::get('success/true', [TestController::class, 'successResponseViaTrue']);
    Route::get('success/false', [TestController::class, 'successResponseViaFalse']);
    Route::get('success/null', [TestController::class, 'successResponseViaNull']);
    Route::get('error/exception', [TestController::class, 'errorResponseViaException']);
    Route::get('error/notJsonable', [TestController::class, 'errorResponseViaNotJsonable']);
  });
});
