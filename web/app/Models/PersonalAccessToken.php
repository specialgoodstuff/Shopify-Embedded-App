<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use Illuminate\Support\Facades\Crypt;

/**
 * We extended Sanctum's model
 * so that we could configure it for use with encrypted tokens (vs hashed)
 */
class PersonalAccessToken extends SanctumPersonalAccessToken
{
  /**
   * Find the token instance matching the given token.
   *
   * @param  string  $token
   * @return static|null
   */
  public static function findToken($token)
  {
    if (strpos($token, '|') === false) {
      return static::where('token', Crypt::encryptString($token))->first();
    }

    [$id, $token] = explode('|', $token, 2);

    if ($instance = static::find($id)) {
      //dd(Crypt::decryptString($instance->token), $token);
      return Crypt::decryptString($instance->token) == $token ? $instance : null;
    }
  }
}
