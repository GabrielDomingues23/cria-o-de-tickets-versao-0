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


async function salvarticket(){
    const titulo = document.querySelector('input[placeholder="Título do ticket"]').value;
    const descricao = document.querySelector('input[placeholder="Descrição do ticket"]').value;
    const autor = localStorage.getItem('usuarioLogado') || "Usuário Anônimo";
    const selecionados = [];
    const checkboxes = document.querySelectorAll('.ticket-item input[type="checkbox"]:checked');
   
    checkboxes.forEach(cb =>{
        selecionados.push(cb.nextElementSibling.innerText)
    });
    const novoTicket = {
        autor:autor,
        titulo:titulo,
        opcoes:selecionados,
        descricao:descricao,
        data: new Date().toLocaleString(),
        Status:"Aberto"
    }
    try{
        const resposta = await fetch('http://localhost:3000/tickets', {
            method: 'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify(novoTicket)
        })
        if (resposta.ok){
            mostrarSucesso("Ticket salvo com sucesso!")
            document.querySelectorAll('input').forEach(i => i.value = "");
            checkboxes.forEach(cb => cb.checked = false);
        }
    }catch(e){
        mostrarErro("erro ao conectar ao servidor")
    }
   

}
function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    location.href = "index.html";
}
async function carregarTickets() {
    try {
        const usuarioLogado = localStorage.getItem('usuarioLogado');
        const resposta = await fetch('http://localhost:3000/tickets');
        const tickets = await resposta.json();
        const corpoTabela = document.getElementById('corpo-tabela');
        
        corpoTabela.innerHTML = ""; 

        const meusTickets = tickets.filter(t => t.autor === usuarioLogado);

        meusTickets.forEach((t, index) => {
            const tipos = t.opcoes.join(', ') || "Não definido";

            const linhaPrincipal = `
                <tr onclick="expandirDescricao(${index})" style="cursor:pointer">
                    <td><strong>${t.titulo}</strong></td>
                    <td>${tipos}</td>
                    <td><span class="status-badge">${t.status}</span></td>
                    <td><button class="btn-detalhes">Detalhes</button></td>
                </tr>
                <tr id="desc-${index}" class="linha-detalhe" style="display:none;">
                    <td colspan="4">
                        <div class="descricao-box">
                            <strong>Descrição do Chamado:</strong><br>
                            ${t.descricao || "Sem descrição informada."}
                            <br><small>Criado em: ${t.data}</small>
                        </div>
                    </td>
                </tr>
            `;
            corpoTabela.innerHTML += linhaPrincipal;
        });
    } catch (erro) {
        console.error("Erro ao carregar tabela", erro);
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