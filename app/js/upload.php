<?php
	header('content-type: application/json');

	$source = file_get_contents('php://input');
	$filename = $_FILES['file']['name'];
	echo json_encode(move_uploaded_file( $_FILES['file']['tmp_name'] , '../imgDrop/user'.$id ));
?>
