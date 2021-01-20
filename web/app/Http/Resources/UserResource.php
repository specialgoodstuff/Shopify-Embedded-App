<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends AppResource
{
  /**
   * Transform the resource into an array.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return array
   */
  public function toArray($request)
  {
    $data = parent::toArray($request);
    $data['roles'] = $data['roleNames'];
    unset($data['roleNames']);

    return $data;
  }
}
