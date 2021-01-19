<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Models\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;
use Illuminate\Container\Container;
use Silber\Bouncer\Bouncer;

class AppServiceProvider extends ServiceProvider
{
  /**
   * Register any application services.
   *
   * @return void
   */
  public function register()
  {
    // Controls has morphable relationship types are stored in the DB
    Relation::morphMap([
      'User' => 'App\Models\User',
    ]);

    Container::getInstance()->singleton(Bouncer::class, function () {
      return Bouncer::create();
    });
  }

  /**
   * Bootstrap any application services.
   *
   * @return void
   */
  public function boot()
  {
    Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
  }
}
