<?php namespace Api\Http\Controllers;

use Auth;
use DB;
use Illuminate\Contracts\Auth\Registrar;
use Api\Http\Requests;
use Api\Http\Controllers\Controller;

use Illuminate\Http\Request;

class UserController extends Controller {

	private $_user;

	public function __construct(Request $request, Registrar $registrar)
	{
		$this->_request = $request;
		$this->_registrar = $registrar;
	}
	/**
	 * Create a new user.
	 *
	 * @return Response
	 */
	public function store()
	{	
		error_log(print_r($this->_request->all(), true));
		$validator = $this->_registrar->validator($this->_request->all());
		if($validator->passes())
		{
			return response($this->_registrar->create($this->_request->all()));
		}
		return response()->json($validator->messages());
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
		return response("Get path failed.", 442);
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
