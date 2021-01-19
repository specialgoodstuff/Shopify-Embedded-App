<?php

namespace App\Traits;

use Illuminate\Support\Str;
use Laravel\Sanctum\NewAccessToken;
use Laravel\Sanctum\HasApiTokens as SanctumHasApiTokens;
use Illuminate\Support\Facades\Crypt;

/**
 * We're using our own version of Sanctum's HasApiTokens
 * so that we can store plaintext tokens in the DB instead of hashed ones.
 */
trait HasApiTokens
{
  use SanctumHasApiTokens;

  /**
   * Create a new personal access token for the user.
   *
   * @param  string  $name
   * @param  array  $abilities
   * @return \Laravel\Sanctum\NewAccessToken
   */
  public function createToken(string $name, array $abilities = ['*'])
  {
    $token = $this->tokens()->create([
      'name' => $name,
      'token' => Crypt::encryptString($plainTextToken = Str::random(40)),
      'abilities' => $abilities,
    ]);

    return new NewAccessToken($token, $token->id . '|' . $plainTextToken);
  }
}
