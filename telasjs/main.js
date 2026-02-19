const telaLogin = document.getElementById('login');
const telaSignup = document.getElementById('signup');
const telaTicket = document.getElementById('')
const btnAbrirCadastro = document.getElementById('abrir-cadastro');
const btnVoltarLogin = document.getElementById('voltar-login');

window.voltarParaLogin = function() {
    telaSignup.style.display = 'none';
    telaLogin.style.display = 'flex';
};

btnAbrirCadastro.onclick = () => {
    telaLogin.style.display = 'none';
    telaSignup.style.display = 'flex';
};

btnVoltarLogin.onclick = () => {
    voltarParaLogin();
}

