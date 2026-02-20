const campoUsuario = document.getElementById('nomeusuario');
const campoSenha = document.getElementById('cadastrosenha');
const btnCriar = document.getElementById('criarconta');

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
    
    setTimeout(() => { fecharAlerta('alerta-sucesso'); }, 4000);
}

btnCriar.onclick = async function() {
    const usuario = campoUsuario.value;
    const senha = campoSenha.value;

    if(usuario==""||senha=="")
    {
        mostrarErro("Por favor, preencha todos os campos!")
        return;
    }
    const novoUsuario = {
        nome: usuario,
        senha: senha
    };
    try {
        // validação se o usuário existe na db
        const busca = await fetch('http://localhost:3000/usuarios')
        const dados = await busca.json()
        const userCadastrado = Array.isArray(dados) ? dados : dados.usuario;
        const existe = userCadastrado.find(u => u.nome.toLowerCase() === usuario.toLowerCase());
        if (existe){
            mostrarErro("Este nome de usuário ja existe")
            return;
        }
        // caso passe da validação
        const resposta = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoUsuario)
        });
        if (resposta.ok) {
            mostrarSucesso("Conta salva no db.json com sucesso!");
            campoUsuario.value = "";
            campoSenha.value = "";
            voltarParaLogin();
        }
} catch (error){
        console.error("Erro ao conectar no servidor:",error)    
    }
}