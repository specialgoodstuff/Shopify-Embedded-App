<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Helpers\Arr;

class AppResource extends JsonResource
{
  public function getNonHiddenFields()
  {
    return $this->resource->toArray();
  }

  /**
   * Transform the resource into an array.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return array
   */
  public function toArray($request)
  {
    $data = $this->getNonHiddenFields();
    return Arr::camelKeys($data);
  }

  public function toCamelCase(array $data)
  {
    return Arr::camelKeys($data);
  }
}
