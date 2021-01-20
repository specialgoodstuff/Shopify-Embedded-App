<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use SMartins\Exceptions\JsonHandler;
use Illuminate\Support\Facades\App;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Throwable;
use App\Traits\RequestInfo;

class Handler extends ExceptionHandler
{
  use JsonHandler;
  use RequestInfo;

  /**
   * A list of handlers for specific exceptions.
   *
   * @var array<exception,handler>
   */
  protected $exceptionHandlers = [];

  /**
   * A list of the exception types that are not reported.
   *
   * @var array
   */
  protected $dontReport = [
    //
  ];

  /**
   * A list of the inputs that are never flashed for validation exceptions.
   *
   * @var array
   */
  protected $dontFlash = ['password', 'password_confirmation'];

  /**
   * Register the exception handling callbacks for the application.
   *
   * @return void
   */
  public function register()
  {
  }

  /**
   * Render an exception into an HTTP response.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Throwable  $e
   * @return \Symfony\Component\HttpFoundation\Response
   *
   * @throws \Throwable
   */

  public function render($request, Throwable $exception)
  {
    if (static::isJsonRequest($request)) {
      $jsonApiResponse = $this->jsonResponse($exception);

      // Add stack trace to jsonApiResponse in a way
      // that conforms to the json api spec if appropriate.
      // @see https://jsonapi.org/format/#errors
      if (!App::environment('production')) {
        if (!in_array(get_class($exception), $this->dontReport)) {
          $jsonApiData = $jsonApiResponse->getData(true);
          if (isset($jsonApiData['errors'][0])) {
            // get the trace from the traditional json response
            $request->headers->set('Accept', 'application/json');
            $response = parent::render($request, $exception);
            if (is_a($response, JsonResponse::class)) {
              $jsonData = $response->getData(true);
              if (isset($jsonData['trace'])) {
                if (!isset($jsonApiData['errors'][0]['meta'])) {
                  $jsonApiData['errors'][0]['meta'] = [];
                }
                $jsonApiData['errors'][0]['meta'] = array_merge($jsonApiData['errors'][0]['meta'], $jsonData);
              }
              $jsonApiResponse->setData($jsonApiData);
            }
          }
        }
      }
      return $jsonApiResponse;
    }

    return parent::render($request, $exception);
  }
}
