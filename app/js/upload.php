<?php
error_log(print_r($_FILES, true));
header('content-type: application/json');
$h = getallheaders();
error_log(print_r($h, true));
$source = file_get_contents('php://input');
$filename = $_FILES['file']['name'];
echo json_encode(move_uploaded_file( $_FILES['file']['tmp_name'] , '../imgDrop/'.$filename ));
?>
