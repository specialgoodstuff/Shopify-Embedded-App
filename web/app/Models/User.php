<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Silber\Bouncer\Database\HasRolesAndAbilities;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Traits\Serializes;

class User extends Authenticatable
{
  use HasFactory, Notifiable, HasRolesAndAbilities, Serializes, HasApiTokens;

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
  protected $hidden = ['password', 'remember_token', 'created_at', 'updated_at', 'deleted_at', 'last_login_ip'];

  /**
   * The accessors to append to the model's array form.
   *
   * @var array
   */
  protected $appends = ['roles', 'accessToken'];

  /**
   * The attributes that should be cast to native types.
   *
   * @var array
   */
  protected $casts = [];

  /**
   * Updates token relevant timestamps / login information
   */
  public function login(): User
  {
    $this->update([
      'last_login_ip' => $_SERVER['REMOTE_ADDR'],
      'last_login_at' => Carbon::now(),
    ]);

    $this->tokens()
      ->where('name', 'login-token')
      ->delete();
    $token = $this->createToken('login-token');
    //set current active access token
    $this->withAccessToken($token);
    return $this;
  }

  /**
   * Makes roles availale via $this->roles
   */
  public function getRolesAttribute()
  {
    return $this->getRoles();
  }

  /**
   * Makes active availale via $this->token
   */
  public function getAccessTokenAttribute()
  {
    return $this->currentAccessToken()->plainTextToken;
  }
}
