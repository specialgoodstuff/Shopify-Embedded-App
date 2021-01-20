<?php

namespace App\Http\Controllers;

use Silber\Bouncer\Bouncer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class ShopController extends Controller
{
  /**
   * Create a new shop/shop user if it doesn't exist.
   * Login the store and return the token
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request, Bouncer $bouncer)
  {
    $user = Auth::user();

    //Bouncer::get_class_methods

    //dd(get_class_methods($bouncer));

    dd($user->getAbilities()->toArray());

    if ($bouncer->can('Create shop')) {
      dd($user);
    }

    die('yep');

    /*
    $validationRules = [
      'id' => 'required',
      'domain' => 'required',
    ];
    $this->validate($request, $validationRules);

    $user = new User();
    foreach (array_keys($validationRules) as $field) {
      $user[$field] = $request[$field];
    }
    $user->save();
    $user->assign('guest');
    return $user->login();*/
  }
}
