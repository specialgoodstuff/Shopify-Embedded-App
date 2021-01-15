<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
  public function login(Request $request)
  {
    $this->validate($request, [
      'email' => 'required|email',
      'password' => 'required',
    ]);

    $user = User::where('email', '=', $request->email)->first();
    if (empty($user)) {
      throw ValidationException::withMessages([
        'email' => 'The email address ' . $request->email . ' is not registered',
      ]);
    }

    if (!Hash::check($request->password, $user->password)) {
      throw ValidationException::withMessages(['password' => 'The password is incorrect']);
    }

    return $user->login();
  }

  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    //
  }

  /**
   * Store a newly created resource in storage.
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

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\User  $user
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, User $user)
  {
    //
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\User  $user
   * @return \Illuminate\Http\Response
   */
  public function show(User $user)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\User  $user
   * @return \Illuminate\Http\Response
   */
  public function destroy(User $user)
  {
    //
  }

  /**
   * Retrieve the logged in user's bookmarks
   */
  public function bookmarks()
  {
  }
}
