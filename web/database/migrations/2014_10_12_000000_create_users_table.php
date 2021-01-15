<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('users', function (Blueprint $table) {
      $table->id();
      $table->string('username')->unique();
      $table
        ->string('type')
        ->default('shop')
        ->index();
      $table->string('email');
      $table
        ->string('password')
        ->nullable()
        ->default(null);
      $table
        ->string('access_token', 80)
        ->unique()
        ->nullable()
        ->default(null);
      $table
        ->datetime('token_expires_at')
        ->nullable()
        ->index();
      $table
        ->string('last_login_ip')
        ->nullable()
        ->index();
      $table
        ->datetime('last_login_at')
        ->nullable()
        ->index();
      $table->timestamps();
      $table->index(['created_at', 'updated_at']);
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('users');
  }
}
