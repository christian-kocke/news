<?php
header('content-type: application/json');
$h = getallheaders();
$o = new stdClass();
$source = file_get_contents('php://input');
$types = array('image/png', 'image/jpg', 'image/jpeg', 'image/gif');

if(!in_array($h['x-file-type'], $types)) {
	$o->error = 'Wrong Format (only: .png / .jpg / .jpeg / .gif'; 
} else {
	file_put_contents('/project/app/imgDrop'.$h['x-file-name'], $source);
	$o->name = $h['x-file-name'];
	$o->content = '<img src="/project/app/imgDrop/'.$h['x-file-name'].'"/>';
}

echo json_encode($o);
?>
