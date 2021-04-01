<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
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
    $superAdminRole = Role::create(['name' => 'super-admin']);
    $adminRole = Role::create(['name' => 'admin']);
    $shopRole = Role::create(['name' => 'shop']);

    // Create Permissions
    $permission = Permission::create(['name' => 'shop-create']);
    //super-admin is implicitly assigned all permissions in the AuthServiceProvider

    $email = config('auth.api_username') . '@' . config('app.url');

    // Create Users
    User::firstOrCreate([
      'email' => $email,
      'username' => config('auth.api_username'),
      'password' => config('auth.api_password'),
      'type' => 'system',
    ])->assignRole('super-admin');

    User::firstOrCreate([
      'email' => 'admin@' . config('app.url'),
      'password' => 'adminPassword2021!',
      'username' => 'admin',
      'type' => 'user',
    ])->assignRole('admin');
  }
}
