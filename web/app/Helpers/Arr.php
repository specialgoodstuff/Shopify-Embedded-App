<?php

namespace App\Helpers;

use Illuminate\Support\Str;
use Illuminate\Support\Arr as BaseArr;

class Arr extends BaseArr
{
  /**
   * @param Closure that accepts ($key, $value, $parents) and returns [$key, $value] tuple
   */
  public static function mapKeysAndValues(array $array, \Closure $callback, $parents = [])
  {
    $result = [];
    foreach ($array as $key => $value) {
      if (is_array($value)) {
        $value = static::mapKeysAndValues($value, $callback, [...$parents, $key]);
      }
      [$mappedKey, $mappedValue] = $callback($key, $value, $parents);
      $result[$mappedKey] = $mappedValue;
    }
    return $result;
  }

  /**
   * Convert array keys from snake_case to camelCase recursively.
   *
   * @param  array $array
   * @return string
   */
  public static function camelKeys(array $array): array
  {
    return static::mapKeysAndValues($array, function (string $key, $value, array $parents) {
      return [Str::camel($key), $value];
    });
  }

  /**
   * Convert array keys from camelCase to snake_case recursively.
   *
   * @param  array $array
   * @return string
   */
  public static function snakeKeys(array $array): array
  {
    return static::mapKeysAndValues($array, function (string $key, $value, array $parents) {
      return [Str::snake($key), $value];
    });
  }
}
