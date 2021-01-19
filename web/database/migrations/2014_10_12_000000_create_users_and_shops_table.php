<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersAndShopsTable extends Migration
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
      $table->string('email')->index();
      $table
        ->string('password')
        ->nullable()
        ->default(null);
      $table
        ->string('nylas_access_token')
        ->unique()
        ->nullable()
        ->default(null);
      $table
        ->string('shopify_access_token')
        ->unique()
        ->nullable()
        ->default(null);

      $table
        ->json('settings')
        ->nullable()
        ->default(null);

      $table
        ->string('last_login_ip')
        ->nullable()
        ->default(null)
        ->index();
      $table
        ->datetime('last_login_at')
        ->nullable()
        ->default(null)
        ->index();
      $table->timestamps();
      $table->index(['created_at', 'updated_at']);
      $table->softDeletes();
    });

    Schema::create('shops', function (Blueprint $table) {
      $table->bigInteger('id', false, true)->primary();

      $table
        ->foreignId('user_id')
        ->references('id')
        ->on('users')
        ->onUpdate('cascade')
        ->onDelete('cascade');

      $table
        ->string('domain')
        ->nullable()
        ->default(null)
        ->index();

      $table
        ->json('data')
        ->nullable()
        ->default(null);

      $table->timestamps();
      $table->index(['created_at', 'updated_at']);
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('shops');
    Schema::dropIfExists('users');
  }
}
