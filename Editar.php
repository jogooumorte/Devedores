<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id'], $data['nome'], $data['divida'], $data['status'])) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
    exit;
}

$id = intval($data['id']);
$nome = trim($data['nome']);
$divida = floatval($data['divida']);
$status = $data['status'];

if ($nome === '' || ($status !== 'devedor' && $status !== 'quite')) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
    exit;
}

$arquivo = 'dados.json';

if (!file_exists($arquivo)) {
    echo json_encode(['success' => false, 'message' => 'Arquivo não encontrado.']);
    exit;
}

$clientes = json_decode(file_get_contents($arquivo), true);
if (!is_array($clientes)) $clientes = [];

$encontrado = false;
foreach ($clientes as &$cliente) {
    if ($cliente['id'] === $id) {
        $cliente['nome'] = $nome;
        $cliente['divida'] = $divida;
        $cliente['status'] = $status;
        $encontrado = true;
        break;
    }
}

if (!$encontrado) {
    echo json_encode(['success' => false, 'message' => 'Cliente não encontrado.']);
    exit;
}

if (file_put_contents($arquivo, json_encode($clientes, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar no arquivo.']);
}
