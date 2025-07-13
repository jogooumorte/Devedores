<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id'], $data['nome'], $data['divida'], $data['status'])) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
    exit;
}

$file = 'dados.json';

if (!file_exists($file)) {
    echo json_encode(['success' => false, 'message' => 'Arquivo não encontrado']);
    exit;
}

$clientes = json_decode(file_get_contents($file), true);
if (!$clientes) $clientes = [];

$id = intval($data['id']);
if (!isset($clientes[$id])) {
    echo json_encode(['success' => false, 'message' => 'Cliente não encontrado']);
    exit;
}

$clientes[$id] = [
    'nome' => $data['nome'],
    'divida' => floatval($data['divida']),
    'status' => $data['status']
];

file_put_contents($file, json_encode($clientes, JSON_PRETTY_PRINT));

echo json_encode(['success' => true]);
