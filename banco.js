const API_URL = 'http://localhost:3000/usuarios';

async function buscarUsuarios() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error('Erro ao buscar dados');
        return await resposta.json();
    } catch (erro) {
        console.error("Falha na conexão com o banco:", erro);
        return [];
    }
}

async function salvarUsuario(novoUsuario) {
    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoUsuario)
        });
        return resposta.ok;
    } catch (erro) {
        console.error("Erro ao salvar no banco:", erro);
        return false;
    }
}
window.banco = { buscarUsuarios, salvarUsuario };

async function testarConexao() {
    console.log("--- Testando Conexão via Terminal ---");
    try {
        const resposta = await fetch(API_URL);
        const dados = await resposta.json();
        console.log("Conexão bem-sucedida!");
        console.table(dados);
    } catch (erro) {
        console.error("Erro: Certifique-se que o npx json-server está rodando!");
        console.error(erro.message);
    }
}
testarConexao();