<?php

namespace App\Traits;

use Illuminate\Http\Request;
use App\Helpers\Arr;

trait Serializes
{
  /**
   * Prepare a date for array / JSON serialization.
   *
   * @param  \DateTimeInterface  $date
   * @return string
   */
  protected function serializeDate(\DateTimeInterface $date)
  {
    return $date->format(\DateTime::ATOM);
  }

  /**
   * camelCase and serialize dates for given array
   */
  protected function serializeData(array $data)
  {
    return Arr::mapKeysAndValues($data, function (string $key, $value, array $parents) {
      if (stristr($key, '_at') && gettype($value) === 'string') {
        $time = strtotime($value);
        if ($time !== false) {
          $value = (new \DateTime())->setTimestamp($time);
        }
      }

      if (is_a($value, \DateTime::class)) {
        $value = $this->serializeDate($value);
      }
      return [$key, $value];
    });
  }
}
