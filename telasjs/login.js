const btnEntrar = document.querySelector('#login button:last-of-type');
const inputUser = document.querySelector('#login input[type="text"]');
const inputPass = document.querySelector('#login input[type="password"]');

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
    
    // Esconde após 3 segundos
    setTimeout(() => { fecharAlerta('alerta-sucesso'); }, 3000);
}

function fecharAlerta(id) {
    document.getElementById(id).style.display = 'none';
}

btnEntrar.onclick = async function() {
    try{
        const resposta = await fetch('http://localhost:3000/usuarios');
        const usuarios = await resposta.json();
// u de usuario
    const usuarioEncontrado = usuarios.find(u => u.nome === inputUser.value && u.senha === inputPass.value);
    if (usuarioEncontrado){
        localStorage.setItem('usuarioLogado', usuarioEncontrado.nome);
        mostrarSucesso(`Bem vindo ${usuarioEncontrado.nome}`)
        setTimeout(() => {
                location.href = "tickets.html"; 
            }, 2000);
    } else{
        mostrarErro("Usuário ou senha incorretos.");
    }
    } catch(e){
        console.error("Erro:",e)
    }
    
};