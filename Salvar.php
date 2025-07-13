<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['nome'], $data['divida'], $data['status'])) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
    exit;
}

$nome = trim($data['nome']);
$divida = floatval($data['divida']);
$status = $data['status'];

if ($nome === '' || ($status !== 'devedor' && $status !== 'quite')) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
    exit;
}

$arquivo = 'dados.json';
$clientes = [];

if (file_exists($arquivo)) {
    $clientes = json_decode(file_get_contents($arquivo), true);
    if (!is_array($clientes)) $clientes = [];
}

// Gera um ID único incremental
$ids = array_column($clientes, 'id');
$novoId = $ids ? max($ids) + 1 : 1;

$novoCliente = [
    'id' => $novoId,
    'nome' => $nome,
    'divida' => $divida,
    'status' => $status
];

$clientes[] = $novoCliente;

if (file_put_contents($arquivo, json_encode($clientes, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar no arquivo.']);
}
