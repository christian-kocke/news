<?php namespace Api\Http\Controllers;

use Auth;
use Request;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller {

    /**
     * Handle an authentication attempt.
     *
     * @return Response
     */
    public function authenticate()
    {
        if (Auth::attempt(['email' => Request::input('email'), 'password' => Request::input('password')]))
        {
        	return response("1");
        }
    }

}
