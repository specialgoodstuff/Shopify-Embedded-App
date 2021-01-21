<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Shop;
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
    $createValidationRules = [
      'email' => 'required|email',
      'domain' => 'required|string',
      'data' => 'nullable|json',
      'shopifyAccessToken' => 'nullable|string',
    ];

    $updateValidationRules = array_merge($createValidationRules, [
      'email' => 'email',
      'domain' => 'string',
    ]);

    $this->validate($request, ['id' => 'required|numeric']);

    $shop = Shop::find($request->get('id'));

    if (empty($shop)) {
      $this->validate($request, $createValidationRules);
    } else {
      $this->validate($request, $updateValidationRules);
    }

    $shopUser = User::where('username', $request->get('id'))->first();

    $shopUserData = [
      'username' => $request->get('id'),
      'shopifyAccessToken' => $request->get('shopifyAccessToken'),
      'email' => $request->get('email'),
      'type' => 'shop',
      'password' => env('SOE_SHOP_PASSWORD', 'luckBeALady021!'),
    ];

    if (empty($shopUser)) {
      $shopUser = User::create($shopUserData);
    } else {
      $shopUser->update($shopUserData);
    }
    $shopUser->assignRole('shop');

    if (empty($shop)) {
      $shop = new Shop();
    }
    $shop->fill($request->all());
    $shop->user()->associate($shopUser);
    $shop->save();

    return Shop::where('id', $request->get('id'))
      ->with('user')
      ->first();
  }
}
