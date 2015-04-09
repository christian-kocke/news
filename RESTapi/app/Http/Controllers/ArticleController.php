<?php namespace Api\Http\Controllers;

use DB;
use Api\Http\Requests;
use Api\Http\Controllers\Controller;

use Illuminate\Http\Request;

class ArticleController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		error_log("dans laravel");
		$result = DB::select('select a.id, a.title, a.content, a.timestamp, a.img_path, a.categorie, u.username from articles a inner join users u on u.id = a.author_id');
		if($result) 
		{
			foreach ($result as $article) {
				$article->timestamp = date('F d, Y', strtotime($article->timestamp));
			}
			return response()->json($result);
		}
		return response("Selection Failed.", 451);
	}

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
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(Request $request)
	{
		if(DB::insert('insert into articles (title, content, author_id, img_path, categorie) values (?, ?, ?, ?, ?)', [$request->input('title'), $request->input('content'), $request->input('author_id'), $request->input('img_path'), $request->input('categorie')])) 
		{
			return response("1");
		} 
		return response("Insertion Failed.", 450);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
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
