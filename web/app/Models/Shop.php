<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
class Shop extends AppModel
{
  use HasFactory;

  protected $fillable = ['id', 'domain', 'data'];

  /**
   * Get the user associated with the shop.
   */
  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
