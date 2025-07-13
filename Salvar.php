[]
<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['nome'], $data['divida'], $data['status'])) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
    exit;
}

$file = 'dados.json';
$clientes = [];

if (file_exists($file)) {
    $clientes = json_decode(file_get_contents($file), true);
    if (!$clientes) $clientes = [];
}

$clientes[] = [
    'nome' => $data['nome'],
    'divida' => floatval($data['divida']),
    'status' => $data['status']
];

file_put_contents($file, json_encode($clientes, JSON_PRETTY_PRINT));

echo json_encode(['success' => true]);
