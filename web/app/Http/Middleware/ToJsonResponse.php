<?php

namespace App\Http\Middleware;

use Closure;
use App\Traits\RequestInfo;
use App\Traits\Serializes;
use App\Helpers\Arr;

class ToJsonResponse
{
  use RequestInfo, Serializes;

  public function handle($request, Closure $next)
  {
    $response = $next($request);
    if (!$response) {
      return $response;
    }
    if (!static::isJsonRequest($request)) {
      return $response;
    }

    $content = json_decode($response->getContent(), true);

    if (is_null($content) && !empty($response->getContent())) {
      throw new \Exception('The response could not be serialized to JSON');
    }

    // bail for responses that are already wrapped

    $topLevelJsonSchemaProperties = ['data', 'errors', 'meta', 'jsonapi', 'links', 'included'];
    if (is_array($content)) {
      $topLevelPresent = false;
      $nonTopLevelPresent = false;
      foreach ($content as $property => $value) {
        if (in_array($property, $topLevelJsonSchemaProperties)) {
          $topLevelPresent = true;
        } else {
          $nonTopLevelPresent = true;
        }
      }
      if ($topLevelPresent && !$nonTopLevelPresent) {
        return $response;
      }
    }

    $content = [
      'data' => $this->serializeData($content),
    ];

    $response->header('Content-Type', 'application/json');
    $response->setContent(json_encode($content));
    return $response;
  }
}
