<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
    exit;
}

$id = intval($data['id']);

$arquivo = 'dados.json';

if (!file_exists($arquivo)) {
    echo json_encode(['success' => false, 'message' => 'Arquivo não encontrado.']);
    exit;
}

$clientes = json_decode(file_get_contents($arquivo), true);
if (!is_array($clientes)) $clientes = [];

$clientes = array_filter($clientes, fn($c) => $c['id'] !== $id);
$clientes = array_values($clientes); // Reindexa

if (file_put_contents($arquivo, json_encode($clientes, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar no arquivo.']);
}
