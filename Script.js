const form = document.getElementById('formCliente');
const listaClientes = document.getElementById('listaClientes');
const btnCancelar = document.getElementById('btnCancelar');

let clientes = [];
let editandoId = null;

// Função para carregar clientes do servidor
function carregarClientes() {
  fetch('listar.php')
    .then(res => res.json())
    .then(data => {
      clientes = data || [];
      renderizarLista();
    })
    .catch(() => alert('Erro ao carregar clientes.'));
}

// Renderiza a lista na tela
function renderizarLista() {
  listaClientes.innerHTML = '';
  if (clientes.length === 0) {
    listaClientes.innerHTML = '<p>Nenhum cliente cadastrado.</p>';
    return;
  }

  clientes.forEach((cliente, index) => {
    const card = document.createElement('div');
    card.className = 'card';

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `
      <strong>${cliente.nome}</strong><br/>
      Dívida: R$ ${parseFloat(cliente.divida).toFixed(2)}<br/>
      Status: ${cliente.status === 'devedor' ? 'Devedor' : 'Quite'}
    `;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.onclick = () => editarCliente(index);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.onclick = () => excluirCliente(index);

    actions.appendChild(btnEditar);
    actions.appendChild(btnExcluir);

    card.appendChild(info);
    card.appendChild(actions);

    listaClientes.appendChild(card);
  });
}

// Editar cliente
function editarCliente(index) {
  const cliente = clientes[index];
  document.getElementById('clienteId').value = index;
  document.getElementById('nome').value = cliente.nome;
  document.getElementById('divida').value = cliente.divida;
  document.getElementById('status').value = cliente.status;
  editandoId = index;
  btnCancelar.style.display = 'inline-block';
}

// Excluir cliente
function excluirCliente(index) {
  if (!confirm('Deseja realmente excluir este cliente?')) return;

  fetch('excluir.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: index})
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      carregarClientes();
    } else {
      alert('Erro ao excluir cliente.');
    }
  });
}

// Cancelar edição
btnCancelar.onclick = () => {
  form.reset();
  editandoId = null;
  btnCancelar.style.display = 'none';
};

// Envio do formulário
form.onsubmit = e => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const divida = document.getElementById('divida').value;
  const status = document.getElementById('status').value;

  if (!nome || divida === '') {
    alert('Preencha todos os campos.');
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
      form.reset();
      editandoId = null;
      btnCancelar.style.display = 'none';
      carregarClientes();
    } else {
      alert('Erro ao salvar cliente.');
    }
  });
};

// Inicializa a lista ao carregar a página
carregarClientes();
