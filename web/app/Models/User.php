<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;
use Carbon\Carbon;
use App\Traits\Serializes;
use Spatie\Permission\Traits\HasRoles;
use App\Models\Shop;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
  use HasFactory, Notifiable, Serializes, HasApiTokens, HasRoles;

  /**
   * The attributes that aren't mass assignable.
   * Setting this property allows all fields to be mass-assignable by default.
   *
   * @var array
   */
  protected $guarded = ['created_at', 'updated_at', 'deleted_at'];

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = ['roles', 'password', 'created_at', 'updated_at', 'deleted_at', 'last_login_ip'];

  /**
   * The accessors to append to the model's array form.
   *
   * @var array
   */
  protected $appends = ['roleNames', 'accessToken'];

  /**
   * The attributes that should be cast to native types.
   *
   * @var array
   */
  protected $casts = [];

  /**
   * Get the shop that owns the user.
   */
  public function shop()
  {
    return $this->hasOne(Shop::class);
  }

  public function getLoginToken()
  {
    $token = $this->tokens()->firstWhere('name', 'login-token');
    if (empty($token)) {
      $token = $this->createToken('login-token');
    }

    return $token;
  }

  /**
   * Updates token relevant timestamps / login information
   */
  public function login(): User
  {
    $this->update([
      'last_login_ip' => $_SERVER['REMOTE_ADDR'],
      'last_login_at' => Carbon::now(),
    ]);

    return $this;
  }

  /**
   * Makes roles availale via $this->roles
   */
  public function getRoleNamesAttribute()
  {
    return $this->getRoleNames();
  }

  /**
   * Makes active availale via $this->token
   */
  public function getAccessTokenAttribute()
  {
    $token = $this->getLoginToken();
    //$this->withAccessToken($token);
    return $this->id . '|' . Crypt::decryptString($token->token);
  }

  /**
   * Set the user type
   *
   * @param  string  $value
   * @return void
   */
  public function setTypeAttribute(string $value)
  {
    $validTypes = ['user', 'shop', 'system'];
    if (!in_array($value, $validTypes)) {
      throw new \InvalidArgumentException(
        "The user type '$value' must be one of the following: " . implode(', ', $validTypes) . '.'
      );
    }
    $this->attributes['type'] = $value;
  }

  /**
   * Set and has the user password
   *
   * @param  string  $value
   * @return void
   */
  public function setPasswordAttribute(string $value)
  {
    if (empty($value)) {
      throw new \InvalidArgumentException('The user password must not be empty.');
    }
    $this->attributes['password'] = Hash::make($value);
  }
}
