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
    //super-admin was implicitly assigned all permissions in the AuthServiceProvider
    //$role->givePermissionTo($permission);

    // Create Users
    User::firstOrCreate([
      'email' => 'api-user@shopifyorderemails.com',
      'username' => 'api',
      'password' => Hash::make('itWouldBeAVeryFineThingToLetMeIn2021!'),
      'type' => 'system',
    ])->assignRole('super-admin');

    User::firstOrCreate([
      'email' => 'admin@shopifyorderemails.com',
      'password' => Hash::make('adminPassword2021!'),
      'username' => 'admin',
      'type' => 'user',
    ])->assignRole('admin');
  }
}
