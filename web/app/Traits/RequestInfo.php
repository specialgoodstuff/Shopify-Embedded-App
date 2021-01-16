<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait RequestInfo
{
  public static function isJsonRequest(Request $request): bool
  {
    return $request->expectsJson || stristr($request->path(), 'api/');
  }
}
