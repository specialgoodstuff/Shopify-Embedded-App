<?php

namespace App\Helpers;

use Illuminate\Support\Str as BaseStr;

class Str extends BaseStr
{
  /**
   * Used to convert string to integers
   * (can be used to seed Faker objects in a deterministic manner).
   */
  public static function toInteger(?string $string, int $length = 18): int
  {
    $string = trim($string);
    if (empty($string)) {
      return 0;
    }

    $string = strtolower(preg_replace('/[^a-z0-9]/i', '', $string));
    $binhash = md5($string, true);
    $numhash = unpack('N2', $binhash);
    $hash = $numhash[1] . $numhash[2];
    if (strlen($hash) > $length) {
      $hash = substr($hash, strlen($hash) - $length - 1, $length);
    }
    return (int) $hash;
  }
}
