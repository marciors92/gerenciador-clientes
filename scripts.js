const API_URL = 'https://crudcrud.com/api/dc796a755724499bb79454b82bed5503/clientes'; // A API do CrudCrud expira após algum tempo sem uso, então pode ser que você precise atualizar essa URL.

const nomeClienteInput = document.getElementById('nomeCliente');
const emailClienteInput = document.getElementById('emailCliente');
const btnCadastrar = document.getElementById('btnCadastrar');
const clientesList = document.getElementById('clientesList');

// Função para listar todos os clientes
async function listarClientes() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
            throw new Error(`Erro HTTP! status: ${resposta.status}`);
        }
        const clientes = await resposta.json();

        clientesList.innerHTML = ''; // Limpa a lista antes de adicionar os novos clientes

        if (clientes.length === 0) {
            clientesList.innerHTML = '<p>Nenhum cliente cadastrado ainda.</p>';
            return;
        }

        clientes.forEach(cliente => {
            // Usando Template Strings para criar a estrutura HTML de forma mais legível
            const li = document.createElement('li');
            li.className = 'cliente-item';
            li.innerHTML = `
                <div>
                    <strong>Nome:</strong> ${cliente.nome}<br>
                    <strong>Email:</strong> ${cliente.email}
                </div>
                <button onclick="excluirCliente('${cliente._id}')">Excluir</button>
            `;
            clientesList.appendChild(li);
        });
    } catch (erro) {
        console.error('Erro ao listar clientes:', erro);
        clientesList.innerHTML = `<p style="color: red;">Erro ao carregar clientes: ${erro.message}</p>`;
    }
}

// Função para cadastrar um novo cliente
btnCadastrar.addEventListener('click', async () => {
    const nome = nomeClienteInput.value.trim();
    const email = emailClienteInput.value.trim();

    if (!nome || !email) {
        alert('Por favor, preencha o nome e o e-mail do cliente.');
        return;
    }

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email })
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP! status: ${resposta.status}`);
        }

        nomeClienteInput.value = '';
        emailClienteInput.value = '';
        alert('Cliente cadastrado com sucesso!');
        listarClientes(); // Atualiza a lista após o cadastro
    } catch (erro) {
        console.error('Erro ao cadastrar cliente:', erro);
        alert(`Erro ao cadastrar cliente: ${erro.message}`);
    }
});

// Função para excluir um cliente
async function excluirCliente(id) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP! status: ${resposta.status}`);
        }

        alert('Cliente excluído com sucesso!');
        listarClientes(); // Atualiza a lista após a exclusão
    } catch (erro) {
        console.error('Erro ao excluir cliente:', erro);
        alert(`Erro ao excluir cliente: ${erro.message}`);
    }
}

// Carrega os clientes ao iniciar a aplicação
document.addEventListener('DOMContentLoaded', listarClientes);