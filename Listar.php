<?php
header('Content-Type: application/json');
$file = 'dados.json';

if (!file_exists($file)) {
    echo json_encode([]);
    exit;
}

$clientes = json_decode(file_get_contents($file), true);
if (!$clientes) $clientes = [];

echo json_encode($clientes);
