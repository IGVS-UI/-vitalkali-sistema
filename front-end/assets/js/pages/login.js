// login.js
// Controla o comportamento da tela de login.
// Só lida com o formulário — a lógica de token está no auth.js
// e a chamada ao backend está no api.js.

document.addEventListener('DOMContentLoaded', () => {

  // Se o usuário já estiver logado, não precisa ver o login de novo.
  // Redireciona para o painel correto conforme o perfil.
  if (Auth.estaLogado()) {
    redirecionarPorPerfil(Auth.getUsuario());
    return;
  }

  const form = document.getElementById('form-login');
  const btnEntrar = document.getElementById('btn-entrar');
  const mensagemErro = document.getElementById('mensagem-erro');
  const inputEmail = document.getElementById('email');
  const inputSenha = document.getElementById('senha');
  const toggleSenha = document.getElementById('toggle-senha');

  // ─── Mostrar/ocultar senha ───────────────────────────────────
  // Pequeno detalhe de UX que faz diferença para o usuário.
  toggleSenha.addEventListener('click', () => {
    const tipo = inputSenha.type === 'password' ? 'text' : 'password';
    inputSenha.type = tipo;
    toggleSenha.textContent = tipo === 'password' ? '👁' : '🙈';
  });

  // ─── Submissão do formulário ─────────────────────────────────
  form.addEventListener('submit', async (evento) => {
    // Previne o comportamento padrão do form de recarregar a página.
    // Em formulários modernos com JavaScript, sempre fazemos isso.
    evento.preventDefault();

    const email = inputEmail.value.trim();
    const senha = inputSenha.value;

    // Validação simples no front antes de chamar o backend.
    // Evita requisições desnecessárias para campos vazios.
    if (!email || !senha) {
      mostrarErro('Preencha o e-mail e a senha.');
      return;
    }

    // Feedback visual: desabilita o botão para evitar cliques duplos
    // e mostra que está carregando.
    setCarregando(true);
    esconderErro();

    try {
      // Chama o api.js — que chama o backend no Railway.
      // O await "pausa" aqui até o backend responder.
      const resposta = await Api.login(email, senha);

      // Backend retornou sucesso: salva a sessão e redireciona.
      Auth.salvarSessao(resposta.token, resposta.usuario);
      redirecionarPorPerfil(resposta.usuario);

    } catch (erro) {
      // Backend retornou erro (senha errada, usuário não existe, etc).
      mostrarErro(erro.message);
      setCarregando(false);
    }
  });

  // ─── Funções auxiliares ──────────────────────────────────────

  // Redireciona para a página certa conforme o perfil do usuário.
  // É aqui que a lógica de "admin vê tudo, aluno vê só o seu" começa.
  function redirecionarPorPerfil(usuario) {
    if (usuario.perfil === 'admin') {
      window.location.href = '/painel-admin.html';
    } else if (usuario.perfil === 'aluno') {
      window.location.href = '/agenda-aluno.html';
    } else {
      // Perfil desconhecido — logout por segurança.
      Auth.logout();
    }
  }

  function mostrarErro(mensagem) {
    mensagemErro.textContent = mensagem;
    mensagemErro.classList.remove('d-none');
  }

  function esconderErro() {
    mensagemErro.classList.add('d-none');
  }

  function setCarregando(carregando) {
    btnEntrar.disabled = carregando;
    btnEntrar.textContent = carregando ? 'Entrando...' : 'Entrar';
  }

});
