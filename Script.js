const form = document.getElementById('formCliente');
const listaClientes = document.getElementById('listaClientes');
const btnCancelar = document.getElementById('btnCancelar');
const totalClientesEl = document.getElementById('totalClientes');
const totalDividasEl = document.getElementById('totalDividas');
const mensagemEl = document.getElementById('mensagem');

let clientes = [];
let editandoId = null;

function mostrarMensagem(texto, tipo = 'erro') {
  mensagemEl.textContent = texto;
  if (tipo === 'erro') {
    mensagemEl.style.color = 'red';
  } else {
    mensagemEl.style.color = 'green';
  }
}

// Carrega clientes do backend
function carregarClientes() {
  fetch('listar.php')
    .then(res => res.json())
    .then(data => {
      clientes = data || [];
      renderizarLista();
      atualizarResumo();
      mostrarMensagem('', 'sucesso'); // limpa mensagem
    })
    .catch(err => mostrarMensagem('Erro ao carregar clientes: ' + err.message));
}

// Renderiza a lista de clientes
function renderizarLista() {
  listaClientes.innerHTML = '';

  if (clientes.length === 0) {
    listaClientes.innerHTML = '<p>Nenhum cliente cadastrado.</p>';
    return;
  }

  clientes.forEach(cliente => {
    const card = document.createElement('div');
    card.className = 'card';

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `
      <strong>${cliente.nome}</strong><br/>
      Dívida: R$ ${parseFloat(cliente.divida).toFixed(2).replace('.', ',')}<br/>
      Status: ${cliente.status === 'devedor' ? 'Devedor' : 'Quite'}
    `;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.onclick = () => editarCliente(cliente.id);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.onclick = () => excluirCliente(cliente.id);

    actions.appendChild(btnEditar);
    actions.appendChild(btnExcluir);

    card.appendChild(info);
    card.appendChild(actions);

    listaClientes.appendChild(card);
  });
}

// Atualiza resumo de total de clientes e dívidas
function atualizarResumo() {
  totalClientesEl.textContent = `Total de clientes: ${clientes.length}`;
  const totalDividas = clientes.reduce((acc, c) => acc + parseFloat(c.divida), 0);
  totalDividasEl.textContent = `Total de dívidas: R$ ${totalDividas.toFixed(2).replace('.', ',')}`;
}

// Editar cliente pelo id
function editarCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) {
    mostrarMensagem('Cliente não encontrado para edição.');
    return;
  }

  document.getElementById('clienteId').value = id;
  document.getElementById('nome').value = cliente.nome;
  document.getElementById('divida').value = cliente.divida;
  document.getElementById('status').value = cliente.status;

  editandoId = id;
  btnCancelar.style.display = 'inline-block';
  mostrarMensagem('');
}

// Excluir cliente pelo id
function excluirCliente(id) {
  if (!confirm('Deseja realmente excluir este cliente?')) return;

  fetch('excluir.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id})
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      mostrarMensagem('Cliente excluído com sucesso!', 'sucesso');
      carregarClientes();
    } else {
      mostrarMensagem('Erro ao excluir cliente: ' + (data.message || 'Erro desconhecido'));
    }
  })
  .catch(err => mostrarMensagem('Erro na comunicação com o servidor: ' + err.message));
}

// Cancelar edição
btnCancelar.onclick = () => {
  form.reset();
  editandoId = null;
  btnCancelar.style.display = 'none';
  mostrarMensagem('');
};

// Envio do formulário para salvar ou editar
form.onsubmit = e => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const divida = document.getElementById('divida').value;
  const status = document.getElementById('status').value;

  if (!nome || divida === '') {
    mostrarMensagem('Por favor, preencha todos os campos.', 'erro');
    return;
  }

  const cliente = { nome, divida: parseFloat(divida), status };

  let url = 'salvar.php';
  if (editandoId !== null) {
    cliente.id = editandoId;
    url = 'editar.php';
  }

  fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(cliente)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      mostrarMensagem('Operação realizada com sucesso!', 'sucesso');
      form.reset();
      editandoId = null;
      btnCancelar.style.display = 'none';
      carregarClientes();
    } else {
      mostrarMensagem('Erro: ' + (data.message || 'Falha ao salvar cliente.'), 'erro');
    }
  })
  .catch(err => mostrarMensagem('Erro na comunicação com o servidor: ' + err.message));
};

// Inicializa ao carregar a página
carregarClientes();
    
