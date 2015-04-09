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
		if(Auth::check()){
			error_log(Auth::user());
			return response()->json(["id" => csrf_token(), "user" => Auth::user()]);
		}
	}

	public function setPicture(Request $request){
		if($request->file('file')->isValid() && Auth::check()){
			$fileName = 'user_'.str_random(20).".".$request->file('file')->guessExtension();
			if($request->file('file')->move('../../app/imgDrop/', $fileName)) DB::update('update users set img = ? where id = ?', [$fileName, Auth::user()->id]);
			return response("1");
		}
		return response("upload failure", 460);
	}


	public function getPicture(){
		if(Auth::check()){
			$path = '/project/app/imgDrop/'.DB::select('select img from users where id = ?', [Auth::user()->id])[0]->img;
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
