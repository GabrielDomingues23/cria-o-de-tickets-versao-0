const btnsalvarticket = document.getElementById("btnsaveticket");
if (btnsalvarticket) {
    btnsalvarticket.onclick = salvarticket;
}
function mostrarErro(mensagem) {
    const box = document.getElementById('alerta-erro');
    const texto = document.getElementById('mensagem-erro');
    texto.innerText = mensagem;
    box.style.display = 'flex';
    setTimeout(() => { fecharErro(); }, 4000);
}
function mostrarErro(mensagem) {
    const box = document.getElementById('alerta-erro');
    const texto = document.getElementById('mensagem-erro');
    
    texto.innerText = mensagem;
    box.style.display = 'flex';

    setTimeout(() => {
        fecharErro();
    }, 4000);
}
function fecharErro() {
    document.getElementById('alerta-erro').style.display = 'none';
}
function mostrarSucesso(mensagem) {
    const box = document.getElementById('alerta-sucesso');
    const texto = document.getElementById('mensagem-sucesso');
    texto.innerText = mensagem;
    box.style.display = 'flex';
    
    setTimeout(() => { fecharAlerta('alerta-sucesso'); }, 3000);
}


async function salvarticket() {
    const inputTitulo = document.querySelector('input[placeholder="Título do ticket"]');
    const inputDescricao = document.querySelector('input[placeholder="Descrição do ticket"]');
    
    const titulo = inputTitulo.value.trim();
    const descricao = inputDescricao.value.trim();
    const autor = localStorage.getItem('usuarioLogado') || "Usuário Anônimo";
    
    if (!titulo || !descricao) {
        mostrarErro("Por favor, preencha o Título e a Descrição antes de salvar.");
        
        if (!titulo) inputTitulo.style.borderColor = "red";
        if (!descricao) inputDescricao.style.borderColor = "red";
        
        return; 
    }

    const selecionados = [];
    const checkboxes = document.querySelectorAll('.ticket-item input[type="checkbox"]:checked');
    
    checkboxes.forEach(cb => {
        selecionados.push(cb.nextElementSibling.innerText);
    });

    if (selecionados.length === 0) {
        mostrarErro("Por favor, selecione pelo menos uma opção/tipo de ticket.");
        return;
    }

    const novoTicket = {
        autor: autor,
        titulo: titulo,
        opcoes: selecionados,
        descricao: descricao,
        data: new Date().toLocaleString(),
        status: "Aberto" 
    };

    try {
        const resposta = await fetch('http://localhost:3000/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoTicket)
        });

        if (resposta.ok) {
            mostrarSucesso("Ticket salvo com sucesso!");
            
            // Limpeza dos campos e resets de estilo
            inputTitulo.value = "";
            inputDescricao.value = "";
            inputTitulo.style.borderColor = "";
            inputDescricao.style.borderColor = "";
            checkboxes.forEach(cb => cb.checked = false);
        } else {
            mostrarErro("Servidor retornou um erro ao salvar.");
        }
    } catch (e) {
        mostrarErro("Erro ao conectar ao servidor. Verifique se ele está rodando.");
    }
}
function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    location.href = "index.html";
}
async function carregarTickets() {
    const corpoTabela = document.getElementById('corpo-tabela');
    const usuarioLogado = (localStorage.getItem('usuarioLogado') || "").trim().toLowerCase();

    if (!corpoTabela) return;

    try {
        const resposta = await fetch('http://localhost:3000/tickets');
        const tickets = await resposta.json();
        
        corpoTabela.innerHTML = ""; 

        const meusTickets = tickets.filter(t => {
            const autorTicket = (t.autor || "").trim().toLowerCase();
            return autorTicket === usuarioLogado;
        });

        if (meusTickets.length === 0) {
            corpoTabela.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color: #fff;">Nenhum ticket encontrado para o usuário: <strong>${usuarioLogado}</strong></td></tr>`;
            return;
        }

        meusTickets.forEach((t, index) => {
            const tipos = (t.opcoes && Array.isArray(t.opcoes)) ? t.opcoes.join(', ') : "Geral";
            const statusAtual = t.status || t.Status || "Aberto";

            corpoTabela.innerHTML += `
                <tr onclick="expandirDescricao(${index})" class="linha-ticket">
                    <td><strong>${t.titulo}</strong></td>
                    <td>${tipos}</td>
                    <td><span class="status-badge">${statusAtual}</span></td>
                    <td>
                        <button class="btn-finalizar" onclick="event.stopPropagation(); finalizarTicket('${t.id}')">✔</button>
                        <button class="btn-deletar" onclick="event.stopPropagation(); deletarTicket('${t.id}')">✖</button>
                    </td>
                </tr>
                <tr id="desc-${index}" class="detalhe-oculto" style="display:none;">
                    <td colspan="4">
                        <div class="descricao-box">
                            <strong>Descrição do Chamado:</strong><br>
                            ${t.descricao || "Sem descrição informada."}
                            <br><small>Criado em: ${t.data}</small>
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch (erro) {
        console.error("Erro ao carregar:", erro);
        corpoTabela.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Erro de conexão.</td></tr>`;
    }
}

function expandirDescricao(index) {
    const elemento = document.getElementById(`desc-${index}`);
    elemento.style.display = elemento.style.display === 'none' ? 'table-row' : 'none';
}

function filtrarTabela() {
    const input = document.getElementById("filtroTicket");
    const filtro = input.value.toLowerCase();
    const tabela = document.getElementById("corpo-tabela");
    const linhas = tabela.getElementsByTagName("tr");

    for (let i = 0; i < linhas.length; i += 2) {
        const titulo = linhas[i].getElementsByTagName("td")[0].innerText.toLowerCase();
        const tipo = linhas[i].getElementsByTagName("td")[1].innerText.toLowerCase();
        
        if (titulo.includes(filtro) || tipo.includes(filtro)) {
            linhas[i].style.display = "";
        } else {
            linhas[i].style.display = "none";
            linhas[i+1].style.display = "none";
        }
    }
}
function toggleTabela() {
    const div = document.getElementById('secao-tabela');
    if (div.style.display === 'none') {
        div.style.display = 'block';
        carregarTickets();
    } else {
        div.style.display = 'none';
    }
}
// Garante que a tabela carregue assim que abrir a página
window.onload = () => {
    carregarTickets();
    
    // Configura o botão de sair que está no header
    const btnSair = document.getElementById('btnSair');
    if (btnSair) {
        btnSair.onclick = fazerLogout;
    }
};
window.deletarTicket = async function(id) {
    if (!confirm("Tem certeza que deseja excluir este ticket?")) return;

    try {
        const resposta = await fetch(`http://localhost:3000/tickets/${id}`, {
            method: 'DELETE'
        });

        if (resposta.ok) {
            mostrarSucesso("Ticket removido com sucesso!");
            carregarTickets();
        }
    } catch (e) {
        console.error("Erro ao deletar:", e);
        mostrarErro("Erro ao conectar com o servidor.");
    }
};

window.finalizarTicket = async function(id) {
    if (!confirm("Deseja finalizar este ticket?")) return;

    try {
        const resposta = await fetch(`http://localhost:3000/tickets/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: "Finalizado" })
        });

        if (resposta.ok) {
            mostrarSucesso("Ticket finalizado!");
            carregarTickets(); 
        } else {
            const erroData = await resposta.json();
            console.error("Erro do servidor:", erroData.mensagem);
        }
    } catch (e) {
        mostrarErro("Não foi possível conectar ao servidor.");
    }
};