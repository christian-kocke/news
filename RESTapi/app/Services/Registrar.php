<?php namespace Api\Services;

use Api\User;
use Validator;
use Illuminate\Contracts\Auth\Registrar as RegistrarContract;

class Registrar implements RegistrarContract {

	/**
	 * Get a validator for an incoming registration request.
	 *
	 * @param  array  $data
	 * @return \Illuminate\Contracts\Validation\Validator
	 */
	public function validator(array $data)
	{
		return Validator::make($data, [
			'firstname' => 'required|max:60',
			'lastname' => 'required|max:60',
			'username' => 'required|max:60',
			'email' => 'required|email|max:255|unique:users',
			'password' => 'required|confirmed|min:8|max:100',
		]);
	}

	/**
	 * Create a new user instance after a valid registration.
	 *
	 * @param  array  $data
	 * @return User
	 */
	public function create(array $data)
	{
		error_log(print_r($data, true));
		return User::create([
			'firstname' => $data['firstname'],
			'lastname' => $data['lastname'],
			'username' => $data['username'],
			'email' => $data['email'],
			'password' => bcrypt($data['password']),
			'role' => "client",
		]);
	}

}
