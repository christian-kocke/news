<?php namespace Api\Http\Controllers;

use Auth;
use Api\Http\Requests;
use Api\Http\Controllers\Controller;

use Illuminate\Http\Request;

class UserController extends Controller {

	private $_user;
	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Authenticate the user.
	 *
	 * @return Response
	 */
	public function authenticate(Request $request)
    {
        if (Auth::attempt(['email' => $request->input('email'), 'password' => $request->input('password')]))
        {
        	$this->_user = Auth::user();
        	return response()->json(["id" => csrf_token(), "user" => ["id" => $this->_user->id, "name" => $this->_user->name]]);
        }
    }

	/**
	 * Display the specified resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		if(Auth::check()){
			error_log(Auth::user());
			return response()->json(["id" => csrf_token(), "user" => ["id" => $this->_user->id, "name" => $this->_user->name]]);
		}
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

}
