<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Silber\Bouncer\Database\HasRolesAndAbilities;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Traits\Serializes;

class User extends Authenticatable
{
  use HasFactory, Notifiable, HasRolesAndAbilities, Serializes;

  /**
   * The attributes that aren't mass assignable.
   * Setting this property allows all fields to be mass-assignable by default.
   *
   * @var array
   */
  protected $guarded = [];

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = [
    'password',
    'remember_token',
    'created_at',
    'updated_at',
    'deleted_at',
    'email_verified_at',
    'last_login_ip',
  ];

  /**
   * The accessors to append to the model's array form.
   *
   * @var array
   */
  protected $appends = ['roles'];

  /**
   * The attributes that should be cast to native types.
   *
   * @var array
   */
  protected $casts = [
    'email_verified_at' => 'datetime',
  ];

  /**
   * Get the bookmarks for this user.
   */
  public function bookmarks(): object
  {
    return $this->hasMany(Bookmark::class);
  }

  public function bookmarksByType(string $type): object
  {
    return $this->bookmarks()->where('bookmarks.model_type', $type);
  }

  public function isBookmarked(object $object): bool
  {
    return $this->bookmarks()
      ->where([['bookmarks.model_type', get_class($object)], ['bookmarks.model_id', $object->id]])
      ->exists();
  }

  public function bookmark(object $object): object
  {
    if ($this->isBookmarked($object)) {
      return $this->bookmarks()
        ->where([['bookmarks.model_type', get_class($object)], ['bookmarks.model_id', $object->id]])
        ->delete();
    }

    return $this->bookmarks()->create(['model_type' => get_class($object), 'model_id' => $object->id]);
  }

  /**
   * Updates token relevant timestamps / login information
   */
  public function login(): User
  {
    $this->update([
      'api_token' => Str::random(60),
      'token_expires_at' => Carbon::now()->addDays(1),
      'last_login_ip' => $_SERVER['REMOTE_ADDR'],
      'last_login_at' => Carbon::now(),
    ]);

    return $this;
  }

  /**
   * Makes roles availale via $this->roles
   */
  public function getRolesAttribute()
  {
    return $this->getRoles();
  }
}
