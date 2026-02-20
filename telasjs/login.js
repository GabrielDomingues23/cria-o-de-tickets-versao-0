const btnEntrar = document.getElementById('btnEntrar');
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
    
    // Esconde após 2 segundos
    setTimeout(() => { fecharAlerta('alerta-sucesso'); }, 1000);
}

function fecharAlerta(id) {
    document.getElementById(id).style.display = 'none';
}

btnEntrar.onclick = async function() {
    console.log("botao clicado")
    try{
        const resposta = await fetch('http://localhost:3000/usuarios');
        const usuarios = await resposta.json();
        const listaUsuarios = Array.isArray(usuarios) ? usuarios : (usuarios.usuarios || []);
        const usuarioEncontrado = listaUsuarios.find(u => 
            u.nome === inputUser.value && u.senha === inputPass.value
        );
// u de usuario
    if (usuarioEncontrado){
        localStorage.setItem('usuarioLogado', usuarioEncontrado.nome);
        location.href = "tickets.html"; 

    } else{
        mostrarErro("Usuário ou senha incorretos.");
    }
    } catch(e){
        console.error("Erro:",e)
    }
};
