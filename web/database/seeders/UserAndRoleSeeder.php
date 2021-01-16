<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Bouncer;
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
  public function run()
  {
    // Create Roles

    $accountUserRole = Bouncer::role()->firstOrCreate([
      'name' => 'shop',
      'title' => 'Shop User',
      'level' => 100,
    ]);

    $pbmAdminRole = Bouncer::role()->firstOrCreate([
      'name' => 'admin',
      'title' => 'Admin',
      'level' => 500,
    ]);

    $superAdminRole = Bouncer::role()->firstOrCreate([
      'name' => 'super-admin',
      'title' => 'Super admin',
      'level' => 1000,
    ]);

    // Create admin and test Users and assign roles

    $apiUser = User::firstOrCreate([
      'email' => 'api-user@shopifyorderemails.com',
      'username' => 'api',
      'password' => Hash::make('itWouldBeAVeryFineThingToLetMeIn!'),
      'type' => 'system',
    ])->assign('super-admin');

    $superAdminUser = User::firstOrCreate([
      'email' => 'admin@shopifyorderemails.com',
      'password' => Hash::make('admin-password'),
      'username' => 'admin',
      'type' => 'user',
    ])->assign('admin');
  }
}
