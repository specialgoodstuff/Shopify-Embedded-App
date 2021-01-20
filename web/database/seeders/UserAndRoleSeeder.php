<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Silber\Bouncer\Bouncer;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserAndRoleSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run(Bouncer $bouncer)
  {
    // Create Roles

    $accountUserRole = $bouncer->role()->firstOrCreate([
      'name' => 'shop',
      'title' => 'Shop User',
      'level' => 100,
    ]);

    $pbmAdminRole = $bouncer->role()->firstOrCreate([
      'name' => 'admin',
      'title' => 'Admin',
      'level' => 500,
    ]);

    $superAdminRole = $bouncer->role()->firstOrCreate([
      'name' => 'super-admin',
      'title' => 'Super admin',
      'level' => 1000,
    ]);

    // Create admin and test Users and assign roles

    $apiUser = User::firstOrCreate([
      'email' => 'api-user@shopifyorderemails.com',
      'username' => 'api',
      'password' => Hash::make('itWouldBeAVeryFineThingToLetMeIn2021!'),
      'type' => 'system',
    ])->assign('super-admin');

    $superAdminUser = User::firstOrCreate([
      'email' => 'admin@shopifyorderemails.com',
      'password' => Hash::make('adminPassword2021!'),
      'username' => 'admin',
      'type' => 'user',
    ])->assign('admin');

    $bouncer->ability()->firstOrCreate([
      'name' => 'shop-create',
      'title' => 'Create shop',
    ]);

    $bouncer->allow('super-admin')->everything();
  }
}
