<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ShopController extends Controller
{
  /**
   * Create a new shop/shop user if it doesn't exist.
   * Login the store and return the token
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    // @todo - implement authentication
    //$currentUser = Auth::user();
    //dd($currentUser);

    $validationRules = [
      'first_name' => 'required|max:40',
      'last_name' => 'required|max:255',
      'email' => 'required|email|unique:users',
      'password' => 'required|min:8',
    ];
    $this->validate($request, $validationRules);

    $user = new User();
    foreach (array_keys($validationRules) as $field) {
      $user[$field] = $request[$field];
    }
    $user->save();
    $user->assign('guest');
    return $user->login();
  }
}
