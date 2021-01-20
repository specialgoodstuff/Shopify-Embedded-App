<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Serializes;
class AppModel extends Model
{
  use Serializes;

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

  /**
   * The attributes that aren't mass assignable.
   * Setting this property allows all fields to be mass-assignable by default.
   *
   * @var array
   */
  protected $guarded = ['created_at', 'updated_at', 'deleted_at'];

  public function getHidden(): array
  {
    return $this->hidden;
  }
}
