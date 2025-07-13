<?php
header('Content-Type: application/json');

$arquivo = 'dados.json';

if (file_exists($arquivo)) {
    $clientes = json_decode(file_get_contents($arquivo), true);
    if (!is_array($clientes)) $clientes = [];
} else {
    $clientes = [];
}

echo json_encode($clientes);
