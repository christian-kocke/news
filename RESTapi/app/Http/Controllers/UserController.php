<?php namespace Api\Http\Controllers;

use Auth;
use DB;
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
	public function create(Registrar $registrar, Request $request)
	{
		if($registrar->validator((array) $request)->passes())
		{
			$registrar->create((array) $request);
		}
	}

	/**
	 * Authenticate the user.
	 *
	 * @return Response
	 */
	public function authenticate(Request $request)
    {
        if(Auth::attempt(['email' => $request->input('email'), 'password' => $request->input('password')]))
        {
        	$this->_user = Auth::user();
        	return response()->json(["id" => csrf_token(), "user" => Auth::user()]);
        }
    }

    public function logout()
    {
    	return response(Auth::logout());
    }
	/**
	 * Display the specified resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		if(Auth::check())
		{
			return response()->json(["id" => csrf_token(), "user" => Auth::user()]);
		}
	}

	public function setPicture(Request $request)
	{
		if($request->file('file')->isValid() && Auth::check())
		{
			$filePath = '/project/app/imgDrop/user_'.Auth::user()->id.".".$request->file('file')->guessExtension();
			if($request->file('file')->move('../../app/imgDrop/', $filePath))
			{
				DB::update('update users set img = ? where id = ?', [$filePath, Auth::user()->id]);
				return response($filePath);	
			}
		}
		return response("upload failure.", 441);
	}


	public function getPicture()
	{
		if(Auth::check())
		{
			$path = DB::select('select img from users where id = ?', [Auth::user()->id])[0]->img;
			return response($path);
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
